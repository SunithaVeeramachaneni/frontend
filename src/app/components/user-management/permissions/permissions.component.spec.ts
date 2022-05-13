import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { of } from 'rxjs';
import { AppMaterialModules } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { PermissionsComponent } from './permissions.component';
import { RolesPermissionsService } from '../services/roles-permissions.service';

fdescribe('PermissionsComponent', () => {
  let component: PermissionsComponent;
  let fixture: ComponentFixture<PermissionsComponent>;
  let rolesPermissionsServiceSpy: RolesPermissionsService;
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

  const permissions = [
    {
      createdAt: '2022-04-19T10:38:41.000Z',
      displayName: 'Create Report',
      id: 1,
      moduleName: 'Reports',
      name: 'CREATE_REPORT',
      updatedAt: '2022-04-19T10:38:41.000Z'
    },
    {
      createdAt: '2022-04-19T10:38:41.000Z',
      displayName: 'Edit Report',
      id: 2,
      moduleName: 'Reports',
      name: 'UPDATE_REPORT',
      updatedAt: '2022-04-19T10:38:41.000Z'
    }
  ];

  beforeEach(async () => {
    rolesPermissionsServiceSpy = jasmine.createSpyObj(
      'RolesPermissionsService',
      ['getPermissions$']
    );

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
      providers: [
        {
          provide: RolesPermissionsService,
          useValue: rolesPermissionsServiceSpy
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsComponent);
    component = fixture.componentInstance;
    (rolesPermissionsServiceSpy.getPermissions$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of([]));
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

  it('should get method updateAllChecked', () => {
    component.updateAllChecked(permissionList, permissionList.permissions);
  });

  it('should get method setAllChecked', () => {
    const checked = false;
    const noPermissions = {
      name: 'Reports',
      checked: true,
      countOfChecked: 2,
      permissions: null
    };

    spyOn(component.permissionsChange, 'emit');

    component.setAllChecked(checked, noPermissions);

    expect(component.rolesBasedPermissions.length).toBe(0);

    // expect(component.permissionsChange.emit).toHaveBeenCalledWith(
    //   component.rolesBasedPermissions
    // );
  });
});
