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
  showTextBox = false;
  roleForm: FormGroup;

  rolesList = [
    {
      role: 'Super Admin',
      countOfPermissions: 5
    },
    {
      role: 'Maintenance Manager',
      countOfPermissions: 5
    },
    {
      role: 'Warehouse Supervisor',
      countOfPermissions: 3
    }
  ];

  constructor(private commonService: CommonService, private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log(routingUrls.rolesPermissions.title);
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() =>
        this.commonService.setHeaderTitle(routingUrls.rolesPermissions.title)
      )
    );
    this.roleForm = this.fb.group({
      role: new FormControl('', [Validators.required])
    });
  }

  get f() {
    return this.roleForm.controls;
  }

  toggleTextBox() {
    this.f.role.setValue('New Role');
    this.showTextBox = true;
    this.rolesList.push({
      role: 'New Role',
      countOfPermissions: 0
    });
  }
}
