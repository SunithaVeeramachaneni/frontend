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
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { mergeMap, tap, map } from 'rxjs/operators';
import { routingUrls } from 'src/app/app.constants';
import { Role, Permission } from 'src/app/interfaces';
import { CommonService } from 'src/app/shared/services/common.service';
import Swal from 'sweetalert2';
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
  selectedRole;

  roleForm: FormGroup;

  copyDisabled = false;
  showCancelBtn = false;
  addingRole$ = new BehaviorSubject<boolean>(false);

  rolePermissions = [];

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private roleService: RolesPermissionsService,
    private cdrf: ChangeDetectorRef,
    private spinner: NgxSpinnerService
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
  }

  ngAfterViewChecked(): void {
    this.cdrf.detectChanges();
  }

  getRoles() {
    this.rolesList$ = this.roleService.getRoles$();
  }

  get f() {
    return this.roleForm.controls;
  }

  addRole() {
    this.copyDisabled = true;
    this.showCancelBtn = true;
    this.addingRole$.next(true);
    this.rolePermissions = [];
    this.f.name.setValue('New Role');
    this.f.description.setValue('');
    this.selectedRole = {
      name: '',
      description: ''
    };
  }

  update(data) {
    this.rolePermissions = data;
  }

  saveRole(formData, roleId) {
    this.spinner.show();
    const permissionId = [];
    this.rolePermissions.forEach((e) => permissionId.push(e.id));

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
        this.copyDisabled = false;
        this.selectedRole = resp;
        this.spinner.hide();
      });
    } else {
      this.roleService.updateRole$(updateRoleData).subscribe((resp) => {
        console.log(resp);
        this.addingRole$.next(false);
        this.getRoles();
        this.spinner.hide();
      });
    }
  }

  cancelRole() {
    this.getRoles();
    this.selectedRole = undefined;
    this.addingRole$.next(false);
  }

  deleteRole(role) {
    this.roleService.deleteRole$(role).subscribe((resp) => {
      console.log(resp);
      this.getRoles();
    });
  }

  showSelectedRole(role) {
    this.selectedRole = role;
    this.f.name.setValue(role.name);
    this.f.description.setValue(role.description);

    this.roleService.getRolePermissionsById$(role.id).subscribe((resp) => {
      if (resp && resp.length !== 0) {
        resp.forEach((e) => {
          this.rolePermissions = resp;
        });
      }
    });
  }
}
