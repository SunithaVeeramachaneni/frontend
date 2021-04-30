import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { AppMaterialModules } from '../../../material.module';
import { CommonService } from '../../../shared/common.services';
import { InstructionService } from '../instruction.service';
import { CustomStepperComponent } from './overview.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../../../state/app.state';

const sid = 1234;

describe('CustomStepperComponent', () => {
  let component: CustomStepperComponent;
  let fixture: ComponentFixture<CustomStepperComponent>;
  let instructionServiceSpy: InstructionService;
  let activatedRouteSpy: ActivatedRoute;
  let commonServiceSpy: CommonService;
  let customStepperDe: DebugElement;
  let customStepperEl: HTMLElement;
  let store: MockStore<State>;

  beforeEach(async(() => {
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'getInstructionsById',
      'updateWorkInstruction',
      'addStep',
      'getStepById',
      'getStepsByWID',
    ]);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: convertToParamMap({
          id: sid,
        }),
      },
    });
    commonServiceSpy = jasmine.createSpyObj('CommonService', [
      'unloadImages',
      'stepDetailsSave',
      'setUpdatedSteps',
      'currentStepTitle',
      'currentTabs',
      'currentImgFromPreviewSection',
      'currentStepDetails'
    ]);

    TestBed.configureTestingModule({
      declarations: [CustomStepperComponent, MockComponent(NgxSpinnerComponent)],
      imports: [AppMaterialModules, ReactiveFormsModule],
      providers: [
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: CommonService, useValue: commonServiceSpy },
        provideMockStore()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CustomStepperComponent);
    component = fixture.componentInstance;
    customStepperDe = fixture.debugElement;
    customStepperEl = customStepperDe.nativeElement;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
