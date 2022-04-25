import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { mergeMap, tap, map } from 'rxjs/operators';
import { routingUrls } from 'src/app/app.constants';
import { Role, Permission } from 'src/app/interfaces';
import { CommonService } from 'src/app/shared/services/common.service';
import Swal from 'sweetalert2';
import { RolesPermissionsService } from '../services/roles-permissions.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionsComponent implements OnInit {
  @Input() set selectedRolePermissions(selectedRolePermissions) {
    this.rolesBasedPermissions = selectedRolePermissions;
    this.getAllPermissions(selectedRolePermissions);
  }

  @Output() customerChange: EventEmitter<any> = new EventEmitter<any>();

  rolesBasedPermissions = [];
  permissions$: Observable<any>;
  panelOpenState = false;
  isEditable = false;
  allPermissions;

  constructor(private roleService: RolesPermissionsService) {}

  ngOnInit(): void {}

  getAllPermissions(selctedRoleBasedPermissionsList) {
    this.permissions$ = this.roleService.getPermissions$().pipe(
      map((resp) => {
        const reports = [];
        let reportChecked = true;
        let countOfReportsChecked = 0;
        if (resp) {
          resp.forEach((allpermission) => {
            if (allpermission.moduleName === 'Reports') {
              if (selctedRoleBasedPermissionsList) {
                let successObject = false;
                selctedRoleBasedPermissionsList.forEach(
                  (selectedPermission) => {
                    if (selectedPermission.id === allpermission.id) {
                      successObject = true;
                      countOfReportsChecked = countOfReportsChecked + 1;
                      reports.push({ ...allpermission, checked: true });
                    }
                  }
                );
                if (successObject === false) {
                  reportChecked = false;
                  reports.push({ ...allpermission, checked: false });
                }
              } else {
                reportChecked = false;
                reports.push({ ...allpermission, checked: false });
              }
            }
          });
          const newPermissionsArray = [
            {
              name: 'Reports',
              checked: reportChecked,
              countOfChecked: countOfReportsChecked,
              permissions: reports
            }
          ];
          return newPermissionsArray;
        }
      })
    );
  }

  updateAllChecked(per, subper) {
    per.checked =
      per.permissions != null && per.permissions.every((t) => t.checked);

    if (subper.checked === true) {
      this.rolesBasedPermissions.push(subper);
    } else {
      const result = this.rolesBasedPermissions.filter(
        (item) => item.id !== subper.id
      );
      this.rolesBasedPermissions = result;
    }
    this.customerChange.emit(this.rolesBasedPermissions);
  }

  fewComplete(per): boolean {
    if (per.permissions == null) {
      return false;
    }
    return per.permissions.filter((t) => t.checked).length > 0 && !per.checked;
  }

  setAllChecked(checked: boolean, per) {
    per.checked = checked;
    if (per.permissions == null) {
      return;
    }
    per.permissions.forEach((t) => (t.checked = checked));

    if (per.checked === true) {
      per.permissions.forEach((e) => this.rolesBasedPermissions.push(e));
    } else {
      this.rolesBasedPermissions = this.rolesBasedPermissions.filter(
        (o1) => !per.permissions.some((o2) => o1.id === o2.id)
      );
    }
    this.customerChange.emit(this.rolesBasedPermissions);
  }
}
