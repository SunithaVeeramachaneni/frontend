import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { LoginErrorComponent } from '../login-error/login-error.component';

import { LoginErrorModalComponent } from './login-error-modal.component';

describe('LoginErrorModalComponent', () => {
  let component: LoginErrorModalComponent;
  let fixture: ComponentFixture<LoginErrorModalComponent>;
  let matDialogRefSpy: MatDialogRef<LoginErrorComponent>;
  let loginErrDe: DebugElement;
  let loginErrEl: HTMLElement;

  beforeEach(async () => {
    matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [LoginErrorModalComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        TranslateService,
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              email: 'test@innovapptive.com',
              reason: 'inactive'
            })
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginErrorModalComponent);
    component = fixture.componentInstance;
    loginErrDe = fixture.debugElement;
    loginErrEl = loginErrDe.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should set email and reason variables', () => {
      component.ngOnInit();

      expect(component.email).toBe('test@innovapptive.com');
      expect(component.reason).toBe('inactive');
    });
  });

  describe('close', () => {
    it('should define function', () => {
      expect(component.close).toBeDefined();
    });

    it('should close login error modal', () => {
      loginErrEl.querySelector('button').click();

      expect(matDialogRefSpy.close).toHaveBeenCalledWith();
    });
  });
});
