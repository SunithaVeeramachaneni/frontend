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
  FormArray,
  ValidatorFn,
  ValidationErrors,
  Validators,
  AsyncValidatorFn
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import {
  mergeMap,
  tap,
  map,
  debounceTime,
  shareReplay,
  distinctUntilChanged,
  toArray,
  filter
} from 'rxjs/operators';
import {
  permissions as perms,
  routingUrls,
  superAdminText
} from 'src/app/app.constants';
import { Role, Permission, ErrorInfo } from 'src/app/interfaces';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastService } from 'src/app/shared/toast';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import Swal from 'sweetalert2';
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
  headerTitle$: Observable<string>;
  readonly routingUrls = routingUrls;
  readonly superAdminText = superAdminText;

  rolesList$: Observable<Role[]> = of([]);
  selectedRoleList = [];
  permissionsList$: Observable<any>;
  selectedRolePermissions$: Observable<any[]>;
  rolesListUpdate$: BehaviorSubject<RolesListUpdate> =
    new BehaviorSubject<RolesListUpdate>({
      action: null,
      role: {} as Role
    });

  selectedRole;
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

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private roleService: RolesPermissionsService,
    private cdrf: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() =>
        this.commonService.setHeaderTitle(routingUrls.rolesPermissions.title)
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
        tap((resp) => {
          this.disableSaveButton = false;
        })
      )
      .subscribe();
  }

  ngAfterViewChecked(): void {
    this.cdrf.detectChanges();
  }

  getRoles() {
    const initialRolesList$ = this.roleService
      .getRolesWithPermissions$()
      .pipe(shareReplay(1))
      .pipe(tap((roles) => this.showSelectedRole(roles[0])));
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
                this.showSelectedRole(newRole);
                this.toast.show({
                  text: 'Role copied successfully',
                  type: 'success'
                });
                this.selectedRole = role;
                this.selectedRolePermissions$ = of(role.permissionIds);
              }
            });

            // roles.push(role);
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
    } else {
      const index = this.selectedRoleList.findIndex((r) => r.id === role.id);
      this.selectedRoleList.splice(index, 1);
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
            this.usersDoesntExists.forEach((role) => {
              this.roleService.deleteRole$(role).subscribe(
                (resp) => {
                  if (Object.keys(resp).length && resp.id) {
                    this.rolesListUpdate$.next({ action: 'delete', role });
                    this.selectedRole = undefined;
                    this.selectedRoleList = [];
                    this.usersExists = [];
                    this.usersDoesntExists = [];
                    this.toast.show({
                      text: 'Role Deleted successfully',
                      type: 'success'
                    });
                  }
                },
                (error) => {
                  this.toast.show({
                    text: 'Unable to delete the role',
                    type: 'success'
                  });
                }
              );
            });
          } else {
            this.selectedRoleList = [];
            this.usersExists = [];
            this.usersDoesntExists = [];
          }
        });
      });
  };

  addRole() {
    this.copyDisabled = true;
    this.showCancelBtn = true;
    this.addingRole$.next(true);
    this.selectedRolePermissions$ = of([]);
    this.roleForm.controls.name.setValue('New Role');
    this.roleForm.controls.description.setValue('');
    this.disableSaveButton = true;
    this.selectedRole = [];
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
    this.disableSaveButton = false;
  }

  saveRole(formData, roleId) {
    const updatedPermissionIDs = [];
    const updatedPermissions = [];
    for (const module of this.updatedPermissions) {
      for (const permission of module.permissions) {
        if (permission.checked === true)
          updatedPermissionIDs.push(permission.id);
        updatedPermissions.push(permission);
      }
    }
    this.roleForm.controls.description.markAsPristine();
    this.roleForm.controls.name.markAsPristine();
    this.copyDisabled = false;
    // this.spinner.show();
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
          this.addingRole$.next(false);
          this.showCancelBtn = false;
          this.selectedRole = resp;
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
          this.selectedRolePermissions$ = of(resp.permissionIds);
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
          this.roleService.deleteRole$(role).subscribe(
            (resp) => {
              if (Object.keys(resp).length && resp.id) {
                this.rolesListUpdate$.next({ action: 'delete', role });
                this.selectedRole = undefined;
                this.toast.show({
                  text: 'Role Deleted successfully',
                  type: 'success'
                });
              }
            },
            (error) => {
              this.toast.show({
                text: 'Unable to delete the role',
                type: 'success'
              });
            }
          );
        }
      });
    });
  }

  roleNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const duplicate = control.value.trim();
      if (this.selectedRole && this.selectedRole.name === duplicate)
        return null;
      const find = this.rolesList.findIndex((role) => role.name === duplicate);
      return find === -1 ? null : { duplicateName: true };
    };
  }

  showSelectedRole(role: Role) {
    this.addingRole$.next(false);
    this.selectedRole = role;
    this.showCancelBtn = false;
    this.disableSaveButton = true;
    this.roleForm.controls.name.setValue(role.name);
    this.roleForm.controls.description.setValue(role.description);
    this.updatedPermissions = [];

    this.selectedRolePermissions$ = this.rolesList$.pipe(
      map((roles) => {
        const permissions = roles.find((r) => r.id === role.id)?.permissionIds;
        this.disableSaveButton = true;
        if (permissions) return permissions.map((perm) => perm.id);
      }),
      shareReplay(1)
    );
  }
}
