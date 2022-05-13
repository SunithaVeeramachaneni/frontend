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
import { defaultLimit } from 'src/app/app.constants';
import { AppMaterialModules } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TenantService } from '../services/tenant.service';
import {
  formatedTenants,
  formatedTenants$
} from '../services/tenant.service.mock';

import { TenantsComponent } from './tenants.component';
import { columns, configOptions } from './tenants.component.mock';

describe('TenantsComponent', () => {
  let component: TenantsComponent;
  let fixture: ComponentFixture<TenantsComponent>;
  let tenantServiceSpy: TenantService;
  let router: Router;
  let tenantsDe: DebugElement;
  let tenantsEl: HTMLElement;

  beforeEach(async () => {
    tenantServiceSpy = jasmine.createSpyObj('tenantServiceSpy', [
      'getTenants$',
      'getTenantsCount$',
      'updateConfigOptionsFromColumns'
    ]);
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
        { provide: TenantService, useValue: tenantServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(TenantsComponent);
    component = fixture.componentInstance;
    tenantsDe = fixture.debugElement;
    tenantsEl = tenantsDe.nativeElement;
    (tenantServiceSpy.getTenants$ as jasmine.Spy)
      .withArgs({
        skip: 0,
        limit: defaultLimit,
        isActive: true
      })
      .and.returnValue(formatedTenants$);
    (tenantServiceSpy.getTenantsCount$ as jasmine.Spy)
      .withArgs({ isActive: true })
      .and.returnValue(of({ count: formatedTenants.length }));
    (tenantServiceSpy.updateConfigOptionsFromColumns as jasmine.Spy)
      .withArgs(columns, { ...configOptions, allColumns: [] })
      .and.returnValue(configOptions);
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
        expect(component.configOptions).toEqual(configOptions);
        expect(
          tenantServiceSpy.updateConfigOptionsFromColumns
        ).toHaveBeenCalledWith(columns, { ...configOptions, allColumns: [] });
        expect(tenantServiceSpy.getTenants$).toHaveBeenCalledWith({
          skip: 0,
          limit: defaultLimit,
          isActive: true
        });
      });
    });

    it('should get tenants count', () => {
      component.tenantsCount$.subscribe((response) =>
        expect(response).toEqual({ count: formatedTenants.length })
      );
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
          isActive: true
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
          isActive: true
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
          isActive: true
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
});
