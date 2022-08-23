import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { mergeMap, tap, map, shareReplay, toArray } from 'rxjs/operators';
import {
  permissions as perms,
  routingUrls,
  superAdminText
} from 'src/app/app.constants';
import { Role, ErrorInfo } from 'src/app/interfaces';
import { CommonService } from 'src/app/shared/services/common.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { ToastService } from 'src/app/shared/toast';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { CancelModalComponent } from '../cancel-modal/cancel-modal.component';
import { RoleDeleteModalComponent } from '../role-delete-modal/role-delete-modal.component';
import { RolesPermissionsService } from '../services/roles-permissions.service';
import { generateCopyNumber, generateCopyRegex } from '../utils/utils';

interface RolesListUpdate {
  action: 'add' | 'edit' | 'delete' | 'copy' | null;
  role: Role;
}

const info: ErrorInfo = {
  displayToast: true,
  failureResponse: 'throwError'
};

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent implements OnInit, AfterViewChecked {
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;
  readonly superAdminText = superAdminText;

  rolesList$: Observable<Role[]> = of([]);
  selectedRoleList = [];
  selectedRoleIDList = [];
  permissionsList$: Observable<any>;
  selectedRolePermissions$: Observable<any[]>;
  rolesListUpdate$: BehaviorSubject<RolesListUpdate> =
    new BehaviorSubject<RolesListUpdate>({
      action: null,
      role: {} as Role
    });

  selectedRole = null;
  roleForm: FormGroup;
  updatedPermissions = [];
  copyDisabled = false;
  showCancelBtn = false;
  disableSaveButton: boolean;
  addingRole$ = new BehaviorSubject<boolean>(false);
  permissionsTotalLength$: Observable<number>;
  rolesList: Role[] = [];
  readonly perms = perms;
  usersExists = [];
  usersDoesntExists = [];
  roleMode: string;
  roleFormChanged: { isChanged: boolean };

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private roleService: RolesPermissionsService,
    private cdrf: ChangeDetectorRef,
    public dialog: MatDialog,
    private toast: ToastService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() =>
        this.headerService.setHeaderTitle(routingUrls.rolesPermissions.title)
      )
    );
    this.roleForm = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        WhiteSpaceValidator.noWhiteSpace,
        this.roleNameValidator()
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
        WhiteSpaceValidator.noWhiteSpace
      ])
    });
    this.getRoles();
    this.getAllPermissions();
    this.roleForm.valueChanges
      .pipe(
        tap(() => {
          if (this.roleMode === 'edit') {
            this.roleFormChanged = { isChanged: true };
          }
        })
      )
      .subscribe();
  }

  ngAfterViewChecked(): void {
    this.cdrf.detectChanges();
  }

  rolePermissionsHandler(permissions: any): void {
    this.updatedPermissions = permissions;
    this.disableSaveButton = !this.isPermissionsChecked();
  }

  isPermissionsChecked(): boolean {
    let permissionsChecked = false;
    this.updatedPermissions.forEach((module) => {
      if (module.countOfChecked) {
        permissionsChecked = true;
      }
    });
    return permissionsChecked;
  }

  getRoles() {
    const initialRolesList$ = this.roleService
      .getRolesWithPermissions$()
      .pipe(shareReplay(1))
      .pipe(
        tap((roles) => {
          if (roles.length) {
            this.showSelectedRole(roles[0]);
          }
        })
      );
    this.rolesList$ = combineLatest([
      initialRolesList$,
      this.rolesListUpdate$
    ]).pipe(
      map(([roles, update]) => {
        const { role, action } = update;
        switch (action) {
          case 'add':
            roles.push(role);
            break;
          case 'edit':
            const index = roles.findIndex((r) => r.id === role.id);
            roles[index] = role;
            break;
          case 'delete':
            const indexToDelete = roles.findIndex((r) => r.id === role.id);
            roles.splice(indexToDelete, 1);
            break;
          case 'copy':
            const newRole = this.createDuplicateRole(roles, role);
            const postRole = {
              ...newRole,
              permissionIds: newRole.permissionIds.map((p) => p.id)
            };
            this.roleService.createRole$(postRole).subscribe((resp) => {
              if (Object.keys(resp).length) {
                roles.push({ ...newRole, id: resp.id });
                this.showSelectedRole(resp);
                this.toast.show({
                  text: 'Role copied successfully',
                  type: 'success'
                });
                this.selectedRolePermissions$ = of(postRole.permissionIds);
              }
            });
            break;
        }
        return roles;
      }),
      tap((rolesList) => {
        this.rolesList = rolesList;
      }),
      shareReplay(1)
    );
  }

  getAllPermissions() {
    this.permissionsList$ = this.roleService.getPermissions$().pipe();
    this.permissionsTotalLength$ = this.permissionsList$.pipe(
      map((permissionsList) => {
        let length = 0;
        permissionsList.forEach((module) => {
          length += module.permissions.length;
        });
        return length;
      })
    );
  }

  roleChecked = (role, event) => {
    if (event.checked === true) {
      this.selectedRoleList.push(role);
      this.selectedRoleIDList.push(role.id);
    } else {
      const index = this.selectedRoleList.findIndex((r) => r.id === role.id);
      this.selectedRoleList.splice(index, 1);
      this.selectedRoleIDList.splice(index, 1);
    }
  };

  deleteRoles = () => {
    from(this.selectedRoleList)
      .pipe(
        mergeMap((role) =>
          this.roleService.getUsersByRoleId$(role.id, info).pipe(
            tap((users) => {
              if (users.length !== 0) {
                this.usersExists.push(role);
              } else {
                this.usersDoesntExists.push(role);
              }
            })
          )
        ),
        toArray()
      )
      .subscribe(() => {
        const deleteReportRef = this.dialog.open(RoleDeleteModalComponent, {
          data: {
            usersExists: this.usersExists,
            usersDoesntExists: this.usersDoesntExists,
            multiDelete: true
          }
        });
        deleteReportRef.afterClosed().subscribe((res) => {
          if (res === 'yes') {
            from(this.usersDoesntExists)
              .pipe(
                mergeMap((role) => this.roleService.deleteRole$(role, info)),
                toArray()
              )
              .subscribe((deletedRoles) => {
                if (deletedRoles.length === this.usersDoesntExists.length) {
                  this.toast.show({
                    text: `${deletedRoles.length} Roles Deleted successfully`,
                    type: 'success'
                  });
                }
                deletedRoles.forEach((deletedRole) => {
                  this.rolesListUpdate$.next({
                    action: 'delete',
                    role: deletedRole
                  });
                });
                this.selectedRoleList = [];
                this.selectedRoleIDList = [];
                this.usersExists = [];
                this.usersDoesntExists = [];
                this.selectedRole = null;
              });
          }
        });
      });
  };

  addRole() {
    this.roleMode = 'add';
    this.copyDisabled = true;
    this.showCancelBtn = true;
    this.selectedRolePermissions$ = of([]);
    const newRole = {
      name: 'New Role',
      description: ''
    };
    this.selectedRole = newRole;
    this.roleForm.enable({ emitEvent: false });
    this.roleForm.setValue(newRole, { emitEvent: false });
    this.disableSaveButton = true;
    this.addingRole$.next(true);
  }

  createDuplicateRole = (roles, copyRole) => {
    const roleName = copyRole.name;
    const regex = generateCopyRegex(roleName);
    const roleCopyNumbers = [];
    roles.forEach((role) => {
      const matchObject = role.name.match(regex);
      if (matchObject) {
        roleCopyNumbers.push(parseInt(matchObject[1], 10));
      }
    });
    const newIndex = generateCopyNumber(roleCopyNumbers);
    const newRoleName = `${roleName} Copy(${newIndex})`;
    const newRole = { ...copyRole, name: newRoleName };
    delete newRole.id;
    return newRole;
  };

  copyRole(role) {
    this.rolesListUpdate$.next({
      action: 'copy',
      role
    });
  }

  copyRoleClickHandler() {
    this.copyRole(this.selectedRole);
  }

  update(data) {
    this.updatedPermissions = data;
    this.disableSaveButton = !this.isPermissionsChecked();
  }

  saveRole(formData, roleId) {
    const updatedPermissionIDs = [];
    const updatedPermissions = [];

    this.updatedPermissions.forEach((module) => {
      module.permissions.forEach((permission) => {
        if (permission.checked === true) {
          updatedPermissionIDs.push(permission.id);
          updatedPermissions.push(permission);
        }
      });
      module.subPermissions.forEach((subpermission) => {
        subpermission.permissions.forEach((per) => {
          if (per.checked === true) {
            updatedPermissionIDs.push(per.id);
            updatedPermissions.push(per);
          }
        });
      });
    });
    this.roleForm.controls.description.markAsPristine();
    this.roleForm.controls.name.markAsPristine();
    this.copyDisabled = false;
    const postNewRoleData = {
      name: formData.name,
      description: formData.description,
      permissionIds: updatedPermissionIDs
    };
    const updateRoleData = {
      id: roleId,
      name: formData.name,
      description: formData.description,
      permissionIds: updatedPermissionIDs
    };
    if (roleId === undefined) {
      this.roleService.createRole$(postNewRoleData).subscribe((resp) => {
        if (Object.keys(resp).length) {
          this.rolesListUpdate$.next({
            action: 'add',
            role: {
              ...resp,
              permissionIds: updatedPermissions.filter(
                (p) => p.checked === true
              )
            }
          });
          this.roleMode = 'edit';
          this.disableSaveButton = true;
          this.addingRole$.next(false);
          this.showCancelBtn = false;
          this.selectedRole = { ...resp, isNew: true };
          this.selectedRolePermissions$ = of(updatedPermissionIDs);
          this.toast.show({
            text: 'Role saved successfully',
            type: 'success'
          });
        }
      });
    } else {
      this.roleService.updateRole$(updateRoleData).subscribe((resp) => {
        if (Object.keys(resp).length) {
          this.addingRole$.next(false);
          this.rolesListUpdate$.next({
            action: 'edit',
            role: {
              ...updateRoleData,
              permissionIds: updatedPermissions.filter(
                (p) => p.checked === true
              )
            }
          });
          this.selectedRole = resp;
          this.selectedRolePermissions$ = of(resp.permissionIds);
          this.disableSaveButton = true;
          this.toast.show({
            text: 'Role Updated successfully',
            type: 'success'
          });
        }
      });
    }
  }

  cancelRole() {
    const cancelReportRef = this.dialog.open(CancelModalComponent);
    cancelReportRef.afterClosed().subscribe((res) => {
      if (res === 'yes') {
        this.addingRole$.next(false);
        this.rolesList$
          .pipe(tap((roles) => this.showSelectedRole(roles[0])))
          .subscribe();
        this.showCancelBtn = false;
        this.copyDisabled = false;
      } else {
        this.addingRole$.next(true);
      }
    });
  }

  deleteRole(role) {
    this.roleService.getUsersByRoleId$(role.id).subscribe((usersData) => {
      const deleteReportRef = this.dialog.open(RoleDeleteModalComponent, {
        data: {
          data: usersData,
          singleDelete: true
        }
      });
      deleteReportRef.afterClosed().subscribe((res) => {
        if (res === 'yes') {
          this.roleService.deleteRole$(role).subscribe((resp) => {
            if (Object.keys(resp).length) {
              this.rolesListUpdate$.next({ action: 'delete', role });
              this.selectedRole = null;
              this.toast.show({
                text: 'Role Deleted successfully',
                type: 'success'
              });
            }
          });
        }
      });
    });
  }

  roleNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const duplicate = control.value?.trim();
      if (
        this.selectedRole &&
        this.selectedRole.id &&
        this.selectedRole.name === duplicate
      )
        return null;
      const find = this.rolesList.findIndex(
        (role) => role.name.toLowerCase() === duplicate.toLowerCase()
      );
      return find === -1 ? null : { duplicateName: true };
    };
  }

  showSelectedRole(role: Role) {
    this.roleMode = 'edit';
    this.addingRole$.next(false);
    this.selectedRole = role;
    this.showCancelBtn = false;
    this.copyDisabled = false;
    this.disableSaveButton = true;
    const { name, description } = role;
    this.roleForm.setValue({ name, description }, { emitEvent: false });
    if (name === superAdminText) {
      this.roleForm.disable({ emitEvent: false });
    } else {
      this.roleForm.enable({ emitEvent: false });
    }
    this.updatedPermissions = [];

    this.selectedRolePermissions$ = this.rolesList$.pipe(
      map((roles) => {
        const permissions = roles.find((r) => r.id === role.id)?.permissionIds;
        if (permissions) return permissions.map((perm) => perm.id);
      }),
      shareReplay(1)
    );
  }
}
