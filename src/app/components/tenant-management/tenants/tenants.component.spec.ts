/* eslint-disable @typescript-eslint/dot-notation */
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamictableModule } from '@innovapptive.com/dynamictable';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { of } from 'rxjs';
import { defaultLimit, products } from 'src/app/app.constants';
import { AppMaterialModules } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TenantService } from '../services/tenant.service';
import {
  formatedTenants,
  formatedTenants$
} from '../services/tenant.service.mock';

import { TenantsComponent } from './tenants.component';
import { columns, configOptions } from './tenants.component.mock';
import { cloneDeep } from 'lodash-es';
import { ConfigOptions } from '@innovapptive.com/dynamictable/lib/interfaces';
import { LoginService } from '../../login/services/login.service';
import { userInfo, userInfo$ } from '../../login/services/login.service.mock';
import { By } from '@angular/platform-browser';
import { skip } from 'rxjs/operators';

describe('TenantsComponent', () => {
  let component: TenantsComponent;
  let fixture: ComponentFixture<TenantsComponent>;
  let tenantServiceSpy: TenantService;
  let loginServiceSpy: LoginService;
  let router: Router;
  let tenantsDe: DebugElement;
  let tenantsEl: HTMLElement;
  let prepareMenuActionsSpy;
  let configOptionsCopy: ConfigOptions;

  beforeEach(async () => {
    tenantServiceSpy = jasmine.createSpyObj('tenantServiceSpy', [
      'getTenants$',
      'getTenantsCount$',
      'updateConfigOptionsFromColumns'
    ]);
    loginServiceSpy = jasmine.createSpyObj(
      'LoginService',
      ['checkUserHasPermission'],
      {
        loggedInUserInfo$: userInfo$
      }
    );
    await TestBed.configureTestingModule({
      declarations: [TenantsComponent],
      imports: [
        RouterTestingModule,
        NgxShimmerLoadingModule,
        SharedModule,
        AppMaterialModules,
        DynamictableModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        TranslateService,
        { provide: TenantService, useValue: tenantServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(TenantsComponent);
    component = fixture.componentInstance;
    tenantsDe = fixture.debugElement;
    tenantsEl = tenantsDe.nativeElement;
    prepareMenuActionsSpy = spyOn(component, 'prepareMenuActions');
    configOptionsCopy = cloneDeep(configOptions);
    (tenantServiceSpy.getTenants$ as jasmine.Spy)
      .withArgs({
        skip: 0,
        limit: defaultLimit,
        isActive: true,
        searchKey: '',
        products: products.join(',')
      })
      .and.returnValue(formatedTenants$);
    (tenantServiceSpy.getTenants$ as jasmine.Spy)
      .withArgs({
        skip: 1,
        limit: defaultLimit,
        isActive: true,
        searchKey: '',
        products: products.join(',')
      })
      .and.returnValue(of([]));
    (tenantServiceSpy.getTenantsCount$ as jasmine.Spy)
      .withArgs({ isActive: true, searchKey: '', products: products.join(',') })
      .and.returnValue(of({ count: formatedTenants.length }));
    (tenantServiceSpy.updateConfigOptionsFromColumns as jasmine.Spy)
      .withArgs(columns, { ...configOptionsCopy, allColumns: [] })
      .and.returnValue(configOptionsCopy);
    (loginServiceSpy.checkUserHasPermission as jasmine.Spy)
      .withArgs(userInfo.permissions, 'UPDATE_TENANT')
      .and.returnValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should get tenants data', () => {
      component.tenantsData$.subscribe((response) => {
        expect(response).toEqual({ data: formatedTenants });
        expect(component.configOptions).toEqual(configOptionsCopy);
        expect(
          tenantServiceSpy.updateConfigOptionsFromColumns
        ).toHaveBeenCalledWith(columns, {
          ...configOptionsCopy,
          allColumns: []
        });
        expect(tenantServiceSpy.getTenants$).toHaveBeenCalledWith({
          skip: 0,
          limit: defaultLimit,
          isActive: true,
          searchKey: '',
          products: products.join(',')
        });
      });
    });

    it('should get tenants count', () => {
      component.tenantsCount$.subscribe((response) =>
        expect(response).toEqual({ count: formatedTenants.length })
      );
    });

    it('should prepare config options menu actions', () => {
      component.userInfo$.subscribe((response) => {
        expect(response).toEqual(userInfo);
        expect(prepareMenuActionsSpy).toHaveBeenCalledWith(
          userInfo.permissions
        );
      });
    });
  });

  describe('getTenants', () => {
    it('should define function', () => {
      expect(component.getTenants).toBeDefined();
    });

    it('should call getTenants from tenant service', () => {
      component.skip = 0;
      component.getTenants().subscribe((response) => {
        expect(response).toEqual(formatedTenants);
        expect(tenantServiceSpy.getTenants$).toHaveBeenCalledWith({
          skip: 0,
          limit: defaultLimit,
          isActive: true,
          searchKey: '',
          products: products.join(',')
        });
      });
    });
  });

  describe('getTenantsCount', () => {
    it('should define function', () => {
      expect(component.getTenantsCount).toBeDefined();
    });

    it('should call getTenantsCount from tenant service', () => {
      component.getTenantsCount().subscribe((response) => {
        expect(response).toEqual({ count: formatedTenants.length });
        expect(tenantServiceSpy.getTenantsCount$).toHaveBeenCalledWith({
          isActive: true,
          searchKey: '',
          products: products.join(',')
        });
      });
    });
  });

  describe('handleTableEvent', () => {
    it('should define function', () => {
      expect(component.handleTableEvent).toBeDefined();
    });

    it('should handle table event', () => {
      (tenantServiceSpy.getTenants$ as jasmine.Spy)
        .withArgs({
          skip: 1,
          limit: defaultLimit,
          isActive: true,
          searchKey: '',
          products: products.join(',')
        })
        .and.returnValue(of([]));

      // TODO: better if we raise this event from UI
      component.handleTableEvent({ data: 'infiniteScroll' });

      component.tenantsData$.subscribe((response) =>
        expect(response).toEqual({ data: formatedTenants })
      );
    });
  });

  describe('rowLevelActionHandler', () => {
    it('should define function', () => {
      expect(component.rowLevelActionHandler).toBeDefined();
    });

    it("should handle 'edit' row level action from context menu", () => {
      const navigateSpy = spyOn(router, 'navigate');

      // TODO: better if we raise this event from UI
      component.rowLevelActionHandler({
        action: 'edit',
        data: formatedTenants[0]
      });

      expect(navigateSpy).toHaveBeenCalledWith(
        ['tenant-management/edit', formatedTenants[0].id],
        {
          queryParams: { edit: true }
        }
      );
    });
  });

  describe('cellClickActionHandler', () => {
    it('should define function', () => {
      expect(component.cellClickActionHandler).toBeDefined();
    });

    it("should handle 'edit' row level action from context menu", () => {
      const navigateSpy = spyOn(router, 'navigate');

      // TODO: better if we raise this event from UI
      component.cellClickActionHandler({
        columnId: 'tenantName',
        row: formatedTenants[0]
      });

      expect(navigateSpy).toHaveBeenCalledWith(
        ['tenant-management/edit', formatedTenants[0].id],
        {
          queryParams: { edit: false }
        }
      );
    });
  });

  describe('prepareMenuActions', () => {
    it('should define function', () => {
      expect(component.prepareMenuActions).toBeDefined();
    });

    it('should update config options, if user has update tenant permission', () => {
      (prepareMenuActionsSpy as jasmine.Spy).and.callThrough();
      component.prepareMenuActions(userInfo.permissions);

      expect(component.configOptions).toEqual({
        ...configOptionsCopy,
        rowLevelActions: {
          menuActions: [
            {
              title: 'Edit',
              action: 'edit'
            }
          ]
        },
        displayActionsColumn: true
      });
    });

    it('should not update config options, if user doesnt have update tenant permission', () => {
      (prepareMenuActionsSpy as jasmine.Spy).and.callThrough();
      (loginServiceSpy.checkUserHasPermission as jasmine.Spy)
        .withArgs(userInfo.permissions, 'UPDATE_TENANT')
        .and.returnValue(false);

      component.prepareMenuActions(userInfo.permissions);

      expect(component.configOptions).toEqual(configOptionsCopy);
    });
  });

  describe('toggleAllProducts', () => {
    it('should define function', () => {
      expect(component.toggleAllProducts).toBeDefined();
    });

    it(`should select first product option, when unselect 'All Products' option`, async () => {
      const trigger = tenantsDe.query(
        By.css('.mat-select-trigger')
      ).nativeElement;
      trigger.click();
      await fixture.detectChanges();
      const options = tenantsDe.queryAll(By.css('.mat-option-text'));

      options[0].nativeElement.click();
      await fixture.detectChanges();

      expect(component.searchForm.get('products').value).toEqual([products[0]]);
    });

    it(`should select all options, when select 'All Products' option`, async () => {
      const trigger = tenantsDe.query(
        By.css('.mat-select-trigger')
      ).nativeElement;
      trigger.click();
      await fixture.detectChanges();
      const options = tenantsDe.queryAll(By.css('.mat-option-text'));
      options[0].nativeElement.click(); // To unselect 'All Products'
      await fixture.detectChanges();

      options[0].nativeElement.click(); // To select 'All Products'
      await fixture.detectChanges();

      expect(component.searchForm.get('products').value).toEqual([
        component.allProductsLabel,
        ...products
      ]);
    });
  });

  describe('toggleProduct', () => {
    it('should define function', () => {
      expect(component.toggleProduct).toBeDefined();
    });

    it(`should unselect 'All Products' option along with unselected product option, when all products options are in selected state`, async () => {
      const trigger = tenantsDe.query(
        By.css('.mat-select-trigger')
      ).nativeElement;
      trigger.click();
      await fixture.detectChanges();
      const options = tenantsDe.queryAll(By.css('.mat-option-text'));

      options[1].nativeElement.click();
      await fixture.detectChanges();

      expect(component.searchForm.get('products').value).toEqual(
        products.slice(1)
      );
    });

    it(`should select 'All Products' option along with selected product option, when all products options are in selected state except selected product`, async () => {
      const trigger = tenantsDe.query(
        By.css('.mat-select-trigger')
      ).nativeElement;
      trigger.click();
      await fixture.detectChanges();
      const options = tenantsDe.queryAll(By.css('.mat-option-text'));
      options[1].nativeElement.click(); // To unselect 'All Products & first product'
      await fixture.detectChanges();

      options[1].nativeElement.click(); // To select 'first product'
      await fixture.detectChanges();

      expect(component.searchForm.get('products').value).toEqual([
        component.allProductsLabel,
        ...products
      ]);
    });
  });

  describe('getProducts', () => {
    it('should define function', () => {
      expect(component.getProducts).toBeDefined();
    });

    it('should return poroducts in comma separated list', () => {
      expect(component.getProducts()).toBe(products.join(','));

      component.searchForm.patchValue({ products: [products[0]] });
      expect(component.getProducts()).toBe(products[0]);
    });
  });
});
