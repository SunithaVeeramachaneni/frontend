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
  ValidationErrors,
  Validators
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
import { routingUrls } from 'src/app/app.constants';
import { Role, Permission } from 'src/app/interfaces';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastService } from 'src/app/shared/toast';
import Swal from 'sweetalert2';
import { CancelModalComponent } from '../cancel-modal/cancel-modal.component';
import { RoleDeleteModalComponent } from '../role-delete-modal/role-delete-modal.component';
import { RolesPermissionsService } from '../services/roles-permissions.service';

interface RolesListUpdate {
  action: 'add' | 'edit' | 'delete' | null;
  role: Role;
}

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

  rolesList$: Observable<Role[]>;
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
  copyDisabled = true;
  showCancelBtn = false;
  disableSaveButton: boolean;
  addingRole$ = new BehaviorSubject<boolean>(false);

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
        Validators.maxLength(20)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ])
    });

    this.getRoles();
    this.getAllPermissions();
  }

  ngAfterViewChecked(): void {
    this.cdrf.detectChanges();
  }

  getRoles() {
    const initialRolesList$ = this.roleService
      .getRolesWithPermissions$()
      .pipe(shareReplay(1));
    initialRolesList$.subscribe((roles) => {});
    const updatedRoles$ = combineLatest([
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
        }
        return roles;
      })
    );

    this.rolesList$ = updatedRoles$;
  }

  getAllPermissions() {
    this.permissionsList$ = this.roleService.getPermissions$();
  }

  get f() {
    return this.roleForm.controls;
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
    this.selectedRoleList.forEach((role) => {
      this.deleteRole(role);
    });
    this.selectedRoleList = [];
  };

  addRole() {
    this.copyDisabled = true;
    this.showCancelBtn = true;
    this.addingRole$.next(true);
    this.selectedRolePermissions$ = of([]);
    this.f.name.setValue('New Role');
    this.f.description.setValue('');
    this.disableSaveButton = true;
    this.selectedRole = [];
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
            role: resp
          });
          this.addingRole$.next(false);
          this.showCancelBtn = false;
          this.copyDisabled = true;
          this.selectedRole = resp;
          this.selectedRolePermissions$ = of(resp.permissionIds);
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
            role: resp
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
    const deleteReportRef = this.dialog.open(CancelModalComponent);
    deleteReportRef.afterClosed().subscribe((res) => {
      if (res === 'yes') {
        this.addingRole$.next(false);
        this.selectedRole = undefined;
      } else {
        this.addingRole$.next(true);
      }
    });
  }

  deleteRole(role) {
    this.roleService.getUsersByRoleId$(role.id).subscribe((usersData) => {
      const deleteReportRef = this.dialog.open(RoleDeleteModalComponent, {
        data: {
          data: usersData
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

  showSelectedRole(role: Role) {
    this.selectedRole = role;
    this.showCancelBtn = false;
    this.disableSaveButton = true;
    this.f.name.setValue(role.name);
    this.f.description.setValue(role.description);
    this.updatedPermissions = [];

    this.selectedRolePermissions$ = this.rolesList$.pipe(
      map((roles) => {
        const permissions = roles.find((r) => r.id === role.id).permissionIds;
        this.disableSaveButton = true;
        return permissions.map((perm) => perm.id);
      })
    );
  }
}
