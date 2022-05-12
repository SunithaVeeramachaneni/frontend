import { TitleCasePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { AppMaterialModules } from 'src/app/material.module';
import { ToastService } from 'src/app/shared/toast';
import { BreadcrumbService } from 'xng-breadcrumb';
import { TenantService } from '../services/tenant.service';

import { TenantComponent } from './tenant.component';

describe('TenantComponent', () => {
  let component: TenantComponent;
  let fixture: ComponentFixture<TenantComponent>;
  let breadcrumbServiceSpy: BreadcrumbService;
  let tenantServiceSpy: TenantService;
  let toastServiceSpy: ToastService;

  beforeEach(async () => {
    breadcrumbServiceSpy = jasmine.createSpyObj('BreadcrumbService', ['set']);
    tenantServiceSpy = jasmine.createSpyObj('TenantService', [
      'createTenant$',
      'updateTenant$',
      'getTenantsCount$'
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      declarations: [TenantComponent, MockComponent(NgxSpinnerComponent)],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        AppMaterialModules,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        TitleCasePipe,
        {
          provide: BreadcrumbService,
          useValue: breadcrumbServiceSpy
        },
        {
          provide: TenantService,
          useValue: tenantServiceSpy
        },
        {
          provide: ToastService,
          useValue: toastServiceSpy
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should define function', () => {
      expect(component.ngAfterViewInit).toBeDefined();
    });
  });

  describe('buildErps', () => {
    it('should define function', () => {
      expect(component.buildErps).toBeDefined();
    });
  });

  describe('buildProtectedResources', () => {
    it('should define function', () => {
      expect(component.buildProtectedResources).toBeDefined();
    });
  });

  describe('initUrl', () => {
    it('should define function', () => {
      expect(component.initUrl).toBeDefined();
    });
  });

  describe('addUrl', () => {
    it('should define function', () => {
      expect(component.addUrl).toBeDefined();
    });
  });

  describe('deleteUrl', () => {
    it('should define function', () => {
      expect(component.deleteUrl).toBeDefined();
    });
  });

  describe('setTabIndex', () => {
    it('should define function', () => {
      expect(component.setTabIndex).toBeDefined();
    });
  });

  describe('onTabsChange', () => {
    it('should define function', () => {
      expect(component.onTabsChange).toBeDefined();
    });
  });

  describe('saveTenant', () => {
    it('should define function', () => {
      expect(component.saveTenant).toBeDefined();
    });
  });

  describe('getTenantsCount', () => {
    it('should define function', () => {
      expect(component.getTenantsCount).toBeDefined();
    });
  });

  describe('validateUnique', () => {
    it('should define function', () => {
      expect(component.validateUnique).toBeDefined();
    });
  });

  describe('maskClientSecret', () => {
    it('should define function', () => {
      expect(component.maskClientSecret).toBeDefined();
    });
  });

  describe('unMaskClientSecret', () => {
    it('should define function', () => {
      expect(component.unMaskClientSecret).toBeDefined();
    });
  });

  describe('cancel', () => {
    it('should define function', () => {
      expect(component.cancel).toBeDefined();
    });
  });

  describe('editTenantForm', () => {
    it('should define function', () => {
      expect(component.editTenantForm).toBeDefined();
    });
  });
});
