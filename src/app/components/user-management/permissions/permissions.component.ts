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
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { userRolePermissions, superAdminText } from 'src/app/app.constants';
import { RolesPermissionsService } from '../services/roles-permissions.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnChanges {
  @Input() selectedRolePermissions$: Observable<any[]>;
  @Input() allPermissions$: Observable<any[]>;
  @Input() rolesWithPermissionsInUsers: string;
  @Input() isEditable = true;

  @Output() permissionsChange: EventEmitter<any> = new EventEmitter<any>();

  rolesBasedPermissions = [];
  permissions$: BehaviorSubject<any>;
  panelOpenState: boolean[] = [];
  userRolePermissions = userRolePermissions;

  constructor(private roleService: RolesPermissionsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedRolePermissions$) {
      if (changes.selectedRolePermissions$.firstChange) {
        this.permissions$ = new BehaviorSubject([]);
      }
    }
    this.selectedRolePermissions$ =
      changes.selectedRolePermissions$.currentValue;

    if (changes.allPermissions$) {
      this.allPermissions$ = changes.allPermissions$.currentValue;
      if (changes.allPermissions$.firstChange) {
        this.allPermissions$.pipe(
          tap((allPermissions) => {
            this.panelOpenState = Array(allPermissions.length).fill(true);
          })
        );
      }
    }

    const permissionObservable = combineLatest([
      this.selectedRolePermissions$,
      this.allPermissions$
    ]).pipe(
      map(([permissionIDs, allPermissions]) =>
        allPermissions.map((modulePermissions) => {
          modulePermissions.checked = false;
          let activePermissionCount = 0;
          const newPermissions = modulePermissions.permissions.map(
            (permission) => {
              permission.checked = false;
              if (permissionIDs && permissionIDs.includes(permission.id)) {
                permission.checked = true;
                activePermissionCount += 1;
              }
              return permission;
            }
          );
          if (activePermissionCount === newPermissions.length)
            modulePermissions.checked = true;
          return {
            ...modulePermissions,
            permissions: newPermissions,
            countOfChecked: activePermissionCount
          };
        })
      )
    );
    permissionObservable.subscribe((permissions) => {
      this.permissions$.next(permissions);
    });
  }

  updateAllChecked(checked, permission) {
    const newPermissions = this.permissions$.value.map((module) => {
      if (module.name === permission.moduleName) {
        module.permissions = module.permissions.map((per) => {
          if (per.id === permission.id) {
            per.checked = checked;
          }
          return per;
        });

        module.countOfChecked = module.permissions.filter(
          (per) => per.checked
        ).length;
        if (module.countOfChecked === 0) module.checked = false;
        if (module.countOfChecked === module.permissions.length)
          module.checked = true;
      }
      return module;
    });
    this.permissions$.next(newPermissions);
    this.permissionsChange.emit(newPermissions);
  }

  fewComplete(per): boolean {
    if (per.permissions == null) {
      return false;
    }
    const permissionCheckedCount = per.permissions.filter(
      (p) => p.checked
    ).length;
    return (
      permissionCheckedCount > 0 &&
      permissionCheckedCount !== per.permissions.length
    );
  }

  setAllChecked(checked: boolean, modulename) {
    const moduleName = modulename.name;
    const newPermissions = this.permissions$.value.map((module) => {
      if (module.name === moduleName) {
        module.checked = checked;
        module.permissions = module.permissions.map((per) => {
          per.checked = checked;
          return per;
        });

        module.countOfChecked = checked ? module.permissions.length : 0;
      }
      return module;
    });
    this.permissions$.next(newPermissions);
    this.permissionsChange.emit(newPermissions);
  }
}
