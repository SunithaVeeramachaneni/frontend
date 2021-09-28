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
import { businessObjects, category1, userDetails } from './bulk-upload.component.mock';
import { importedWorkInstructions } from '../../../work-instructions.page.mock';
import { ErrorInfo } from '../../../../../interfaces';

fdescribe('BulkUploadComponent', () => {
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
      data: importedWorkInstructions,
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
    localStorage.setItem('loggedInUser', JSON.stringify(userDetails));
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
      const resp = '<ol><li>Sample Instruction1</li><li>Sample Instruction2</li></ol>';
      spyOn(component, 'convertStrToList')
        .withArgs(Instruction)
        .and.returnValue(resp);
      const result = component.getStepField(Instruction, 'Instruction');
      expect(component.convertStrToList).toHaveBeenCalledWith(Instruction.trim());
      expect(result).toBe(JSON.stringify({
        Title: 'Instruction',
        Active: 'true',
        FieldValue: resp,
        Position: 1,
        FieldType: 'RTF',
        FieldCategory: 'INS'
      }));
    });

    it('should return instruction step field with empty FieldValue', () => {
      spyOn(component, 'convertStrToList').and.callThrough();
      const result = component.getStepField(' ', 'Instruction');
      expect(component.convertStrToList).not.toHaveBeenCalled();
      expect(result).toBe(JSON.stringify({
        Title: 'Instruction',
        Active: 'true',
        FieldValue: '',
        Position: 1,
        FieldType: 'RTF',
        FieldCategory: 'INS'
      }));
    });

    it('should return warning step field', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ , step1 ] = WorkInstruction_Sample_1;
      const { Warning } = step1;
      const resp = `<ul><li> Sample Warning1 </li><li> Sample Warning2</li></ul>`;
      spyOn(component, 'convertStrToList')
        .withArgs(Warning)
        .and.returnValue(resp);
      const result = component.getStepField(Warning, 'Warning');
      expect(component.convertStrToList).toHaveBeenCalledWith(Warning.trim());
      expect(result).toBe(JSON.stringify({
        Title: 'Warning',
        Active: 'true',
        FieldValue: resp,
        Position: 2,
        FieldType: 'RTF',
        FieldCategory: 'WARN'
      }));
    });

    it('should return hint step field', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ , step1 ] = WorkInstruction_Sample_1;
      const { Hint } = step1;
      const resp = `<p>Sample Hint</p>`;
      spyOn(component, 'convertStrToList')
        .withArgs(Hint)
        .and.returnValue(resp);
      const result = component.getStepField(Hint, 'Hint');
      expect(component.convertStrToList).toHaveBeenCalledWith(Hint.trim());
      expect(result).toBe(JSON.stringify({
        Title: 'Hint',
        Active: 'true',
        FieldValue: resp,
        Position: 3,
        FieldType: 'RTF',
        FieldCategory: 'HINT'
      }));
    });

    it('should return reaction plan step field', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ , step1 ] = WorkInstruction_Sample_1;
      const { ReactionPlan } = step1;
      const resp = '<p>Sample ReactionPlan</p>';
      spyOn(component, 'convertStrToList')
        .withArgs(ReactionPlan)
        .and.returnValue(resp);
      const result = component.getStepField(ReactionPlan, 'ReactionPlan');
      expect(component.convertStrToList).toHaveBeenCalledWith(ReactionPlan.trim());
      expect(result).toBe(JSON.stringify({
        Title: 'ReactionPlan',
        Active: 'true',
        FieldValue: resp,
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

    it('should convert string into ordered list', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ , step1 ] = WorkInstruction_Sample_1;
      const { Instruction } = step1;
      expect(component.convertStrToList(Instruction)).toBe('<ol><li>Sample Instruction1</li><li>Sample Instruction2</li></ol>');
    });

    it('should convert string into paragraph with ordered list', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ , step1 ] = WorkInstruction_Sample_1;
      const { Instruction } = step1;
      expect(component.convertStrToList(`paragraph ${Instruction}`)).toBe('<p>paragraph</p><ol><li>Sample Instruction1</li><li>Sample Instruction2</li></ol>');
    });

    it('should convert string into unordered list', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ , step1 ] = WorkInstruction_Sample_1;
      const { Warning } = step1;
      expect(component.convertStrToList(`paragraph ${Warning}`)).toBe(`<p>paragraph </p><ul><li> Sample Warning1 </li><li> Sample Warning2</li></ul>`);
    });

    it('should convert string into paragraph with unordered list', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ , step1 ] = WorkInstruction_Sample_1;
      const { Warning } = step1;
      expect(component.convertStrToList(Warning)).toBe(`<ul><li> Sample Warning1 </li><li> Sample Warning2</li></ul>`);
    });

    it('should convert string into paragraph', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ , step1 ] = WorkInstruction_Sample_1;
      const { Hint } = step1;
      expect(component.convertStrToList(Hint)).toBe(`<p>Sample Hint</p>`);
    });
  });

  describe('getStepFields', () => {
    it('should define function', () => {
      expect(component.getStepFields).toBeDefined();
    });

    it('should return step fields', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ , step1 ] = WorkInstruction_Sample_1;
      const { Instruction, Warning, Hint, ReactionPlan, Attachment_1_Name, Attachment_2_Name } = step1;
      spyOn(component, 'convertStrToList').and.callThrough();
      expect(component.getStepFields(Instruction, Warning, Hint, ReactionPlan, JSON.stringify([Attachment_1_Name, Attachment_2_Name])))
      .toBe('[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":["SampleImgWIMVP.jpg","SampleImgWIMVP.jpg"]},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<ol><li>Sample Instruction1</li><li>Sample Instruction2</li></ol>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<ul><li> Sample Warning1 </li><li> Sample Warning2</li></ul>"},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>Sample Hint</p>"},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>Sample ReactionPlan</p>"}]');
      expect(component.convertStrToList).toHaveBeenCalledWith(Instruction.trim());
      expect(component.convertStrToList).toHaveBeenCalledWith(Warning.trim());
      expect(component.convertStrToList).toHaveBeenCalledWith(Hint.trim());
      expect(component.convertStrToList).toHaveBeenCalledWith(ReactionPlan.trim());
    });

    it('should return step fields in case empty values', () => {
      spyOn(component, 'convertStrToList');
      expect(component.getStepFields('', '', '', '', null))
      .toBe('[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":""},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":""},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":""},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":""},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":""}]');
      expect(component.convertStrToList).not.toHaveBeenCalled();
    });
  });

  describe('addCategory', () => {
    it('should define function', () => {
      expect(component.addCategory).toBeDefined();
    });

    it('should return category observable', () => {
      const { Category_Name, Cover_Image } = category1;
      const data = {
        Category_Name,
        CId: null,
        Cover_Image
      }
      const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
      (instructionServiceSpy.addCategory as jasmine.Spy)
        .withArgs(data, info)
        .and.returnValue(of(category1));
      component.addCategory(Category_Name, info).subscribe(
        resp => expect(resp).toEqual(category1)
      );
    });

    it('should return category observable without info', () => {
      const { Category_Name, Cover_Image } = category1;
      const data = {
        Category_Name,
        CId: null,
        Cover_Image
      }
      const info: ErrorInfo = { } as ErrorInfo;
      (instructionServiceSpy.addCategory as jasmine.Spy)
        .withArgs(data, info)
        .and.returnValue(of(category1));
      component.addCategory(Category_Name).subscribe(
        resp => expect(resp).toEqual(category1)
      );
    });
  });

  describe('getStepAttachments', () => {
    it('should define function', () => {
      expect(component.getStepAttachments).toBeDefined();
    });

    it('should return attachments if attachment_name field values present in step data', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ , step1 ] = WorkInstruction_Sample_1;
      const {Attachment_1_Name, Attachment_2_Name} = step1;
      expect(component.getStepAttachments(step1)).toBe(JSON.stringify([Attachment_1_Name, Attachment_2_Name]));
    });

    it('should return null if attachment_name field values empty in step data', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ , , step2 ] = WorkInstruction_Sample_1;
      expect(component.getStepAttachments(step2)).toBeNull();
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

    it('should return business objects if assigned objects values present in header data', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [ header ] = WorkInstruction_Sample_1;
      const { AssignedObjects } = header;
      const response = component.getBusinessObjects(AssignedObjects, businessObjects);
      expect(response).toBe(JSON.stringify([{"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"AUART","FIELDDESCRIPTION":"ORDER TYPE","Value":"Test Order"},{"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"EQUNR","FIELDDESCRIPTION":"EQUIPMENT NUMBER","Value":"12345"}]));
    });

    it('should return null if assigned objects values not present in header data', () => {
      const { WorkInstruction_Sample_2 } = importedWorkInstructions;
      const [ header ] = WorkInstruction_Sample_2;
      const { AssignedObjects } = header;
      const response = component.getBusinessObjects(AssignedObjects, businessObjects);
      expect(response).toBeNull();
    });

    it('should return null if assigned objects value is empty in header data', () => {
      const { WorkInstruction_Sample_3 } = importedWorkInstructions;
      const [ header ] = WorkInstruction_Sample_3;
      const { AssignedObjects } = header;
      const response = component.getBusinessObjects(AssignedObjects, businessObjects);
      expect(response).toBeNull();
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

  describe('getPrerequisite', () => {
    it('should define function', () => {
      expect(component.getPrerequisite).toBeDefined();
    });

    it('should return prerequisite for Tools', () => {
      const { WorkInstruction_Sample_1: [ overview ] } = importedWorkInstructions;
      const { Tools } = overview;
      expect(component.getPrerequisite(Tools, 'Tools')).toBe(JSON.stringify({"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"Tools","Position":0,"FieldValue":["Sample Tool1"," Sample Tool2"]}));
    });

    it('should return prerequisite for safty kits', () => {
      const { WorkInstruction_Sample_1: [ overview ] } = importedWorkInstructions;
      const { SafetyKit } = overview;
      expect(component.getPrerequisite(SafetyKit, 'SafetyKit')).toBe(JSON.stringify({"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"SafetyKit","Position":1,"FieldValue":["Sample Kit1"," Sample Kit2"]}));
    });

    it('should return prerequisite for spare parts', () => {
      const { WorkInstruction_Sample_1: [ overview ] } = importedWorkInstructions;
      const { SpareParts } = overview;
      expect(component.getPrerequisite(SpareParts, 'Spareparts')).toBe(JSON.stringify({"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"Spareparts","Position":2,"FieldValue":["Sample Spare Part1"," Sample Spare Part2"]}));
    });

    it('should return null if value is empty', () => {
      expect(component.getPrerequisite('', 'Tools')).toBeNull();
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

    it('should return drafted instructions count', () => {
      console.log(component.ins);
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
