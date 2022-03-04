import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { NgxSpinnerComponent, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AppMaterialModules } from '../../../../material.module';
import { WiCommonService } from '../../services/wi-common.services';
import { ToastService } from '../../../../shared/toast';
import { InstructionService } from '../../services/instruction.service';

import { StepContentComponent } from './step-content.component';

xdescribe('StepContentComponent', () => {
  let component: StepContentComponent;
  let fixture: ComponentFixture<StepContentComponent>;
  let spinnerSpy: NgxSpinnerService;
  let activatedRouteSpy: ActivatedRoute;
  let wiCommonServiceSpy: WiCommonService;
  let toastServiceSpy: ToastService;
  let instructionServiceSpy: InstructionService;

  beforeEach(waitForAsync(() => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: convertToParamMap({
          id: ''
        })
      }
    });
    wiCommonServiceSpy = jasmine.createSpyObj('WiCommonService', [
      'stepDetailsSave',
      'setUpdatedSteps',
      'uploadImgToPreview',
      'unloadImages',
      'updateStepTitle',
      'updateStepDetails'
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'getInstructionsById',
      'getStepById',
      'getStepsByWID',
      'updateWorkInstruction',
      'uploadAttachments',
      'updateStep',
      'removeStep',
      'addStep',
    ]);

    TestBed.configureTestingModule({
      declarations: [
        StepContentComponent,
        MockComponent(NgxSpinnerComponent)
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        AppMaterialModules
      ],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: WiCommonService, useValue: wiCommonServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: InstructionService, useValue: instructionServiceSpy },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
