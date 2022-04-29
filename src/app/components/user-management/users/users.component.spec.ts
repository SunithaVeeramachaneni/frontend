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
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { of } from 'rxjs';
import { defaultLimit } from 'src/app/app.constants';
import { AppMaterialModules } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastService } from 'src/app/shared/toast';

import { UsersComponent } from './users.component';
import { UsersService } from './users.service';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let toastSpy: ToastService;
  let userServiceSpy: UsersService;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', [
      'getRoles$',
      'getUsersCount$',
      'getUsers$'
    ]);
    toastSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      declarations: [UsersComponent, MockComponent(NgxSpinnerComponent)],
      imports: [
        AppMaterialModules,
        SharedModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgxShimmerLoadingModule,
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
        { provide: ToastService, useValue: toastSpy },
        { provide: UsersService, useValue: userServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    (userServiceSpy.getUsers$ as jasmine.Spy)
      .withArgs({
        skip: 0,
        limit: defaultLimit
      })
      .and.returnValue(of([]));
    (userServiceSpy.getUsersCount$ as jasmine.Spy)
      .withArgs({
        isActive: true
      })
      .and.returnValue(of({ count: 0 }));
    (userServiceSpy.getRoles$ as jasmine.Spy)
      .withArgs()
      .and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
