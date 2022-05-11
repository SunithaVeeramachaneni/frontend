import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { combineLatest, Observable, of } from 'rxjs';
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
export class PermissionsComponent implements OnChanges {
  @Input() selectedRolePermissions$: Observable<any[]>;
  @Input() allPermissions$: Observable<any[]>;

  @Output() permissionsChange: EventEmitter<any> = new EventEmitter<any>();

  rolesBasedPermissions = [];
  permissions$: Observable<any>;
  panelOpenState = true;
  isEditable = false;

  constructor(private roleService: RolesPermissionsService) {}

  ngOnChanges(changes: SimpleChanges) {
    let selectedRolePermissions$: Observable<any>;
    let allPermissions$: Observable<any[]>;
    if (changes.selectedRolePermissions$) {
      this.selectedRolePermissions$ =
        changes.selectedRolePermissions$.currentValue;
    }
    if (changes.allPermissions$) {
      this.allPermissions$ = changes.allPermissions$.currentValue;
    }

    this.permissions$ = combineLatest([
      this.selectedRolePermissions$,
      this.allPermissions$
    ]).pipe(
      map(([permissionIDs, allPermissions]) =>
        allPermissions.map((modulePermissions) => {
          let activePermissionCount = 0;
          const newPermissions = modulePermissions.permissions.map(
            (permission) => {
              permission.checked = false;
              if (permissionIDs.includes(permission.id)) {
                permission.checked = true;
                activePermissionCount += 1;
              }
              return permission;
            }
          );
          return {
            ...modulePermissions,
            permissions: newPermissions,
            countOfChecked: activePermissionCount
          };
        })
      )
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
    this.permissionsChange.emit(this.rolesBasedPermissions);
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
    this.permissionsChange.emit(this.rolesBasedPermissions);
  }
}
