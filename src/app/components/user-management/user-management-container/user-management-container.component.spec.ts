import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { AppMaterialModules } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastService } from 'src/app/shared/toast';
import { HttpClientModule } from '@angular/common/http';
import { BreadcrumbService } from 'xng-breadcrumb';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { UserManagementContainerComponent } from './user-management-container.component';
import { UsersComponent } from '../users/users.component';
import { of } from 'rxjs';

fdescribe('UserManagementContainerComponent', () => {
  let component: UserManagementContainerComponent;
  let fixture: ComponentFixture<UserManagementContainerComponent>;
  let toastSpy: ToastService;
  let breadcrumbService: BreadcrumbService;
  let activatedRouteSpy: ActivatedRoute;

  beforeEach(async () => {
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({})
    });

    await TestBed.configureTestingModule({
      declarations: [UserManagementContainerComponent],
      imports: [
        HttpClientModule,
        AppMaterialModules,
        SharedModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        TranslateService,
        { provide: ToastService, useValue: toastSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: BreadcrumbService, useValue: breadcrumbService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementContainerComponent);
    component = fixture.componentInstance;
    breadcrumbService = TestBed.inject(BreadcrumbService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
