import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { userRolePermissions } from 'src/app/app.constants';

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
  @Input() selectedRole: any;
  @Input() set roleFormChanged(roleFormChanged: { isChanged: boolean }) {
    if (roleFormChanged && roleFormChanged.isChanged) {
      if (this.permissions$?.value) {
        this.rolePermissions.emit(this.permissions$.value);
      }
    }
  }

  @Output() permissionsChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() rolePermissions: EventEmitter<any> = new EventEmitter<any>();

  rolesBasedPermissions = [];
  permissions$: BehaviorSubject<any>;
  panelOpenState: boolean[] = [];
  userRolePermissions = userRolePermissions;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.selectedRole &&
      changes.selectedRole.previousValue &&
      !changes.selectedRole.currentValue.isNew
    ) {
      if (
        changes.selectedRole.previousValue.id !==
        changes.selectedRole.currentValue.id
      ) {
        this.panelOpenState = [];
      }
    }

    if (changes.selectedRolePermissions$) {
      if (changes.selectedRolePermissions$.firstChange) {
        this.permissions$ = new BehaviorSubject([]);
      }
      this.selectedRolePermissions$ =
        changes.selectedRolePermissions$.currentValue;
    }

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

        const isMainModule = module.permissions.find(
          (per) => per.moduleName === permission.subModuleName
        );

        if (
          !checked &&
          permission.displayName.toLowerCase().indexOf('display') !== -1
        ) {
          module.permissions = module.permissions.map((per) => {
            if (isMainModule) {
              per.checked = false;
            } else if (per.subModuleName === permission.subModuleName) {
              per.checked = false;
            }
            return per;
          });
        } else if (checked) {
          if (permission.displayName.toLowerCase().indexOf('display') === -1) {
            module.permissions = module.permissions.map((per) => {
              if (isMainModule) {
                if (
                  per.subModuleName === permission.subModuleName &&
                  per.displayName.toLowerCase().indexOf('display') !== -1
                ) {
                  per.checked = true;
                }
              } else {
                if (
                  (per.moduleName === per.subModuleName ||
                    per.subModuleName === permission.subModuleName) &&
                  per.displayName.toLowerCase().indexOf('display') !== -1
                ) {
                  per.checked = true;
                }
              }
              return per;
            });
          } else {
            module.permissions = module.permissions.map((per) => {
              if (
                per.moduleName === per.subModuleName &&
                per.displayName.toLowerCase().indexOf('display') !== -1
              ) {
                per.checked = true;
              }
              return per;
            });
          }
        }

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
