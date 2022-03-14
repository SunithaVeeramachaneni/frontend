import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { AppMaterialModules } from './material.module';
import { CommonService } from './shared/services/common.service';
import { NgxSpinnerComponent} from 'ngx-spinner';
import { MockComponent } from 'ng-mocks';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let commonServiceSpy: CommonService;
  let translateServiceSpy: TranslateService;
  let appDe: DebugElement;
  let appEl: HTMLElement;

  beforeEach(async () => {
    commonServiceSpy = jasmine.createSpyObj(
      'CommonService',
      ['setCurrentRouteUrl', 'setTranslateLanguage'],
      {
        minimizeSidebarAction$: of(false)
      }
    );
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['use']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppMaterialModules,
        BrowserAnimationsModule
      ],
      declarations: [AppComponent, MockComponent(NgxSpinnerComponent)],
      providers: [
        {
          provide: CommonService,
          useValue: commonServiceSpy
        },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    appDe = fixture.debugElement;
    appEl = appDe.nativeElement;
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
