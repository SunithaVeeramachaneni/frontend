import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InstructionService } from '../../../services/instruction.service';
import { MyOverlayRef } from '../../myoverlay-ref';

import { BulkUploadComponent } from './bulk-upload.component';
import {of} from "rxjs";
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../../../../../state/app.state';
import { AppMaterialModules } from '../../../../../material.module';
import { AlertComponent } from '../../alert/alert.component';
import { MockComponent } from 'ng-mocks';
import { ErrorHandlerService } from '../../../../../shared/error-handler/error-handler.service';
import { AlertService } from '../../alert/alert.service';
import { businessObjects } from './bulk-upload.component.mock';
import { importedWorkInstructions } from '../../../work-instructions.page.mock';

describe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;
  let myOverlayRefSpy: MyOverlayRef;
  let alertServiceSpy: AlertService;
  let instructionServiceSpy: InstructionService;
  let errorHandlerServiceSpy: ErrorHandlerService;
  let router: Router;
  let store: MockStore<State>;

  beforeEach(waitForAsync(() => {
    myOverlayRefSpy = jasmine.createSpyObj('MyOverlayRef', ['close'], {
      data: {},
    });
    alertServiceSpy = jasmine.createSpyObj('AlertService', [
      'success',
      'error',
    ]);
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'getAllBusinessObjects',
      'addInstructionFromImportedData',
      'addStepFromImportedData',
      'getCategoriesByName',
      'addCategory',
      'deleteWorkInstruction$'
    ]);

    errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', [
      'handleError',
      'getErrorMessage'
    ]);

    TestBed.configureTestingModule({
      declarations: [BulkUploadComponent, MockComponent(AlertComponent)],
      imports: [RouterTestingModule, AppMaterialModules],
      providers: [
        { provide: MyOverlayRef, useValue: myOverlayRefSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceSpy },
        provideMockStore()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(BulkUploadComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;

    (instructionServiceSpy.getAllBusinessObjects as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(businessObjects))
      .and.callThrough();

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getStepField', () => {
    it('should define function', () => {
      expect(component.getStepField).toBeDefined();
    });

    it('should return instruction step field', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ , step1 ] = WorkInstruction_Sample_1;
      const { Instruction } = step1;
      spyOn(component, 'convertStrToList')
        .withArgs(Instruction)
        .and.returnValue(Instruction);
      const result = component.getStepField(Instruction, 'Instruction');
      expect(result).toBe(JSON.stringify({
        Title: 'Instruction',
        Active: 'true',
        FieldValue: Instruction,
        Position: 1,
        FieldType: 'RTF',
        FieldCategory: 'INS'
      }));
    });

    it('should return warning step field', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ , step1 ] = WorkInstruction_Sample_1;
      const { Warning } = step1;
      spyOn(component, 'convertStrToList')
        .withArgs(Warning)
        .and.returnValue(Warning);
      const result = component.getStepField(Warning, 'Warning');
      expect(result).toBe(JSON.stringify({
        Title: 'Warning',
        Active: 'true',
        FieldValue: Warning,
        Position: 2,
        FieldType: 'RTF',
        FieldCategory: 'WARN'
      }));
    });

    it('should return hint step field', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ , step1 ] = WorkInstruction_Sample_1;
      const { Hint } = step1;
      spyOn(component, 'convertStrToList')
        .withArgs(Hint)
        .and.returnValue(Hint);
      const result = component.getStepField(Hint, 'Hint');
      expect(result).toBe(JSON.stringify({
        Title: 'Hint',
        Active: 'true',
        FieldValue: Hint,
        Position: 3,
        FieldType: 'RTF',
        FieldCategory: 'HINT'
      }));
    });

    it('should return reaction plan step field', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ , step1 ] = WorkInstruction_Sample_1;
      const { ReactionPlan } = step1;
      spyOn(component, 'convertStrToList')
        .withArgs(ReactionPlan)
        .and.returnValue(ReactionPlan);
      const result = component.getStepField(ReactionPlan, 'ReactionPlan');
      expect(result).toBe(JSON.stringify({
        Title: 'ReactionPlan',
        Active: 'true',
        FieldValue: ReactionPlan,
        Position: 4,
        FieldType: 'RTF',
        FieldCategory: 'REACTION PLAN'
      }));
    });
  });

  describe('convertStrToList', () => {
    it('should define function', () => {
      expect(component.convertStrToList).toBeDefined();
    });
  });

  describe('fieldsObject', () => {
    it('should define function', () => {
      expect(component.fieldsObject).toBeDefined();
    });
  });

  describe('addCategory', () => {
    it('should define function', () => {
      expect(component.addCategory).toBeDefined();
    });
  });

  describe('setStepAttachments', () => {
    it('should define function', () => {
      expect(component.setStepAttachments).toBeDefined();
    });
  });

  describe('close', () => {
    it('should define function', () => {
      expect(component.close).toBeDefined();
    });
  });

  describe('getBusinessObjects', () => {
    it('should define function', () => {
      expect(component.getBusinessObjects).toBeDefined();
    });
  });
  
  describe('addIns', () => {
    it('should define function', () => {
      expect(component.addIns).toBeDefined();
    });
  });

  describe('deleteIns', () => {
    it('should define function', () => {
      expect(component.deleteIns).toBeDefined();
    });
  });

  describe('prequisiteObject', () => {
    it('should define function', () => {
      expect(component.prequisiteObject).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });
  });

  describe('getDraftedInstructionsCount', () => {
    it('should define function', () => {
      expect(component.getDraftedInstructionsCount).toBeDefined();
    });
  });

  describe('getDeletedInstructionsCount', () => {
    it('should define function', () => {
      expect(component.getDeletedInstructionsCount).toBeDefined();
    });
  });

  describe('isUploadSuccess', () => {
    it('should define function', () => {
      expect(component.isUploadSuccess).toBeDefined();
    });
  });

  describe('getBorderStyle', () => {
    it('should define function', () => {
      expect(component.getBorderStyle).toBeDefined();
    });
  });

  describe('ngOnDestroy', () => {
    it('should define function', () => {
      expect(component.ngOnDestroy).toBeDefined();
    });

    it('should unsubscribe subscriptions', () => {
      spyOn(component['uploadInfoSubscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['uploadInfoSubscription'].unsubscribe).toHaveBeenCalledWith();
    });
  });
});
