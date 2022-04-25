import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { mergeMap, tap, map } from 'rxjs/operators';
import { routingUrls } from 'src/app/app.constants';
import { Role, Permission } from 'src/app/interfaces';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastService } from 'src/app/shared/toast';
import Swal from 'sweetalert2';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { RolesPermissionsService } from '../services/roles-permissions.service';

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesPermissionsComponent implements OnInit, AfterViewChecked {
  currentRouteUrl$: Observable<string>;
  headerTitle$: Observable<string>;
  readonly routingUrls = routingUrls;

  rolesList$: Observable<Role[]>;

  permissionsList$: Observable<any>;
  selectedRolePermissions$: Observable<Permission[]>;

  selectedRole;
  roleForm: FormGroup;

  copyDisabled = true;
  showCancelBtn = false;
  enableSaveButon: boolean;
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
    this.rolesList$ = this.roleService.getRoles$().pipe(
      mergeMap((roles: Role[]) => {
        const newArray = [];
        return from(roles).pipe(
          mergeMap((role) =>
            this.roleService.getRolePermissionsById$(role.id).pipe(
              map((permissions) => {
                const newRoleArray = {
                  id: role.id,
                  name: role.name,
                  description: role.description,
                  permissionIds: permissions.length
                };
                newArray.push(newRoleArray);
                return newArray;
              })
            )
          )
        );
      })
    );
  }

  getAllPermissions() {
    this.permissionsList$ = this.roleService.getPermissions$();
  }

  get f() {
    return this.roleForm.controls;
  }

  addRole() {
    this.copyDisabled = true;
    this.showCancelBtn = true;
    this.addingRole$.next(true);
    this.selectedRolePermissions$ = of([]);
    this.f.name.setValue('New Role');
    this.f.description.setValue('');
    this.enableSaveButon = true;
    this.selectedRole = [];
  }

  update(data) {
    this.selectedRolePermissions$ = of(data);
    this.enableSaveButon = data.length !== 0 ? false : true;
  }

  saveRole(formData, roleId) {
    this.spinner.show();
    const permissionId = [];
    this.selectedRolePermissions$.subscribe((resp) => {
      resp.forEach((e) => permissionId.push(e.id));
    });
    const postNewRoleData = {
      name: formData.name,
      description: formData.description,
      permissionIds: permissionId
    };
    const updateRoleData = {
      id: roleId,
      name: formData.name,
      description: formData.description,
      permissionIds: permissionId
    };
    if (roleId === undefined) {
      this.roleService.createRole$(postNewRoleData).subscribe((resp) => {
        this.getRoles();
        this.addingRole$.next(false);
        this.showCancelBtn = false;
        this.copyDisabled = true;
        this.selectedRole = resp;
        this.spinner.hide();

        this.toast.show({
          text: 'Role saved successfully',
          type: 'success'
        });
      });
    } else {
      this.roleService.updateRole$(updateRoleData).subscribe((resp) => {
        this.addingRole$.next(false);
        this.getRoles();
        this.spinner.hide();
        this.toast.show({
          text: 'Role Updated successfully',
          type: 'success'
        });
      });
    }
  }

  cancelRole() {
    const deleteReportRef = this.dialog.open(AlertModalComponent);
    deleteReportRef.afterClosed().subscribe((res) => {
      if (res === 'yes') {
        this.getRoles();
        this.selectedRole = undefined;
        this.addingRole$.next(false);
      } else {
        this.addingRole$.next(true);
      }
    });
  }

  deleteRole(role) {
    this.roleService.deleteRole$(role).subscribe((resp) => {
      this.getRoles();
    });
  }

  showSelectedRole(role) {
    this.selectedRole = role;
    this.f.name.setValue(role.name);
    this.f.description.setValue(role.description);

    this.selectedRolePermissions$ = this.roleService
      .getRolePermissionsById$(role.id)
      .pipe(
        map((resp) => {
          const selectedPermission = resp;
          this.enableSaveButon = false;
          return selectedPermission;
        })
      );
  }
}
