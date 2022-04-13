import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { routingUrls } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss']
})
export class RolesPermissionsComponent implements OnInit {
  currentRouteUrl$: Observable<string>;
  headerTitle$: Observable<string>;
  readonly routingUrls = routingUrls;
  roleForm: FormGroup;

  rolesList = [
    {
      id: 1,
      role: 'Super Admin',
      countOfPermissions: 5
    },
    {
      id: 2,
      role: 'Maintenance Manager',
      countOfPermissions: 5
    },
    {
      id: 3,
      role: 'Warehouse Supervisor',
      countOfPermissions: 3
    }
  ];

  selectedRole;

  constructor(private commonService: CommonService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() =>
        this.commonService.setHeaderTitle(routingUrls.rolesPermissions.title)
      )
    );
    this.roleForm = this.fb.group({
      role: new FormControl('', [Validators.required])
    });
    this.f.role.setValue(this.rolesList[0].role);
    this.selectedRole = this.rolesList[0];
  }

  get f() {
    return this.roleForm.controls;
  }

  addRole() {
    this.f.role.setValue('New Role');
    this.rolesList.push({
      id: this.rolesList.length + 1,
      role: this.f.role.value,
      countOfPermissions: 0
    });
    this.selectedRole = this.rolesList[this.rolesList.length - 1];
  }

  showSelectedRole(role) {
    this.selectedRole = role;
    this.f.role.setValue(role.role);
  }
}
