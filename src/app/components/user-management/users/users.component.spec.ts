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
import { AppMaterialModules } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastService } from 'src/app/shared/toast';
import { HttpClientModule } from '@angular/common/http';

import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let toastSpy: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersComponent, MockComponent(NgxSpinnerComponent)],
      imports: [
        HttpClientModule,
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
        TranslateService,
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
