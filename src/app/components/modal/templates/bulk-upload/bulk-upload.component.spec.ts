import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InstructionService } from '../../../workinstructions/instruction.service';
import { AlertService } from '../../alert/alert.service';
import { ModalModule } from '../../modal.module';
import { MyOverlayRef } from '../../myoverlay-ref';

import { BulkUploadComponent } from './bulk-upload.component';
import {of} from "rxjs";
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../../../../state/app.state';
import { AppMaterialModules } from '../../../../material.module';
import { AlertComponent } from '../../alert/alert.component';
import { MockComponent } from 'ng-mocks';

describe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;
  let myOverlayRefSpy: MyOverlayRef;
  // let alertServiceSpy: AlertService;
  let instructionServiceSpy: InstructionService;
  let router: Router;
  let store: MockStore<State>;

  const businessObjects = [{
      APPNAME: 'MWORKORDER',
      OBJECTCATEGORY: 'WORKORDER',
      FILEDNAME: "ATNAM",
      FIELDDESCRIPTION: "CHARACTERISTIC NAME"
  }];

  const headerData = {
    Categories: '[{"Category_Id":604,"Category_Name":"Sample Category1","Cover_Image":"assets/img/brand/category-placeholder.png"}]',
    Cover_Image: "doc-placeholder.png",
    CreatedBy: "Sunitha Veeramachaneni",
    created_at: "",
    EditedBy: "Sunitha Veeramachaneni",
    IsFavorite: false,
    IsPublishedTillSave: false,
    Published: false,
    SafetyKit: '{"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"SafetyKit","Position":1,"FieldValue":["Sample Kit1"," Sample Kit2 "]}',
    SpareParts: '{"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"Spareparts","Position":2,"FieldValue":["Sample Spare Part1"," Sample Spare Part2"]}',
    Tools: '{"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","Title":"Tools","Position":0,"FieldValue":["Sample Tool1"," Sample Tool2"]}',
    WI_Desc: null,
    WI_Id: 8,
    WI_Name: "Sample WorkInstruction1",
    updated_at: ""
  };
  const headerDataResp = 'WI is added Successfully';
  const steps = [{
    Attachment: '["SampleImgWIMVP.jpg","SampleImgWIMVP.jpg"]',
    Description: null,
    Fields: '[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":"[\"SampleImgWIMVP.jpg\",\"SampleImgWIMVP.jpg\"]"},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<ol><li>Sample Instruction1 \r</li><li>Sample Instruction2</li></ol>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<ol><li>Sample Warning1 \r</li><li>Sample Warning2</li></ol>"},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>Sample Hint</p>"},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>Sample ReactionPlan</p>"}]',
    Hints: '{"Title":"Hint","Active":"true","FieldValue":"<p>Sample Hint</p>","Position":3,"FieldType":"RTF","FieldCategory":"HINT"}',
    Instructions: '{"Title":"Instruction","Active":"true","FieldValue":"<ol><li>Sample Instruction1 \r</li><li>Sample Instruction2</li></ol>","Position":1,"FieldType":"RTF","FieldCategory":"INS"}',
    Published: false,
    Reaction_Plan: '{"Title":"Reaction Plan","Active":"true","FieldValue":"<p>Sample ReactionPlan</p>"}',
    Status: null,
    StepId: '',
    Title: "Sample Title2",
    WI_Id: '4428',
    Warnings: '{"Title":"Warning","Active":"true","FieldValue":"<ol><li>Sample Warning1 \r</li><li>Sample Warning2</li></ol>","Position":2,"FieldType":"RTF","FieldCategory":"WARN"}',
    isCloned: null},
    {
      Attachment: '["SampleImgWIMVP.jpg","SampleImgWIMVP.jpg"]',
      Description: null,
      Fields: '[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":"[\"SampleImgWIMVP.jpg\",\"SampleImgWIMVP.jpg\"]"},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<ol><li>Sample Instruction1 \r</li><li>Sample Instruction2</li></ol>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":"<ol><li>Sample Warning1 \r</li><li>Sample Warning2</li></ol>"},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":"<p>Sample Hint</p>"},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":"<p>Sample ReactionPlan</p>"}]',
      Hints: '{"Title":"Hint","Active":"true","FieldValue":"<p>Sample Hint</p>","Position":3,"FieldType":"RTF","FieldCategory":"HINT"}',
      Instructions: '{"Title":"Instruction","Active":"true","FieldValue":"<ol><li>Sample Instruction1 \r</li><li>Sample Instruction2</li></ol>","Position":1,"FieldType":"RTF","FieldCategory":"INS"}',
      Published: false,
      Reaction_Plan: '{"Title":"Reaction Plan","Active":"true","FieldValue":"<p>Sample ReactionPlan</p>"}',
      Status: null,
      StepId: '',
      Title: "Sample Title3",
      WI_Id: '4429',
      Warnings: '{"Title":"Warning","Active":"true","FieldValue":"<ol><li>Sample Warning1 \r</li><li>Sample Warning2</li></ol>","Position":2,"FieldType":"RTF","FieldCategory":"WARN"}',
      isCloned: null
  }];

  beforeEach(async(() => {
    myOverlayRefSpy = jasmine.createSpyObj('MyOverlayRef', ['close'], {
      data: {},
    });
    // alertServiceSpy = jasmine.createSpyObj('AlertService', [
    //   'onAlert',
    //   'success',
    //   'error',
    // ]);
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'getAllBusinessObjects',
      'addInstructionFromImportedData',
      'addStepFromImportedData',
      'getCategoriesByName',
      'addCategory',
      'deleteWorkInstruction$'
    ]);

    TestBed.configureTestingModule({
      declarations: [BulkUploadComponent, MockComponent(AlertComponent)],
      imports: [RouterTestingModule, AppMaterialModules],
      providers: [
        { provide: MyOverlayRef, useValue: myOverlayRefSpy },
        // { provide: AlertService, useValue: alertServiceSpy },
        { provide: InstructionService, useValue: instructionServiceSpy },
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

  it('Get Business Objects assigned to a product', () => {
    expect(component.getBusinessObjects).toBeDefined();
    expect(component.assignedObjectsList).toBeDefined();
    expect((component.assignedObjectsList).length).not.toBe(0);
  });

  it('Add header data from imported sheet', () => {
    if (headerData) {
      expect(component.addIns).toBeDefined();
    }
  });


});
