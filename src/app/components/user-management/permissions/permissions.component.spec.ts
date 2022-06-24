import { Component, DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { of } from 'rxjs';
import { AppMaterialModules } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  allPermissions,
  allPermissions$,
  selectedRolePermissions$
} from '../roles/roles-permissions.mock';
import { allRolesMock } from '../services/roles-permissions.mock';

import { PermissionsComponent } from './permissions.component';

describe('PermissionsComponent', () => {
  let component: PermissionsComponent;
  let fixture: ComponentFixture<PermissionsComponent>;
  let permissionsDe: DebugElement;
  let permissionsEl: HTMLElement;

  const permissionList = {
    name: 'Reports',
    checked: true,
    countOfChecked: 2,
    permissions: [
      {
        createdAt: '2022-04-19T10:38:41.000Z',
        displayName: 'Create Report',
        id: '1',
        moduleName: 'Reports',
        name: 'CREATE_REPORT',
        updatedAt: '2022-04-19T10:38:41.000Z',
        checked: true
      },
      {
        createdAt: '2022-04-19T10:38:41.000Z',
        displayName: 'Edit Report',
        id: '2',
        moduleName: 'Reports',
        name: 'UPDATE_REPORT',
        updatedAt: '2022-04-19T10:38:41.000Z',
        checked: true
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PermissionsComponent],
      imports: [
        AppMaterialModules,
        SharedModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        FormsModule,
        NgxShimmerLoadingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsComponent);
    component = fixture.componentInstance;
    permissionsDe = fixture.debugElement;
    permissionsEl = permissionsDe.nativeElement;
    component.allPermissions$ = allPermissions$;
    component.selectedRolePermissions$ = selectedRolePermissions$;
    component.selectedRole = allRolesMock[1];
    component.roleFormChanged = { isChanged: true };
    component.ngOnChanges({
      allPermissions$: new SimpleChange(null, allPermissions$, true),
      selectedRolePermissions$: new SimpleChange(
        null,
        selectedRolePermissions$,
        true
      ),
      selectedRole: new SimpleChange(null, allRolesMock[1], true),
      roleFormChanged: new SimpleChange(null, { isChanged: true }, true)
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('get ngonchanges method', () => {
    spyOn(component, 'ngOnChanges').and.callThrough();
  });

  it('should get method fewComplete', () => {
    const noPermissions = {
      name: 'Reports',
      checked: true,
      countOfChecked: 2,
      permissions: null
    };
    expect(component.fewComplete(noPermissions)).toBe(false);
    expect(component.fewComplete(permissionList)).toBe(false);
  });

  describe('updateAllChecked', () => {
    beforeEach(() => {
      spyOn(component.permissionsChange, 'emit');
    });

    it('should define fuction', () => {
      expect(component.updateAllChecked).toBeDefined();
    });

    it('should select `Display Users` when user select `Create User` permission (module and sub module names are same)', () => {
      const permissions: any = cloneDeep(allPermissions);
      permissions[0].countOfChecked = 11;
      permissions[1].countOfChecked = 2;
      permissions[1].permissions[0].checked = true;
      permissions[1].permissions[1].checked = true;

      (
        permissionsEl.querySelectorAll(
          'mat-expansion-panel .mat-checkbox-input'
        )[12] as HTMLElement
      ).click();
      fixture.detectChanges();

      component.permissions$.subscribe((resp) =>
        expect(resp).toEqual(permissions)
      );
      expect(component.permissionsChange.emit).toHaveBeenCalledWith(
        permissions
      );
    });

    it('should select `Display Users & Display Roles` when user select `Create Role` permission (module and sub module names are not same)', () => {
      const permissions: any = cloneDeep(allPermissions);
      permissions[0].countOfChecked = 11;
      permissions[1].countOfChecked = 3;
      permissions[1].permissions[0].checked = true;
      permissions[1].permissions[4].checked = true;
      permissions[1].permissions[5].checked = true;

      (
        permissionsEl.querySelectorAll(
          'mat-expansion-panel .mat-checkbox-input'
        )[16] as HTMLElement
      ).click();
      fixture.detectChanges();

      component.permissions$.subscribe((resp) =>
        expect(resp).toEqual(permissions)
      );
      expect(component.permissionsChange.emit).toHaveBeenCalledWith(
        permissions
      );
    });

    it('should select `Display Users` when user select `Display Roles` permission (module and sub module names are not same)', () => {
      const permissions: any = cloneDeep(allPermissions);
      permissions[0].countOfChecked = 11;
      permissions[1].countOfChecked = 2;
      permissions[1].permissions[0].checked = true;
      permissions[1].permissions[4].checked = true;

      (
        permissionsEl.querySelectorAll(
          'mat-expansion-panel .mat-checkbox-input'
        )[15] as HTMLElement
      ).click();
      fixture.detectChanges();

      component.permissions$.subscribe((resp) =>
        expect(resp).toEqual(permissions)
      );
      expect(component.permissionsChange.emit).toHaveBeenCalledWith(
        permissions
      );
    });

    it('should unselect all selected permissions from module when user unselect `Display Dashboard` permission (module and sub module names are same)', () => {
      const permissions: any = cloneDeep(allPermissions);
      permissions[0].countOfChecked = 0;
      permissions[1].countOfChecked = 0;
      permissions[0].checked = false;
      permissions[0].permissions.forEach((permission) => {
        permission.checked = false;
      });

      (
        permissionsEl.querySelectorAll(
          'mat-expansion-panel .mat-checkbox-input'
        )[0] as HTMLElement
      ).click();
      fixture.detectChanges();

      component.permissions$.subscribe((resp) =>
        expect(resp).toEqual(permissions)
      );
      expect(component.permissionsChange.emit).toHaveBeenCalledWith(
        permissions
      );
    });

    it('should unselect all selected permissions from sub module when user unselect `Display Reports` permission (module and sub module names are not same)', () => {
      const permissions: any = cloneDeep(allPermissions);
      permissions[0].countOfChecked = 5;
      permissions[1].countOfChecked = 0;
      permissions[0].permissions.forEach((permission, index) => {
        if (index >= 5) {
          permission.checked = false;
        }
      });

      (
        permissionsEl.querySelectorAll(
          'mat-expansion-panel .mat-checkbox-input'
        )[5] as HTMLElement
      ).click();
      fixture.detectChanges();

      component.permissions$.subscribe((resp) =>
        expect(resp).toEqual(permissions)
      );
      expect(component.permissionsChange.emit).toHaveBeenCalledWith(
        permissions
      );
    });
  });
});

@Component({
  template: `<app-permissions
    [allPermissions$]="allPermissions$"
    [selectedRolePermissions$]="selectedRolePermissions$"
    [selectedRole]="selectedRole"
    [roleFormChanged]="roleFormChanged"
    [isEditable]="isEditable"
    (permissionsChange)="permissionsChangeHandler($event)"
    (rolePermissions)="rolePermissionsHandler($event)"
  ></app-permissions>`
})
class TestPermissionsHostComponent {
  allPermissions$ = allPermissions$;
  selectedRolePermissions$ = selectedRolePermissions$;
  selectedRole = allRolesMock[1];
  roleFormChanged = { isChanged: true };
  rolesWithPermissionsInUsers = '';
  isEditable = true;
  permissionsChangeHandler = () => ({});
  rolePermissionsHandler = () => ({});
}

describe('TestPermissionsHostComponent', () => {
  let component: TestPermissionsHostComponent;
  let fixture: ComponentFixture<TestPermissionsHostComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [PermissionsComponent, TestPermissionsHostComponent],
      imports: [
        AppMaterialModules,
        SharedModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        FormsModule,
        NgxShimmerLoadingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPermissionsHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
