import { DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { AppMaterialModules } from '../../../material.module';
import { WiCommonService } from '../services/wi-common.services';
import { InstructionService } from '../services/instruction.service';
import { CustomStepperComponent } from './overview.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../../../state/app.state';
import { SharedModule } from 'src/app/shared/shared.module';

const sid = 1234;

describe('CustomStepperComponent', () => {
  let component: CustomStepperComponent;
  let fixture: ComponentFixture<CustomStepperComponent>;
  let instructionServiceSpy: InstructionService;
  let activatedRouteSpy: ActivatedRoute;
  let wiCommonServiceSpy: WiCommonService;
  let customStepperDe: DebugElement;
  let customStepperEl: HTMLElement;
  let store: MockStore<State>;

  beforeEach(waitForAsync(() => {
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'getInstructionsById',
      'updateWorkInstruction',
      'addStep',
      'getStepById',
      'getStepsByWID'
    ]);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: convertToParamMap({
          id: sid
        })
      }
    });
    wiCommonServiceSpy = jasmine.createSpyObj('WiCommonService', [
      'unloadImages',
      'stepDetailsSave',
      'setUpdatedSteps',
      'currentStepTitle',
      'currentTabs',
      'currentImgFromPreviewSection',
      'currentStepDetails'
    ]);

    TestBed.configureTestingModule({
      declarations: [
        CustomStepperComponent,
        MockComponent(NgxSpinnerComponent)
      ],
      imports: [AppMaterialModules, ReactiveFormsModule, SharedModule],
      providers: [
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: WiCommonService, useValue: wiCommonServiceSpy },
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
