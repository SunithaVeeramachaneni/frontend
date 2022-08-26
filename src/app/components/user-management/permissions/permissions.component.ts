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
  userRolePermissions = userRolePermissions;
  opened: any[] = [];
  newPermissionsArray;

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
        this.opened = [];
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
    }

    const permissionObservable = combineLatest([
      this.selectedRolePermissions$,
      this.allPermissions$
    ]).pipe(
      map(([permissionIDs, allPermissions]) =>
        allPermissions.map((modulePermissions) => {
          const filteredPermissions = [];
          const subModules = [];

          modulePermissions.permissions.filter((e) => {
            if (e.moduleName === e.subModuleName) {
              filteredPermissions.push(e);
            }
            if (e.moduleName !== e.subModuleName) {
              subModules.push(e);
            }
          });

          this.newPermissionsArray = {
            name: modulePermissions.name,
            checked: false,
            countOfChecked: modulePermissions.countOfChecked,
            permissions: filteredPermissions,
            subPermissions: this.groupedArray(this.groupPermissions(subModules))
          };

          let activePermissionCount = 0;
          let activeSubPermissionCount = 0;

          const newPermissions = this.newPermissionsArray.permissions.map(
            (permission) => {
              permission.checked = false;
              if (permissionIDs && permissionIDs.includes(permission.id)) {
                permission.checked = true;
                activePermissionCount += 1;
              }
              this.newPermissionsArray.subPermissions.forEach(
                (subpermission) => {
                  subpermission.permissions.forEach((sub) => {
                    sub.checked = false;
                    if (permissionIDs && permissionIDs.includes(sub.id)) {
                      sub.checked = true;
                      activeSubPermissionCount += 1;
                    }
                  });
                  subpermission.countOfSubChecked = activeSubPermissionCount;
                  activeSubPermissionCount = 0;
                }
              );
              return permission;
            }
          );
          if (
            activePermissionCount ===
            this.newPermissionsArray.permissions.length
          ) {
            this.newPermissionsArray.checked = true;
          }

          this.newPermissionsArray.subPermissions.forEach((subpermission) => {
            if (
              subpermission.countOfSubChecked ===
              subpermission.permissions.length
            ) {
              subpermission.checked = true;
            }
          });

          return {
            ...this.newPermissionsArray,
            permissions: newPermissions,
            countOfChecked: activePermissionCount
          };
        })
      )
    );

    permissionObservable.subscribe((permissions) => {
      permissions.forEach((permission) => {
        const sub = [];
        permission.subPermissions.forEach(() => {
          sub.push(false);
        });
        this.opened.push({
          main: false,
          sub
        });
      });
      this.permissions$.next(permissions);
    });
  }

  groupPermissions = (ungroupedPermissions) =>
    ungroupedPermissions.reduce((acc, cur) => {
      if (!acc[cur.subModuleName]) {
        acc[cur.subModuleName] = [];
      }
      acc[cur.subModuleName].push(cur);
      return acc;
    }, {});

  groupedArray(grouped) {
    const permissionsArray = [];
    Object.keys(grouped).forEach((module) => {
      permissionsArray.push({
        name: module,
        checked: false,
        countOfSubChecked: 0,
        permissions: grouped[module]
      });
    });
    return permissionsArray;
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

        if (
          !checked &&
          permission.displayName.toLowerCase().indexOf('display') !== -1
        ) {
          module.permissions = module.permissions.map((per) => {
            if (per.subModuleName === permission.subModuleName) {
              per.checked = false;
              module.subPermissions.forEach((subper) => {
                subper.permissions.forEach((subpermission) => {
                  subpermission.checked = false;
                });
                subper.checked = false;
                subper.countOfSubChecked = 0;
              });
            }
            return per;
          });
        } else if (
          checked &&
          permission.displayName.toLowerCase().indexOf('display') === -1
        ) {
          module.permissions = module.permissions.map((per) => {
            if (
              per.subModuleName === permission.subModuleName &&
              per.displayName.toLowerCase().indexOf('display') !== -1
            ) {
              per.checked = true;
            }
            return per;
          });
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

  updateAllSubChecked(checked, permission) {
    const newPermissions = this.permissions$.value.map((module) => {
      module.subPermissions.forEach((submodule) => {
        if (submodule.name === permission.subModuleName) {
          submodule.permissions = submodule.permissions.map((per) => {
            if (per.id === permission.id) {
              per.checked = checked;
              module.permissions.forEach((mainPermission) => {
                if (
                  mainPermission.displayName
                    .toLowerCase()
                    .indexOf('display') !== -1
                ) {
                  mainPermission.checked = true;
                }
              });
            }
            return per;
          });
          if (
            !checked &&
            permission.displayName.toLowerCase().indexOf('display') !== -1
          ) {
            submodule.permissions = submodule.permissions.map((per) => {
              if (per.subModuleName === permission.subModuleName) {
                per.checked = false;
              }
              return per;
            });
          } else if (checked) {
            if (
              permission.displayName.toLowerCase().indexOf('display') === -1
            ) {
              submodule.permissions = submodule.permissions.map((per) => {
                if (
                  per.subModuleName === permission.subModuleName &&
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

          submodule.countOfSubChecked = submodule.permissions.filter(
            (per) => per.checked
          ).length;

          if (submodule.countOfSubChecked === 0) submodule.checked = false;
          if (submodule.countOfSubChecked === submodule.permissions.length)
            submodule.checked = true;
        }
      });
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
          module.subPermissions.forEach((subper) => {
            subper.checked = checked;
            subper.countOfSubChecked = checked ? subper.permissions.length : 0;
            subper.permissions.forEach((subpermission) => {
              subpermission.checked = checked;
            });
          });
          return per;
        });

        module.countOfChecked = checked ? module.permissions.length : 0;
      }
      return module;
    });
    this.permissions$.next(newPermissions);
    this.permissionsChange.emit(newPermissions);
  }

  setAllSubChecked(checked: boolean, module) {
    const moduleName = module.name;
    const newPermissions = this.permissions$.value.map((totalPermissions) => {
      totalPermissions.subPermissions.forEach((totalSubPermissions) => {
        if (totalSubPermissions.name === moduleName) {
          totalSubPermissions.checked = checked;
          totalSubPermissions.permissions = totalSubPermissions.permissions.map(
            (per) => {
              per.checked = checked;
              return per;
            }
          );
          totalSubPermissions.countOfSubChecked = checked
            ? totalSubPermissions.permissions.length
            : 0;
        }
      });
      return totalPermissions;
    });
    this.permissions$.next(newPermissions);
    this.permissionsChange.emit(newPermissions);
  }
}
