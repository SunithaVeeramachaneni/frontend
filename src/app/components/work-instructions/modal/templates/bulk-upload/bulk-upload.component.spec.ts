import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InstructionService } from '../../../services/instruction.service';
import { MyOverlayRef } from '../../myoverlay-ref';

import { BulkUploadComponent } from './bulk-upload.component';
import { of, throwError } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../../../../../state/app.state';
import { AppMaterialModules } from '../../../../../material.module';
import { AlertComponent } from '../../alert/alert.component';
import { MockComponent } from 'ng-mocks';
import { ErrorHandlerService } from '../../../../../shared/error-handler/error-handler.service';
import { AlertService } from '../../alert/alert.service';
import {
  businessObjects,
  category1,
  category2,
  category3,
  inst1Details,
  inst2Details,
  inst3Details,
  inst1Resp,
  userDetails,
  inst1StepDetails,
  inst1StepResp,
  inst3Resp
} from './bulk-upload.component.mock';
import { importedWorkInstructions } from '../../../work-instructions.component.mock';
import { ErrorInfo } from '../../../../../interfaces';
import { WiCommonService } from '../../../services/wi-common.services';
import { HttpErrorResponse } from '@angular/common/http';
import * as BulkUploadActions from '../../state/bulkupload.actions';
import { DebugElement } from '@angular/core';

describe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;
  let myOverlayRefSpy: MyOverlayRef;
  let alertServiceSpy: AlertService;
  let instructionServiceSpy: InstructionService;
  let wiCommonServiceSpy: WiCommonService;
  let errorHandlerServiceSpy: ErrorHandlerService;
  let router: Router;
  let store: MockStore<State>;
  let bulkUploadDe: DebugElement;
  let bulkUploadEl: HTMLElement;

  const info: ErrorInfo = {
    displayToast: false,
    failureResponse: 'throwError'
  };
  let addInsSpy: jasmine.Spy;

  beforeEach(
    waitForAsync(() => {
      myOverlayRefSpy = jasmine.createSpyObj('MyOverlayRef', ['close'], {
        data: {
          ...importedWorkInstructions,
          isAudioOrVideoFile: false,
          successUrl: '/work-instructions/drafts',
          failureUrl: '/work-instructions',
          s3Folder: 'bulkupload'
        }
      });
      alertServiceSpy = jasmine.createSpyObj('AlertService', [
        'success',
        'error'
      ]);
      instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
        'getAllBusinessObjects',
        'addInstructionFromImportedData',
        'addStepFromImportedData',
        'getCategoriesByName',
        'addCategory',
        'deleteWorkInstruction$',
        'deleteFiles',
        'copyFiles'
      ]);

      wiCommonServiceSpy = jasmine.createSpyObj(
        'WiCommonService',
        ['fetchCategories'],
        {
          uploadInfoAction$: of({})
        }
      );

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
          { provide: WiCommonService, useValue: wiCommonServiceSpy },
          provideMockStore()
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(BulkUploadComponent);
    router = TestBed.inject(Router);
    bulkUploadDe = fixture.debugElement;
    bulkUploadEl = bulkUploadDe.nativeElement;
    component = fixture.componentInstance;

    (instructionServiceSpy.getAllBusinessObjects as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(businessObjects));
    (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
      .withArgs('Sample Category1', info)
      .and.returnValue(of([category1]));
    (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
      .withArgs('Sample Category2', info)
      .and.returnValue(of([category2]));
    (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
      .withArgs('Sample Category3', info)
      .and.returnValue(of([category3]));
    (instructionServiceSpy.deleteFiles as jasmine.Spy)
      .withArgs('bulkupload')
      .and.returnValue(of('bulkupload'));
    addInsSpy = spyOn(component, 'addIns');
    localStorage.setItem('loggedInUser', JSON.stringify(userDetails));
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
      const [, step1] = WorkInstruction_Sample_1;
      const { Instruction } = step1;
      const resp =
        '<ol><li>Sample Instruction1</li><li>Sample Instruction2</li></ol>';
      spyOn(component, 'convertStrToList')
        .withArgs(Instruction)
        .and.returnValue(resp);

      const result = component.getStepField(Instruction, 'Instruction');

      expect(component.convertStrToList).toHaveBeenCalledWith(
        Instruction.trim()
      );
      expect(result).toBe(
        JSON.stringify({
          Title: 'Instruction',
          Active: 'true',
          FieldValue: resp,
          Position: 1,
          FieldType: 'RTF',
          FieldCategory: 'INS'
        })
      );
    });

    it('should return instruction step field with empty FieldValue', () => {
      spyOn(component, 'convertStrToList').and.callThrough();

      const result = component.getStepField(' ', 'Instruction');

      expect(component.convertStrToList).not.toHaveBeenCalled();
      expect(result).toBe(
        JSON.stringify({
          Title: 'Instruction',
          Active: 'true',
          FieldValue: '',
          Position: 1,
          FieldType: 'RTF',
          FieldCategory: 'INS'
        })
      );
    });

    it('should return warning step field', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [, step1] = WorkInstruction_Sample_1;
      const { Warning } = step1;
      const resp = `<ul><li> Sample Warning1 </li><li> Sample Warning2</li></ul>`;
      spyOn(component, 'convertStrToList')
        .withArgs(Warning)
        .and.returnValue(resp);

      const result = component.getStepField(Warning, 'Warning');

      expect(component.convertStrToList).toHaveBeenCalledWith(Warning.trim());
      expect(result).toBe(
        JSON.stringify({
          Title: 'Warning',
          Active: 'true',
          FieldValue: resp,
          Position: 2,
          FieldType: 'RTF',
          FieldCategory: 'WARN'
        })
      );
    });

    it('should return hint step field', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [, step1] = WorkInstruction_Sample_1;
      const { Hint } = step1;
      const resp = `<p>Sample Hint</p>`;
      spyOn(component, 'convertStrToList').withArgs(Hint).and.returnValue(resp);

      const result = component.getStepField(Hint, 'Hint');

      expect(component.convertStrToList).toHaveBeenCalledWith(Hint.trim());
      expect(result).toBe(
        JSON.stringify({
          Title: 'Hint',
          Active: 'true',
          FieldValue: resp,
          Position: 3,
          FieldType: 'RTF',
          FieldCategory: 'HINT'
        })
      );
    });

    it('should return reaction plan step field', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [, step1] = WorkInstruction_Sample_1;
      const { ReactionPlan } = step1;
      const resp = '<p>Sample ReactionPlan</p>';
      spyOn(component, 'convertStrToList')
        .withArgs(ReactionPlan)
        .and.returnValue(resp);

      const result = component.getStepField(ReactionPlan, 'ReactionPlan');

      expect(component.convertStrToList).toHaveBeenCalledWith(
        ReactionPlan.trim()
      );
      expect(result).toBe(
        JSON.stringify({
          Title: 'ReactionPlan',
          Active: 'true',
          FieldValue: resp,
          Position: 4,
          FieldType: 'RTF',
          FieldCategory: 'REACTION PLAN'
        })
      );
    });
  });

  describe('convertStrToList', () => {
    it('should define function', () => {
      expect(component.convertStrToList).toBeDefined();
    });

    it('should convert string into ordered list', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [, step1] = WorkInstruction_Sample_1;
      const { Instruction } = step1;

      expect(component.convertStrToList(Instruction)).toBe(
        '<ol><li>Sample Instruction1</li><li>Sample Instruction2</li></ol>'
      );
    });

    it('should convert string into paragraph with ordered list', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [, step1] = WorkInstruction_Sample_1;
      const { Instruction } = step1;

      expect(component.convertStrToList(`paragraph ${Instruction}`)).toBe(
        '<p>paragraph</p><ol><li>Sample Instruction1</li><li>Sample Instruction2</li></ol>'
      );
    });

    it('should convert string into unordered list', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [, step1] = WorkInstruction_Sample_1;
      const { Warning } = step1;

      expect(component.convertStrToList(`paragraph ${Warning}`)).toBe(
        `<p>paragraph </p><ul><li> Sample Warning1 </li><li> Sample Warning2</li></ul>`
      );
    });

    it('should convert string into paragraph with unordered list', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [, step1] = WorkInstruction_Sample_1;
      const { Warning } = step1;

      expect(component.convertStrToList(Warning)).toBe(
        `<ul><li> Sample Warning1 </li><li> Sample Warning2</li></ul>`
      );
    });

    it('should convert string into paragraph', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [, step1] = WorkInstruction_Sample_1;
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
      const [, step1] = WorkInstruction_Sample_1;
      const {
        Instruction,
        Warning,
        Hint,
        ReactionPlan,
        Attachment_1_Name,
        Attachment_2_Name
      } = step1;
      spyOn(component, 'convertStrToList').and.callThrough();

      expect(
        component.getStepFields(
          Instruction,
          Warning,
          Hint,
          ReactionPlan,
          JSON.stringify([Attachment_1_Name, Attachment_2_Name])
        )
      ).toBe(
        '[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":["SampleImgWIMVP.jpg","SampleImgWIMVP1.jpg"]},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<ol><li>Sample Instruction1</li><li>Sample Instruction2</li></ol>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<ul><li> Sample Warning1 </li><li> Sample Warning2</li></ul>"},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>Sample Hint</p>"},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>Sample ReactionPlan</p>"}]'
      );
      expect(component.convertStrToList).toHaveBeenCalledWith(
        Instruction.trim()
      );
      expect(component.convertStrToList).toHaveBeenCalledWith(Warning.trim());
      expect(component.convertStrToList).toHaveBeenCalledWith(Hint.trim());
      expect(component.convertStrToList).toHaveBeenCalledWith(
        ReactionPlan.trim()
      );
    });

    it('should return step fields in case empty values', () => {
      spyOn(component, 'convertStrToList');

      expect(component.getStepFields('', '', '', '', null)).toBe(
        '[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":""},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":""},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":""},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":""},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":""}]'
      );
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
      };
      (instructionServiceSpy.addCategory as jasmine.Spy)
        .withArgs(data, info)
        .and.returnValue(of(category1));

      component
        .addCategory(Category_Name, info)
        .subscribe((resp) => expect(resp).toEqual(category1));
    });

    it('should return category observable without info', () => {
      const { Category_Name, Cover_Image } = category1;
      const data = {
        Category_Name,
        CId: null,
        Cover_Image
      };
      const info: ErrorInfo = {} as ErrorInfo;
      (instructionServiceSpy.addCategory as jasmine.Spy)
        .withArgs(data, info)
        .and.returnValue(of(category1));

      component
        .addCategory(Category_Name)
        .subscribe((resp) => expect(resp).toEqual(category1));
    });
  });

  describe('getStepAttachments', () => {
    it('should define function', () => {
      expect(component.getStepAttachments).toBeDefined();
    });

    it('should return attachments if attachment & attachment_name field values present in step data', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [, step1] = WorkInstruction_Sample_1;
      const { Attachment_1_Name, Attachment_2_Name } = step1;

      expect(component.getStepAttachments(step1)).toBe(
        JSON.stringify([Attachment_1_Name, Attachment_2_Name])
      );
    });

    it('should remove duplicate attachments name if attachment_name field values are duplicate', () => {
      const { WorkInstruction_Sample_2 } = importedWorkInstructions;
      const [, step1] = WorkInstruction_Sample_2;
      const { Attachment_1_Name } = step1;

      expect(component.getStepAttachments(step1)).toBe(
        JSON.stringify([Attachment_1_Name])
      );
    });

    it('should return null if attachment field values empty in step data', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [, , , step3] = WorkInstruction_Sample_1;

      expect(component.getStepAttachments(step3)).toBeNull();
    });

    it('should return null if attachment_name field values empty in step data', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [, , step2] = WorkInstruction_Sample_1;

      expect(component.getStepAttachments(step2)).toBeNull();
    });
  });

  describe('close', () => {
    beforeEach(() => {
      (addInsSpy as jasmine.Spy).and.callThrough();
    });

    it('should define function', () => {
      expect(component.close).toBeDefined();
    });

    it('should navigate to successUrl when click on okay if upload is success and drafted instruction count is non zero', () => {
      const { WorkInstruction_Sample_3 } = importedWorkInstructions;
      (
        Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
          .get as jasmine.Spy
      ).and.returnValue({
        WorkInstruction_Sample_3,
        isAudioOrVideoFile: false,
        successUrl: '/work-instructions/drafts',
        failureUrl: '/work-instructions',
        s3Folder: 'bulkupload'
      });
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs('Sample Category3', info)
        .and.returnValue(of([category3]));
      (instructionServiceSpy.addInstructionFromImportedData as jasmine.Spy)
        .withArgs(inst3Details, 'bulkupload', info)
        .and.returnValue(of(inst3Resp));
      spyOn(router, 'navigate');

      component.ngOnInit();
      fixture.detectChanges();

      const buttons = bulkUploadEl.querySelectorAll('.modal-footer button');
      (buttons[1] as HTMLElement).click();
      expect(router.navigate).toHaveBeenCalledWith([
        '/work-instructions/drafts'
      ]);
    });

    it('should navigate to failureUrl when click on okay if upload is failure or drafted instruction count is zero', () => {
      const { WorkInstruction_Sample_3 } = importedWorkInstructions;
      (
        Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
          .get as jasmine.Spy
      ).and.returnValue({
        WorkInstruction_Sample_3,
        isAudioOrVideoFile: false,
        successUrl: '/work-instructions/drafts',
        failureUrl: '/work-instructions',
        s3Folder: 'bulkupload'
      });
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs('Sample Category3', info)
        .and.returnValue(of([category3]));
      (instructionServiceSpy.addInstructionFromImportedData as jasmine.Spy)
        .withArgs(inst3Details, 'bulkupload', info)
        .and.returnValue(
          throwError({ message: 'Unable to create instruction' })
        );
      spyOn(router, 'navigate');

      component.ngOnInit();
      fixture.detectChanges();

      const buttons = bulkUploadEl.querySelectorAll('.modal-footer button');
      (buttons[1] as HTMLElement).click();
      expect(wiCommonServiceSpy.fetchCategories).toHaveBeenCalledWith();
      expect(router.navigate).toHaveBeenCalledWith(['/work-instructions']);
    });
  });

  describe('getBusinessObjects', () => {
    it('should define function', () => {
      expect(component.getBusinessObjects).toBeDefined();
    });

    it('should return business objects if assigned objects values present in header data', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [header] = WorkInstruction_Sample_1;
      const { AssignedObjects } = header;

      const response = component.getBusinessObjects(
        AssignedObjects,
        businessObjects
      );

      expect(response).toBe(
        JSON.stringify([
          {
            OBJECTCATEGORY: 'WORKORDER',
            FILEDNAME: 'AUART',
            FIELDDESCRIPTION: 'ORDER TYPE',
            Value: 'Test Order'
          },
          {
            OBJECTCATEGORY: 'WORKORDER',
            FILEDNAME: 'EQUNR',
            FIELDDESCRIPTION: 'EQUIPMENT NUMBER',
            Value: '12345'
          }
        ])
      );
    });

    it('should return null if assigned objects values not present in header data', () => {
      const { WorkInstruction_Sample_2 } = importedWorkInstructions;
      const [header] = WorkInstruction_Sample_2;
      const { AssignedObjects } = header;

      const response = component.getBusinessObjects(
        AssignedObjects,
        businessObjects
      );

      expect(response).toBeNull();
    });

    it('should return null if assigned objects value is empty in header data', () => {
      const { WorkInstruction_Sample_3 } = importedWorkInstructions;
      const [header] = WorkInstruction_Sample_3;
      const { AssignedObjects } = header;

      const response = component.getBusinessObjects(
        AssignedObjects,
        businessObjects
      );

      expect(response).toBeNull();
    });
  });

  describe('addIns', () => {
    beforeEach(() => {
      spyOn(store, 'dispatch');
      (addInsSpy as jasmine.Spy).and.callThrough();
    });

    it('should define function', () => {
      expect(component.addIns).toBeDefined();
    });

    it('should create instruction and its steps', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [step1, step2, step3] = inst1StepDetails;
      const [step1Resp, step2Resp, step3Resp] = inst1StepResp;
      const { Id, WI_Id } = inst1Resp;
      const ins = {
        instructionName: 'Sample WorkInstruction1',
        insPostedSuccessfully: false,
        insPostingFailed: false
      };
      (
        Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
          .get as jasmine.Spy
      ).and.returnValue({
        WorkInstruction_Sample_1,
        isAudioOrVideoFile: false,
        successUrl: '/work-instructions/drafts',
        failureUrl: '/work-instructions',
        s3Folder: 'bulkupload'
      });
      (instructionServiceSpy.addInstructionFromImportedData as jasmine.Spy)
        .withArgs(inst1Details, 'bulkupload', info)
        .and.returnValue(of(inst1Resp));
      (instructionServiceSpy.addStepFromImportedData as jasmine.Spy)
        .withArgs(step1, info)
        .and.returnValue(of(step1Resp));
      (instructionServiceSpy.addStepFromImportedData as jasmine.Spy)
        .withArgs(step2, info)
        .and.returnValue(of(step2Resp));
      (instructionServiceSpy.addStepFromImportedData as jasmine.Spy)
        .withArgs(step3, info)
        .and.returnValue(of(step3Resp));
      (instructionServiceSpy.copyFiles as jasmine.Spy)
        .withArgs(
          {
            folderPath: 'bulkupload',
            newFolderPath: `${step1Resp.WI_Id}/${step1Resp.StepId}`,
            copyFiles: JSON.parse(step1Resp.Attachment)
          },
          info
        )
        .and.returnValue(of(JSON.parse(step1Resp.Attachment)));
      spyOn(component, 'deleteFiles');
      component.ins = [ins];

      component.addIns(
        inst1Details,
        WorkInstruction_Sample_1,
        Object.keys({ WorkInstruction_Sample_1 }),
        0,
        ins,
        'bulkupload'
      );

      expect(store.dispatch).toHaveBeenCalledWith(
        BulkUploadActions.resetInstructionWithSteps()
      );
      expect(
        instructionServiceSpy.addInstructionFromImportedData
      ).toHaveBeenCalledTimes(1);
      expect(
        instructionServiceSpy.addInstructionFromImportedData
      ).toHaveBeenCalledWith(inst1Details, 'bulkupload', info);
      expect(
        instructionServiceSpy.addStepFromImportedData
      ).toHaveBeenCalledTimes(3);
      expect(
        instructionServiceSpy.addStepFromImportedData
      ).toHaveBeenCalledWith(step1, info);
      expect(
        instructionServiceSpy.addStepFromImportedData
      ).toHaveBeenCalledWith(step2, info);
      expect(
        instructionServiceSpy.addStepFromImportedData
      ).toHaveBeenCalledWith(step3, info);
      expect(instructionServiceSpy.copyFiles).toHaveBeenCalledTimes(1);
      expect(instructionServiceSpy.copyFiles).toHaveBeenCalledWith(
        {
          folderPath: 'bulkupload',
          newFolderPath: `${step1Resp.WI_Id}/${step1Resp.StepId}`,
          copyFiles: JSON.parse(step1Resp.Attachment)
        },
        info
      );
      expect(component.loadResults).toBe(true);
      expect(component.deleteFiles).toHaveBeenCalledWith('bulkupload');
      expect(component.ins).toEqual([
        { ...ins, insPostedSuccessfully: true, id: Id, WI_Id }
      ]);
      expect(store.dispatch).toHaveBeenCalledWith(
        BulkUploadActions.addInstructionWithSteps({
          instruction: inst1Resp,
          steps: inst1StepResp
        })
      );
    });

    it('should delete instruction if any step creation in instruction got failed', () => {
      const { WorkInstruction_Sample_1 } = importedWorkInstructions;
      const [step1, step2, step3] = inst1StepDetails;
      const [step1Resp, step2Resp] = inst1StepResp;
      const { Id, WI_Id } = inst1Resp;
      const ins = {
        instructionName: 'Sample WorkInstruction1',
        insPostedSuccessfully: false,
        insPostingFailed: false
      };
      (
        Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
          .get as jasmine.Spy
      ).and.returnValue({
        WorkInstruction_Sample_1,
        isAudioOrVideoFile: false,
        successUrl: '/work-instructions/drafts',
        failureUrl: '/work-instructions',
        s3Folder: 'bulkupload'
      });
      (instructionServiceSpy.addInstructionFromImportedData as jasmine.Spy)
        .withArgs(inst1Details, 'bulkupload', info)
        .and.returnValue(of(inst1Resp));
      (instructionServiceSpy.addStepFromImportedData as jasmine.Spy)
        .withArgs(step1, info)
        .and.returnValue(of(step1Resp));
      (instructionServiceSpy.addStepFromImportedData as jasmine.Spy)
        .withArgs(step2, info)
        .and.returnValue(of(step2Resp));
      (instructionServiceSpy.addStepFromImportedData as jasmine.Spy)
        .withArgs(step3, info)
        .and.returnValue(throwError({ message: 'Unable to create step' }));
      spyOn(component, 'deleteIns');
      spyOn(component, 'deleteFiles');
      component.ins = [ins];

      component.addIns(
        inst1Details,
        WorkInstruction_Sample_1,
        Object.keys({ WorkInstruction_Sample_1 }),
        0,
        ins,
        'bulkupload'
      );

      expect(store.dispatch).toHaveBeenCalledWith(
        BulkUploadActions.resetInstructionWithSteps()
      );
      expect(
        instructionServiceSpy.addInstructionFromImportedData
      ).toHaveBeenCalledTimes(1);
      expect(
        instructionServiceSpy.addInstructionFromImportedData
      ).toHaveBeenCalledWith(inst1Details, 'bulkupload', info);
      expect(
        instructionServiceSpy.addStepFromImportedData
      ).toHaveBeenCalledTimes(3);
      expect(
        instructionServiceSpy.addStepFromImportedData
      ).toHaveBeenCalledWith(step1, info);
      expect(
        instructionServiceSpy.addStepFromImportedData
      ).toHaveBeenCalledWith(step2, info);
      expect(
        instructionServiceSpy.addStepFromImportedData
      ).toHaveBeenCalledWith(step3, info);
      expect(component.deleteIns).toHaveBeenCalledWith(
        { ...ins, id: Id, WI_Id },
        0,
        false
      );
      expect(component.loadResults).toBe(true);
      expect(component.deleteFiles).toHaveBeenCalledWith('bulkupload');
      expect(component.ins).toEqual([
        { ...ins, insPostingFailed: true, id: Id, WI_Id }
      ]);
      expect(errorHandlerServiceSpy.handleError).toHaveBeenCalledWith({
        message: 'Unable to create step'
      } as HttpErrorResponse);
    });

    it('should create instruction without steps if steps are empty', () => {
      const { WorkInstruction_Sample_3 } = importedWorkInstructions;
      const { Id, WI_Id } = inst3Resp;
      const ins = {
        instructionName: 'Sample WorkInstruction3',
        insPostedSuccessfully: false,
        insPostingFailed: false
      };
      (
        Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
          .get as jasmine.Spy
      ).and.returnValue({
        WorkInstruction_Sample_3,
        isAudioOrVideoFile: false,
        successUrl: '/work-instructions/drafts',
        failureUrl: '/work-instructions',
        s3Folder: 'bulkupload'
      });
      (instructionServiceSpy.addInstructionFromImportedData as jasmine.Spy)
        .withArgs(inst3Details, 'bulkupload', info)
        .and.returnValue(of(inst3Resp));
      spyOn(component, 'deleteFiles');
      component.ins = [ins];

      component.addIns(
        inst3Details,
        WorkInstruction_Sample_3,
        Object.keys({ WorkInstruction_Sample_3 }),
        0,
        ins,
        'bulkupload'
      );

      expect(store.dispatch).toHaveBeenCalledWith(
        BulkUploadActions.resetInstructionWithSteps()
      );
      expect(
        instructionServiceSpy.addInstructionFromImportedData
      ).toHaveBeenCalledTimes(1);
      expect(
        instructionServiceSpy.addInstructionFromImportedData
      ).toHaveBeenCalledWith(inst3Details, 'bulkupload', info);
      expect(
        instructionServiceSpy.addStepFromImportedData
      ).toHaveBeenCalledTimes(0);
      expect(component.loadResults).toBe(true);
      expect(component.deleteFiles).toHaveBeenCalledWith('bulkupload');
      expect(component.ins).toEqual([
        { ...ins, insPostedSuccessfully: true, id: Id, WI_Id }
      ]);
      expect(store.dispatch).toHaveBeenCalledWith(
        BulkUploadActions.addInstructionWithSteps({
          instruction: inst3Resp,
          steps: []
        })
      );
    });

    it('should handle instruction creation failure', () => {
      const { WorkInstruction_Sample_3 } = importedWorkInstructions;
      const ins = {
        instructionName: 'Sample WorkInstruction3',
        insPostedSuccessfully: false,
        insPostingFailed: false
      };
      (
        Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
          .get as jasmine.Spy
      ).and.returnValue({
        WorkInstruction_Sample_3,
        isAudioOrVideoFile: false,
        successUrl: '/work-instructions/drafts',
        failureUrl: '/work-instructions',
        s3Folder: 'bulkupload'
      });
      (instructionServiceSpy.addInstructionFromImportedData as jasmine.Spy)
        .withArgs(inst3Details, 'bulkupload', info)
        .and.returnValue(
          throwError({ message: 'Unable to create instruction' })
        );
      spyOn(component, 'deleteFiles');
      component.ins = [ins];

      component.addIns(
        inst3Details,
        WorkInstruction_Sample_3,
        Object.keys({ WorkInstruction_Sample_3 }),
        0,
        ins,
        'bulkupload'
      );

      expect(store.dispatch).toHaveBeenCalledWith(
        BulkUploadActions.resetInstructionWithSteps()
      );
      expect(
        instructionServiceSpy.addInstructionFromImportedData
      ).toHaveBeenCalledTimes(1);
      expect(
        instructionServiceSpy.addInstructionFromImportedData
      ).toHaveBeenCalledWith(inst3Details, 'bulkupload', info);
      expect(component.loadResults).toBe(true);
      expect(component.deleteFiles).toHaveBeenCalledWith('bulkupload');
      expect(component.ins).toEqual([{ ...ins, insPostingFailed: true }]);
      expect(errorHandlerServiceSpy.handleError).toHaveBeenCalledWith({
        message: 'Unable to create instruction'
      } as HttpErrorResponse);
    });
  });

  describe('deleteIns', () => {
    beforeEach(() => {
      (addInsSpy as jasmine.Spy).and.callThrough();
    });

    it('should define function', () => {
      expect(component.deleteIns).toBeDefined();
    });

    it('should delete instruction without alert', () => {
      const { Id, WI_Id } = inst1Resp;
      const { Id: id1, WI_Id: WI_Id1 } = inst3Resp;
      const ins = [
        {
          instructionName: 'Sample WorkInstruction1',
          insPostedSuccessfully: true,
          insPostingFailed: true,
          id: Id,
          WI_Id
        },
        {
          instructionName: 'Sample WorkInstruction3',
          insPostedSuccessfully: true,
          insPostingFailed: false,
          id: id1,
          WI_Id: WI_Id1
        }
      ];
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(ins[0].id, info)
        .and.returnValue(of(inst1Resp));
      component.ins = ins;

      component.deleteIns(ins[0], 0, false);

      expect(alertServiceSpy.success).not.toHaveBeenCalled();
      expect(component.ins).toEqual(ins);
    });

    it('should delete instruction with alert', () => {
      const { Id, WI_Id } = inst1Resp;
      const { Id: id1, WI_Id: WI_Id1 } = inst3Resp;
      const ins = [
        {
          instructionName: 'Sample WorkInstruction1',
          insPostedSuccessfully: true,
          insPostingFailed: false,
          id: Id,
          WI_Id
        },
        {
          instructionName: 'Sample WorkInstruction3',
          insPostedSuccessfully: true,
          insPostingFailed: false,
          id: id1,
          WI_Id: WI_Id1
        }
      ];
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(ins[0].id, info)
        .and.returnValue(of(inst1Resp));
      component.ins = ins;

      component.deleteIns(ins[0], 0);

      expect(alertServiceSpy.success).toHaveBeenCalledWith(
        'Instruction has be deleted'
      );
      expect(component.ins).toEqual([
        { ...ins[0], insDeletedSuccessfully: true },
        ins[1]
      ]);
    });

    it('should handle error', () => {
      const { Id, WI_Id } = inst1Resp;
      const { Id: id1, WI_Id: WI_Id1 } = inst3Resp;
      const ins = [
        {
          instructionName: 'Sample WorkInstruction1',
          insPostedSuccessfully: true,
          insPostingFailed: true,
          id: Id,
          WI_Id
        },
        {
          instructionName: 'Sample WorkInstruction3',
          insPostedSuccessfully: true,
          insPostingFailed: false,
          id: id1,
          WI_Id: WI_Id1
        }
      ];
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(ins[0].id, info)
        .and.returnValue(
          throwError({ message: 'Unable to delete instruction' })
        );
      component.ins = ins;

      component.deleteIns(ins[0], 0, false);

      expect(errorHandlerServiceSpy.getErrorMessage).toHaveBeenCalledWith({
        message: 'Unable to delete instruction'
      } as HttpErrorResponse);
      expect(alertServiceSpy.error).toHaveBeenCalledWith(
        errorHandlerServiceSpy.getErrorMessage({
          message: 'Unable to delete instruction'
        } as HttpErrorResponse)
      );
    });

    it('should delete instruction when click on delete icon', () => {
      const { WorkInstruction_Sample_3 } = importedWorkInstructions;
      (
        Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
          .get as jasmine.Spy
      ).and.returnValue({
        WorkInstruction_Sample_3,
        isAudioOrVideoFile: false,
        successUrl: '/work-instructions/drafts',
        failureUrl: '/work-instructions',
        s3Folder: 'bulkupload'
      });
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs('Sample Category3', info)
        .and.returnValue(of([category3]));
      (instructionServiceSpy.addInstructionFromImportedData as jasmine.Spy)
        .withArgs(inst3Details, 'bulkupload', info)
        .and.returnValue(of(inst3Resp));
      spyOn(component, 'deleteIns');

      component.ngOnInit();
      fixture.detectChanges();

      const buttons = bulkUploadEl.querySelectorAll(
        '.bulk-upload-instructions-list .pull-right mat-icon'
      );
      (buttons[0] as HTMLElement).click();
      expect(component.deleteIns).toHaveBeenCalledWith(component.ins[0], 0);
    });
  });

  describe('getPrerequisite', () => {
    it('should define function', () => {
      expect(component.getPrerequisite).toBeDefined();
    });

    it('should return prerequisite for Tools', () => {
      const {
        WorkInstruction_Sample_1: [overview]
      } = importedWorkInstructions;
      const { Tools } = overview;

      expect(component.getPrerequisite(Tools, 'Tools')).toBe(
        JSON.stringify({
          Active: 'true',
          FieldCategory: 'HEADER',
          FieldType: 'RTF',
          Title: 'Tools',
          Position: 0,
          FieldValue: ['Sample Tool1', ' Sample Tool2']
        })
      );
    });

    it('should return prerequisite for safty kits', () => {
      const {
        WorkInstruction_Sample_1: [overview]
      } = importedWorkInstructions;
      const { SafetyKit } = overview;

      expect(component.getPrerequisite(SafetyKit, 'SafetyKit')).toBe(
        JSON.stringify({
          Active: 'true',
          FieldCategory: 'HEADER',
          FieldType: 'RTF',
          Title: 'SafetyKit',
          Position: 1,
          FieldValue: ['Sample Kit1', ' Sample Kit2']
        })
      );
    });

    it('should return prerequisite for spare parts', () => {
      const {
        WorkInstruction_Sample_1: [overview]
      } = importedWorkInstructions;
      const { SpareParts } = overview;

      expect(component.getPrerequisite(SpareParts, 'Spareparts')).toBe(
        JSON.stringify({
          Active: 'true',
          FieldCategory: 'HEADER',
          FieldType: 'RTF',
          Title: 'Spareparts',
          Position: 2,
          FieldValue: ['Sample Spare Part1', ' Sample Spare Part2']
        })
      );
    });

    it('should return null if value is empty', () => {
      expect(component.getPrerequisite('', 'Tools')).toBeNull();
    });
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should not set instance variables of the component', () => {
      (
        Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
          .get as jasmine.Spy
      ).and.returnValue({});

      component.ngOnInit();

      expect(component.isAudioOrVideoFile).toBeUndefined();
      expect(component.successUrl).toBeUndefined();
      expect(component.failureUrl).toBeUndefined();
      expect(component.s3Folder).toBeUndefined();
      expect(component.ins).toEqual([]);
    });

    it('should call addIns function on instruction service call success response', () => {
      (
        Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
          .get as jasmine.Spy
      ).and.returnValue({
        ...importedWorkInstructions,
        isAudioOrVideoFile: false,
        successUrl: '/work-instructions/drafts',
        failureUrl: '/work-instructions',
        s3Folder: 'bulkupload'
      });
      const {
        WorkInstruction_Sample_1,
        WorkInstruction_Sample_2,
        WorkInstruction_Sample_3
      } = importedWorkInstructions;
      const ins = [
        {
          instructionName: 'Sample WorkInstruction1',
          insPostedSuccessfully: false,
          insPostingFailed: false
        },
        {
          instructionName: 'Sample WorkInstruction2',
          insPostedSuccessfully: false,
          insPostingFailed: false
        },
        {
          instructionName: 'Sample WorkInstruction3',
          insPostedSuccessfully: false,
          insPostingFailed: false
        }
      ];
      const [ins1, ins2, ins3] = ins;
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs('Sample Category1', info)
        .and.returnValue(of([category1]));
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs('Sample Category2', info)
        .and.returnValue(of([category2]));
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs('Sample Category3', info)
        .and.returnValue(of([]));
      spyOn(component, 'addCategory')
        .withArgs('Sample Category3', info)
        .and.returnValue(of(category3));

      component.ngOnInit();

      expect(component.isAudioOrVideoFile).toBe(false);
      expect(component.successUrl).toBe('/work-instructions/drafts');
      expect(component.failureUrl).toBe('/work-instructions');
      expect(component.s3Folder).toBe('bulkupload');
      expect(
        instructionServiceSpy.getAllBusinessObjects
      ).toHaveBeenCalledWith();
      expect(instructionServiceSpy.getCategoriesByName).toHaveBeenCalledWith(
        'Sample Category1',
        info
      );
      expect(instructionServiceSpy.getCategoriesByName).toHaveBeenCalledWith(
        'Sample Category2',
        info
      );
      expect(instructionServiceSpy.getCategoriesByName).toHaveBeenCalledWith(
        'Sample Category3',
        info
      );
      expect(component.addCategory).toHaveBeenCalledTimes(1);
      expect(component.addCategory).toHaveBeenCalledWith(
        'Sample Category3',
        info
      );
      expect(component.addIns).toHaveBeenCalledWith(
        inst1Details,
        WorkInstruction_Sample_1,
        Object.keys(importedWorkInstructions),
        0,
        ins1,
        'bulkupload'
      );
      expect(component.addIns).toHaveBeenCalledWith(
        inst2Details,
        WorkInstruction_Sample_2,
        Object.keys(importedWorkInstructions),
        1,
        ins2,
        'bulkupload'
      );
      expect(component.addIns).toHaveBeenCalledWith(
        inst3Details,
        [],
        Object.keys(importedWorkInstructions),
        2,
        ins3,
        'bulkupload'
      );
      expect(component.ins).toEqual(ins);
    });

    it('should handle error on instruction service call failure response', () => {
      (
        Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
          .get as jasmine.Spy
      ).and.returnValue({
        ...importedWorkInstructions,
        isAudioOrVideoFile: false,
        successUrl: '/work-instructions/drafts',
        failureUrl: '/work-instructions',
        s3Folder: 'bulkupload'
      });
      const { WorkInstruction_Sample_1, WorkInstruction_Sample_2 } =
        importedWorkInstructions;
      const ins = [
        {
          instructionName: 'Sample WorkInstruction1',
          insPostedSuccessfully: false,
          insPostingFailed: false
        },
        {
          instructionName: 'Sample WorkInstruction2',
          insPostedSuccessfully: false,
          insPostingFailed: false
        },
        {
          instructionName: 'Sample WorkInstruction3',
          insPostedSuccessfully: false,
          insPostingFailed: true
        }
      ];
      const [ins1, ins2, ins3] = ins;
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs('Sample Category1', info)
        .and.returnValue(of([category1]));
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs('Sample Category2', info)
        .and.returnValue(of([category2]));
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs('Sample Category3', info)
        .and.returnValue(
          throwError({ message: 'Unable to fetch category details' })
        );
      spyOn(component, 'deleteFiles');

      component.ngOnInit();

      expect(component.isAudioOrVideoFile).toBe(false);
      expect(component.successUrl).toBe('/work-instructions/drafts');
      expect(component.failureUrl).toBe('/work-instructions');
      expect(component.s3Folder).toBe('bulkupload');
      expect(
        instructionServiceSpy.getAllBusinessObjects
      ).toHaveBeenCalledWith();
      expect(instructionServiceSpy.getCategoriesByName).toHaveBeenCalledWith(
        'Sample Category1',
        info
      );
      expect(instructionServiceSpy.getCategoriesByName).toHaveBeenCalledWith(
        'Sample Category2',
        info
      );
      expect(instructionServiceSpy.getCategoriesByName).toHaveBeenCalledWith(
        'Sample Category3',
        info
      );
      expect(component.addIns).toHaveBeenCalledWith(
        inst1Details,
        WorkInstruction_Sample_1,
        Object.keys(importedWorkInstructions),
        0,
        ins1,
        'bulkupload'
      );
      expect(component.addIns).toHaveBeenCalledWith(
        inst2Details,
        WorkInstruction_Sample_2,
        Object.keys(importedWorkInstructions),
        1,
        ins2,
        'bulkupload'
      );
      expect(component.ins).toEqual(ins);
      expect(errorHandlerServiceSpy.handleError).toHaveBeenCalledWith({
        message: 'Unable to fetch category details'
      } as HttpErrorResponse);
      expect(component.loadResults).toBe(true);
      expect(component.deleteFiles).toHaveBeenCalledWith('bulkupload');
    });
  });

  describe('getDraftedInstructionsCount', () => {
    it('should define function', () => {
      expect(component.getDraftedInstructionsCount).toBeDefined();
    });

    it('should return drafted instructions count', () => {
      component.ins = [
        {
          instructionName: 'Sample WorkInstruction1',
          insPostedSuccessfully: true,
          insPostingFailed: false
        },
        {
          instructionName: 'Sample WorkInstruction2',
          insPostedSuccessfully: true,
          insPostingFailed: false
        },
        {
          instructionName: 'Sample WorkInstruction3',
          insPostedSuccessfully: true,
          insPostingFailed: false,
          insDeletedSuccessfully: true
        }
      ];

      expect(component.getDraftedInstructionsCount()).toBe(2);
    });
  });

  describe('getDeletedInstructionsCount', () => {
    it('should define function', () => {
      expect(component.getDeletedInstructionsCount).toBeDefined();
    });

    it('should return deleted instructions count', () => {
      component.ins = [
        {
          instructionName: 'Sample WorkInstruction1',
          insPostedSuccessfully: true,
          insPostingFailed: false
        },
        {
          instructionName: 'Sample WorkInstruction2',
          insPostedSuccessfully: true,
          insPostingFailed: false
        },
        {
          instructionName: 'Sample WorkInstruction3',
          insPostedSuccessfully: true,
          insPostingFailed: false,
          insDeletedSuccessfully: true
        }
      ];

      expect(component.getDeletedInstructionsCount()).toBe(1);
    });
  });

  describe('isUploadSuccess', () => {
    it('should define function', () => {
      expect(component.isUploadSuccess).toBeDefined();
    });

    it('should return true if upload is success', () => {
      component.ins = [
        {
          instructionName: 'Sample WorkInstruction1',
          insPostedSuccessfully: true,
          insPostingFailed: false
        },
        {
          instructionName: 'Sample WorkInstruction2',
          insPostedSuccessfully: true,
          insPostingFailed: false
        },
        {
          instructionName: 'Sample WorkInstruction3',
          insPostedSuccessfully: false,
          insPostingFailed: true
        }
      ];

      expect(component.isUploadSuccess()).toBe(true);
    });

    it('should return false if upload is failure', () => {
      component.ins = [
        {
          instructionName: 'Sample WorkInstruction1',
          insPostedSuccessfully: false,
          insPostingFailed: true
        },
        {
          instructionName: 'Sample WorkInstruction2',
          insPostedSuccessfully: true,
          insPostingFailed: false
        },
        {
          instructionName: 'Sample WorkInstruction3',
          insPostedSuccessfully: false,
          insPostingFailed: true
        }
      ];

      expect(component.isUploadSuccess()).toBe(false);
    });
  });

  describe('getBorderStyle', () => {
    it('should define function', () => {
      expect(component.getBorderStyle).toBeDefined();
    });

    it('should return 0px border top if deleted instruction count is same as instruction count', () => {
      component.ins = [
        {
          instructionName: 'Sample WorkInstruction1',
          insPostedSuccessfully: true,
          insPostingFailed: false,
          insDeletedSuccessfully: true
        },
        {
          instructionName: 'Sample WorkInstruction2',
          insPostedSuccessfully: true,
          insPostingFailed: false,
          insDeletedSuccessfully: true
        },
        {
          instructionName: 'Sample WorkInstruction3',
          insPostedSuccessfully: true,
          insPostingFailed: false,
          insDeletedSuccessfully: true
        }
      ];

      expect(component.getBorderStyle(true)).toEqual({ 'border-top': 0 });
    });

    it('should return 1px border top if deleted instruction count not same as instruction count', () => {
      component.ins = [
        {
          instructionName: 'Sample WorkInstruction1',
          insPostedSuccessfully: true,
          insPostingFailed: false
        },
        {
          instructionName: 'Sample WorkInstruction2',
          insPostedSuccessfully: true,
          insPostingFailed: false
        },
        {
          instructionName: 'Sample WorkInstruction3',
          insPostedSuccessfully: true,
          insPostingFailed: false
        }
      ];

      expect(component.getBorderStyle()).toEqual({
        'border-top': '1px solid #c8ced3'
      });
    });
  });

  describe('deleteFiles', () => {
    it('should define function', () => {
      expect(component.deleteFiles).toBeDefined();
    });

    it('should delete files from S3 given folder', () => {
      component.deleteFiles('bulkupload');
      expect(instructionServiceSpy.deleteFiles).toHaveBeenCalledWith(
        'bulkupload'
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should define function', () => {
      expect(component.ngOnDestroy).toBeDefined();
    });

    it('should unsubscribe subscriptions', () => {
      component.ngOnInit();
      spyOn(component['uploadInfoSubscription'], 'unsubscribe');

      component.ngOnDestroy();

      expect(
        component['uploadInfoSubscription'].unsubscribe
      ).toHaveBeenCalledWith();
    });
  });
});
