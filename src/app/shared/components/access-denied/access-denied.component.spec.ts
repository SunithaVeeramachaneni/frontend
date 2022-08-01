import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { HeaderService } from '../../services/header.service';

import { AccessDeniedComponent } from './access-denied.component';

describe('AccessDeniedComponent', () => {
  let component: AccessDeniedComponent;
  let fixture: ComponentFixture<AccessDeniedComponent>;
  let headerServiceSpy: HeaderService;

  beforeEach(async () => {
    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'setHeaderTitle'
    ]);

    await TestBed.configureTestingModule({
      declarations: [AccessDeniedComponent],
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
        {
          provide: HeaderService,
          useValue: headerServiceSpy
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ url: '/dashboard' })
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessDeniedComponent);
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

    it('should set header title and url', () => {
      component.ngOnInit();

      expect(headerServiceSpy.setHeaderTitle).toHaveBeenCalledWith(
        'Access Denied'
      );
      expect(component.url).toContain('dashboard');
    });
  });
});
