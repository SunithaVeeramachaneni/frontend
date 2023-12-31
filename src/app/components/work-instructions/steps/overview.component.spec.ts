import { CdkStepperModule } from '@angular/cdk/stepper';
import { DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { AppMaterialModules } from '../../../material.module';
import { Base64HelperService } from '../services/base64-helper.service';
import { State } from '../../../state/app.state';
import { InstructionService } from '../services/instruction.service';
import { getInstruction } from '../state/instruction.selectors';
import * as InstructionActions from '../state/intruction.actions';
import {
  CustomStepperComponent,
  OverviewComponent
} from './overview.component';
import { defaultCategoryId, defaultCategoryName } from '../../../app.constants';
import { SharedModule } from 'src/app/shared/shared.module';

const categoryDetails = [
  {
    Category_Id: defaultCategoryId,
    Category_Name: defaultCategoryName,
    Cover_Image:
      'assets/work-instructions-icons/img/brand/category-placeholder.png'
  },
  {
    Category_Id: 'xyzkddaz_',
    Category_Name: 'Health-Precautions',
    Cover_Image: 'assets/work-instructions-icons/CoverImages/coverimage2.png'
  },
  {
    Category_Id: '_aswehdjf',
    Category_Name: 'Sample Category',
    Cover_Image: 'assets/work-instructions-icons/CoverImages/coverimage3.png'
  }
];

const [category1, category2, category3] = categoryDetails;
const categories1 = [` ${category1.Category_Name}`];
const categories2 = [
  ` ${category2.Category_Name}`,
  ` ${category3.Category_Name}`
];
const image = 'assets/work-instructions-icons/img/brand/doc-placeholder.png';

const businessObjects = [
  {
    __metadata: {
      id: "http://54.208.252.183:8000/sap/opu/odata/INVCEC/RACE_SRV/WIOBJECTCATEGORYCollection(APPNAME='MWORKORDER',OBJECTCATEGORY='WORKORDER',FILEDNAME='ATNAM')",
      uri: "http://54.208.252.183:8000/sap/opu/odata/INVCEC/RACE_SRV/WIOBJECTCATEGORYCollection(APPNAME='MWORKORDER',OBJECTCATEGORY='WORKORDER',FILEDNAME='ATNAM')",
      type: 'RACECLIENT.WIObjectCategory'
    },
    APPNAME: 'MWORKORDER',
    OBJECTCATEGORY: 'WORKORDER',
    FILEDNAME: 'ATNAM',
    FIELDDESCRIPTION: 'CHARACTERISTIC NAME'
  },
  {
    __metadata: {
      id: "http://54.208.252.183:8000/sap/opu/odata/INVCEC/RACE_SRV/WIOBJECTCATEGORYCollection(APPNAME='MWORKORDER',OBJECTCATEGORY='WORKORDER',FILEDNAME='AUART')",
      uri: "http://54.208.252.183:8000/sap/opu/odata/INVCEC/RACE_SRV/WIOBJECTCATEGORYCollection(APPNAME='MWORKORDER',OBJECTCATEGORY='WORKORDER',FILEDNAME='AUART')",
      type: 'RACECLIENT.WIObjectCategory'
    },
    APPNAME: 'MWORKORDER',
    OBJECTCATEGORY: 'WORKORDER',
    FILEDNAME: 'AUART',
    FIELDDESCRIPTION: 'ORDER TYPE'
  }
];

const workInstruction = [
  {
    Id: '3707',
    WI_Id: 30,
    Categories: JSON.stringify([category1.Category_Id]),
    WI_Name: 'TestingInsFour',
    WI_Desc: null,
    Tools:
      '{"Title":"Tools","Position":0,"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","FieldValue":["Test Tools One","Test Tools Two"]}',
    Equipements: null,
    Locations: null,
    IsFavorite: false,
    CreatedBy: 'Tester One',
    EditedBy: 'Tester One',
    AssignedObjects:
      '[{"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"AUART","FIELDDESCRIPTION":"ORDER TYPE","Value":"Test Order"}]',
    SpareParts:
      '{"Title":"SpareParts","Position":2,"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","FieldValue":["Test Spares One","Test Spares Two","Test Spares Three"]}',
    SafetyKit:
      '{"Title":"SafetyKit","Position":1,"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","FieldValue":["Test Safety"]}',
    created_at: '2020-12-09T08:54:08.000Z',
    updated_at: '2020-12-09T09:02:19.000Z',
    Published: false,
    IsPublishedTillSave: false,
    Cover_Image: image,
    IsFromAudioOrVideoFile: false,
    IsAudioOrVideoFileDeleted: false,
    FilePath: null,
    FileType: null
  }
];

const steps = [
  {
    StepId: '2859',
    WI_Id: '3707',
    Title: 'STEP1',
    Description: null,
    Status: null,
    Fields:
      '[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":""},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<p>Step One Instruction Four</p>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":""},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":""},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":""}]',
    Attachment: null,
    Instructions:
      '{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<p>Step One Instruction Four</p>"}',
    Warnings:
      '{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":""}',
    Hints:
      '{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":""}',
    isCloned: null,
    Reaction_Plan:
      '{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":""}',
    Published: false
  },
  {
    StepId: '2860',
    WI_Id: '3707',
    Title: 'STEP2',
    Description: null,
    Status: null,
    Fields:
      '[{"Title":"Attachment","Position":0,"Active":"true","FieldCategory":"ATT","FieldType":"ATT","FieldValue":""},{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<p>Step Two Test Instruction Four</p>"},{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":""},{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":""},{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":""}]',
    Attachment: null,
    Instructions:
      '{"Title":"Instruction","Position":1,"Active":"true","FieldCategory":"INS","FieldType":"RTF","FieldValue":"<p>Step Two Test Instruction Four</p>"}',
    Warnings:
      '{"Title":"Warning","Position":2,"Active":"true","FieldCategory":"WARN","FieldType":"RTF","FieldValue":""}',
    Hints:
      '{"Title":"Hint","Position":3,"Active":"true","FieldCategory":"HINT","FieldType":"RTF","FieldValue":""}',
    isCloned: null,
    Reaction_Plan:
      '{"Title":"Reaction Plan","Position":4,"Active":"true","FieldCategory":"REACTION PLAN","FieldType":"RTF","FieldValue":""}',
    Published: false
  }
];

const IMAGECONTENT = [
  {
    fileContent: '/9j/4AAQSkZJRgABAQEASABIAAD==',
    fileName: 'Thumbnail.jpg',
    fileType: '.jpg'
  }
];

const wid = workInstruction[0].Id;

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let activatedRouteSpy: ActivatedRoute;
  let instructionServiceSpy: InstructionService;
  let base64HelperServiceSpy: Base64HelperService;
  let overviewDe: DebugElement;
  let overviewEl: HTMLElement;
  let store: MockStore<State>;
  let mockInstructionSelector;

  beforeEach(waitForAsync(() => {
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: convertToParamMap({
          id: wid
        })
      }
    });
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'getAllCategories',
      'getAllBusinessObjects',
      'getStepsByWID',
      'getInstructionsById'
    ]);
    base64HelperServiceSpy = jasmine.createSpyObj('Base64HelperService', [
      'getImageContents',
      'getBase64ImageData',
      'getBase64Image',
      'resetBase64ImageDetails'
    ]);

    TestBed.configureTestingModule({
      declarations: [OverviewComponent, MockComponent(CustomStepperComponent)],
      imports: [
        ReactiveFormsModule,
        AppMaterialModules,
        CdkStepperModule,
        BrowserAnimationsModule,
        SharedModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: Base64HelperService, useValue: base64HelperServiceSpy },
        provideMockStore()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    mockInstructionSelector = store.overrideSelector(
      getInstruction,
      workInstruction[0]
    );
    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    overviewDe = fixture.debugElement;
    overviewEl = overviewDe.nativeElement;
    (instructionServiceSpy.getAllCategories as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(categoryDetails))
      .and.callThrough();
    (instructionServiceSpy.getAllBusinessObjects as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(businessObjects))
      .and.callThrough();
    (instructionServiceSpy.getInstructionsById as jasmine.Spy)
      .withArgs(wid)
      .and.returnValue(of(workInstruction[0]))
      .and.callThrough();
    (instructionServiceSpy.getStepsByWID as jasmine.Spy)
      .withArgs(wid)
      .and.returnValue(of(steps))
      .and.callThrough();
    spyOn(component, 'updateAssignedObjects');
    spyOn(component, 'updatePrequisite');
    component.titleProvided = false;
    fixture.detectChanges();
    component.titleProvided = true;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define varibles', () => {
    expect(component.createWIForm).toBeDefined();
    expect(component.assignedObjectsList).toBeDefined();
    expect(component.categoriesList).toBeDefined();
    expect(component.selectedTools).toBeDefined();
    expect(component.selectedSafetyKits).toBeDefined();
    expect(component.selectedSpareParts).toBeDefined();
    expect(component.WI_Details).toBeDefined();
    expect(component.WI_Details_Drafting).toBeDefined();
    expect(component.recentWorkInstruction).toBeDefined();
    expect(component.selectedInstructionData).toBeDefined();
    expect(component.coverImageFiles).toBeDefined();
    expect(component.imageDataCalls).toBeDefined();
    expect(component['updateOverviewDetailsCalled']).toBeDefined();
    expect(component.titleProvided).toBeDefined();
  });

  describe('triggerResize', () => {
    it('should define function', () => {
      expect(component.triggerResize).toBeDefined();
    });
  });

  describe('OnCategoryObjectsList', () => {
    it('should define function', () => {
      expect(component.OnCategoryObjectsList).toBeDefined();
    });

    it('should remove selected category from the list', () => {
      spyOn(<any>component, 'removeFirst').and.callFake(() => [
        categoryDetails[1].Category_Name
      ]);
      spyOn(component.instructionDataEntry, 'emit');
      component.recentWorkInstruction = { ...workInstruction[0] };
      component.categoriesSelected = [
        categoryDetails[1].Category_Name,
        categoryDetails[2].Category_Name
      ];
      component.OnCategoryObjectsList(categoryDetails[2].Category_Name);
      expect(component['removeFirst']).toHaveBeenCalledWith(
        [categoryDetails[1].Category_Name, categoryDetails[2].Category_Name],
        categoryDetails[2].Category_Name
      );
      expect(component.categoriesSelected).toEqual([
        categoryDetails[1].Category_Name
      ]);
      expect(component.instructionDataEntry.emit).toHaveBeenCalledWith({
        insObj: {
          ...workInstruction[0],
          Categories: JSON.stringify([categoryDetails[1].Category_Id])
        },
        update: true
      });
    });

    it('should emit default unassigned category if all categories are removed', () => {
      spyOn(<any>component, 'removeFirst').and.callFake(() => []);
      spyOn(component.instructionDataEntry, 'emit');
      component.recentWorkInstruction = { ...workInstruction[0] };
      component.categoriesSelected = [categoryDetails[1].Category_Name];
      component.OnCategoryObjectsList(categoryDetails[1].Category_Name);
      expect(component['removeFirst']).toHaveBeenCalledWith(
        [categoryDetails[1].Category_Name],
        categoryDetails[1].Category_Name
      );
      expect(component.categoriesSelected).toEqual([
        categoryDetails[0].Category_Name
      ]);
      expect(component.instructionDataEntry.emit).toHaveBeenCalledWith({
        insObj: {
          ...workInstruction[0],
          Categories: JSON.stringify([categoryDetails[0].Category_Id])
        },
        update: true
      });
    });
  });

  describe('removePrequisite', () => {
    it('should define function', () => {
      expect(component.removePrequisite).toBeDefined();
    });

    it('should remove selected prerequisite type', () => {
      const value = 'Test Tools One';
      const type = 'Tools';
      component.removePrequisite({ type, value });
      expect(component.updatePrequisite).toHaveBeenCalledWith(
        value,
        type,
        true,
        true
      );
    });
  });

  describe('getAllStepData', () => {
    it('should define function', () => {
      expect(component.getAllStepData).toBeDefined();
    });

    it('should emit step details', () => {
      const update = true;
      spyOn(component, 'getAllStepData').and.callThrough();
      spyOn(component.stepsDataEntry, 'emit');
      const customStepper = overviewDe.query(
        By.directive(CustomStepperComponent)
      );
      const customStepperComponent: CustomStepperComponent =
        customStepper.componentInstance;
      customStepperComponent.allStepData.emit({ update });
      expect(component.getAllStepData).toHaveBeenCalledWith({ update });
      expect(component.stepsDataEntry.emit).toHaveBeenCalledWith({ update });
    });
  });

  describe('publishOnAddCloneStepsHandler', () => {
    it('should define function', () => {
      expect(component.publishOnAddCloneStepsHandler).toBeDefined();
    });

    it('should emit publish value(true/false) on add/clone step', () => {
      spyOn(component, 'publishOnAddCloneStepsHandler').and.callThrough();
      spyOn(component.publishOnAddCloneSteps, 'emit');
      const customStepper = overviewDe.query(
        By.directive(CustomStepperComponent)
      );
      const customStepperComponent: CustomStepperComponent =
        customStepper.componentInstance;
      customStepperComponent.publishOnAddCloneSteps.emit(true);
      expect(component.publishOnAddCloneStepsHandler).toHaveBeenCalledWith(
        true
      );
      expect(component.publishOnAddCloneSteps.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('OnassignedObjectsList', () => {
    it('should define function', () => {
      expect(component.OnassignedObjectsList).toBeDefined();
    });

    it('should remove assigned objcets list', () => {
      spyOn(<any>component, 'removeFirst').and.callFake(() => [
        businessObjects[0]
      ]);
      component.assignedObjectsSelected = businessObjects;
      component.OnassignedObjectsList(businessObjects[1]);
      expect(component['removeFirst']).toHaveBeenCalledWith(
        businessObjects,
        businessObjects[1]
      );
      expect(component.assignedObjectsSelected).toEqual([businessObjects[0]]);
      expect(component.updateAssignedObjects).toHaveBeenCalledWith([
        businessObjects[0]
      ]);
    });
  });

  describe('removeFirst', () => {
    it('should define function', () => {
      expect(component['removeFirst']).toBeDefined();
    });

    it('should remove value from objcet & set AssignedObjects', () => {
      mockInstructionSelector.setResult({
        ...workInstruction[0],
        AssignedObjects:
          '[{"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"AUART","FIELDDESCRIPTION":"ORDER TYPE","Value":"Test Order"}, {"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"ATNAM","FIELDDESCRIPTION":"CHARACTERISTIC NAME","Value":"Test Characteristic Name"}]'
      });
      store.refreshState();
      spyOn(component.instructionDataEntry, 'emit');
      const result = component['removeFirst'](
        [...businessObjects],
        businessObjects[0]
      );
      expect(result).toEqual([businessObjects[1]]);
      expect(component.instructionDataEntry.emit).toHaveBeenCalledWith({
        insObj: {
          ...workInstruction[0],
          AssignedObjects:
            '[{"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"AUART","FIELDDESCRIPTION":"ORDER TYPE","Value":"Test Order"}]'
        },
        update: true
      });
    });

    it('should remove value from objcet & set AssignedObjects to null', () => {
      spyOn(component.instructionDataEntry, 'emit');
      const result = component['removeFirst'](
        [businessObjects[1]],
        businessObjects[1]
      );
      expect(result).toEqual([]);
      expect(component.instructionDataEntry.emit).toHaveBeenCalledWith({
        insObj: { ...workInstruction[0], AssignedObjects: null },
        update: true
      });
    });
  });

  describe('reactiveForm', () => {
    it('should define function', () => {
      expect(component.reactiveForm).toBeDefined();
    });

    it('should define form controls and set defaults', () => {
      component.reactiveForm();
      expect(component.formControls.categories.value).toEqual([]);
      expect(component.formControls.assignedObjects.value).toEqual([]);
      expect(component.formControls.tools.value).toBe('');
      expect(component.formControls.safetyKit.value).toBe('');
      expect(component.formControls.spareParts.value).toBe('');
    });
  });

  describe('enableReactiveFormFields', () => {
    it('should define function', () => {
      expect(component.enableReactiveFormFields).toBeDefined();
    });

    it('should enable create work instruction form fields', () => {
      spyOn(component, 'enableReactiveFormFields').and.callThrough();
      component.enableReactiveFormFields();
      expect(component.enableReactiveFormFields).toHaveBeenCalled();
      expect(component.formControls.categories.enabled).toBeTrue();
      expect(component.formControls.assignedObjects.enabled).toBeTrue();
      expect(component.formControls.tools.enabled).toBeTrue();
      expect(component.formControls.safetyKit.enabled).toBeTrue();
      expect(component.formControls.spareParts.enabled).toBeTrue();
    });
  });

  describe('formControls', () => {
    it('should define variable', () => {
      expect(component.formControls).toBeDefined();
    });

    it('should has form controls', () => {
      expect(component.formControls.categories).toBeDefined();
      expect(component.formControls.assignedObjects).toBeDefined();
      expect(component.formControls.tools).toBeDefined();
      expect(component.formControls.safetyKit).toBeDefined();
      expect(component.formControls.spareParts).toBeDefined();
    });
  });

  describe('updateCategory', () => {
    it('should define function', () => {
      expect(component.updateCategory).toBeDefined();
    });

    it('should update selected/unselected categories list from existing', () => {
      spyOn(component.instructionDataEntry, 'emit');
      component.updateCategory([categoryDetails[1].Category_Name]);
      expect(component.instructionDataEntry.emit).toHaveBeenCalledWith({
        insObj: {
          ...workInstruction[0],
          Categories: JSON.stringify([categoryDetails[1].Category_Id])
        },
        update: true
      });
    });
  });

  describe('updateAssignedObjects', () => {
    it('should define function', () => {
      expect(component.updateAssignedObjects).toBeDefined();
    });

    it(`should update assignedObjectsList and call updateBusinessObject method if assignedObjectsList &
      assignedObjcetsTmp is not empty`, () => {
      spyOn(component, 'updateBusinessObject');
      (component.updateAssignedObjects as jasmine.Spy).and.callThrough();
      const Value = JSON.parse(workInstruction[0].AssignedObjects)[0].Value;
      component['updateOverviewDetailsCalled'] = false;
      component.ngOnInit();
      expect(component.updateAssignedObjects).toHaveBeenCalledWith();
      expect(component.assignedObjectsList).toEqual([
        businessObjects[0],
        { ...businessObjects[1], Value }
      ]);
      expect(component['assignedObjcetsTmp']).toEqual([]);
      expect(component.updateBusinessObject).toHaveBeenCalledWith(
        { ...businessObjects[1], Value },
        { target: { value: Value } },
        false
      );
    });

    it('should update assignedObjectsList and call removeFirst method', () => {
      mockInstructionSelector.setResult({
        ...workInstruction[0],
        AssignedObjects:
          '[{"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"AUART","FIELDDESCRIPTION":"ORDER TYPE","Value":"Test Order"},{"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"ATNAM","FIELDDESCRIPTION":"CHARACTERISTIC NAME","Value":"Test Characteristic Value"}]'
      });
      store.refreshState();
      (component.updateAssignedObjects as jasmine.Spy).and.callThrough();
      spyOn<any>(component, 'removeFirst');
      const Value = JSON.parse(workInstruction[0].AssignedObjects)[0].Value;
      component['updateOverviewDetailsCalled'] = false;
      component.ngOnInit();
      component.updateAssignedObjects([businessObjects[1]]);
      expect(component.assignedObjectsList).toEqual([
        { ...businessObjects[0], Value: '' },
        { ...businessObjects[1], Value }
      ]);
      expect(component['removeFirst']).toHaveBeenCalledWith(
        [businessObjects[1]],
        {
          ...businessObjects[0],
          Value: 'Test Characteristic Value'
        }
      );
    });
  });

  describe('updateBusinessObject', () => {
    it('should define function', () => {
      expect(component.updateBusinessObject).toBeDefined();
    });

    it('should prepare AssignedObjects details', () => {
      (component.updateAssignedObjects as jasmine.Spy).and.callThrough();
      mockInstructionSelector.setResult({
        ...workInstruction[0],
        AssignedObjects:
          '[{"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"AUART","FIELDDESCRIPTION":"ORDER TYPE","Value":"Test Order"}]'
      });
      store.refreshState();
      spyOn(component.instructionDataEntry, 'emit');
      component['updateOverviewDetailsCalled'] = false;
      component.ngOnInit();
      component.updateBusinessObject(businessObjects[0], {
        target: { value: 'Test Characteristic Value' }
      });
      expect(component.instructionDataEntry.emit).toHaveBeenCalledWith({
        insObj: {
          ...workInstruction[0],
          AssignedObjects:
            '[{"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"AUART","FIELDDESCRIPTION":"ORDER TYPE","Value":"Test Order"},{"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"ATNAM","FIELDDESCRIPTION":"CHARACTERISTIC NAME","Value":"Test Characteristic Value"}]'
        },
        update: true
      });
    });
  });

  describe('requisiteChange', () => {
    it('should define function', () => {
      expect(component.requisiteChange).toBeDefined();
    });

    it('should call updatePrequisite method', () => {
      component.requisiteChange(
        { target: { value: 'Test Tools One' } },
        'Tools'
      );
      expect(component.updatePrequisite).toHaveBeenCalledWith(
        'Test Tools One',
        'Tools',
        true
      );
    });
  });

  describe('getImageSrc', () => {
    it('should define function', () => {
      expect(component.getImageSrc).toBeDefined();
    });

    it('should call getBase64ImageData', () => {
      const src = 'image.jpg';
      component.recentWorkInstruction = workInstruction[0];
      component.getImageSrc(src);
      expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledWith(
        src,
        component.recentWorkInstruction.Id
      );
    });

    it(`should not call getBase64Image if getBase64ImageData already exists or image
    data call already happend`, () => {
      component.recentWorkInstruction = workInstruction[0];
      let src = 'image.jpg';
      (base64HelperServiceSpy.getBase64ImageData as jasmine.Spy)
        .withArgs(src, component.recentWorkInstruction.Id)
        .and.returnValue(of(src))
        .and.callThrough();
      component.getImageSrc(src);
      expect(base64HelperServiceSpy.getBase64Image).not.toHaveBeenCalled();

      component.imageDataCalls[src] = true;
      component.getImageSrc(src);
      expect(base64HelperServiceSpy.getBase64Image).not.toHaveBeenCalled();
    });
  });

  describe('preparePrerequisite', () => {
    it('should define function', () => {
      expect(component.preparePrerequisite).toBeDefined();
    });

    it('should prepare prerequisite details', () => {
      const prequisiteDetails = ['Test Tools One', 'Test Tools Two'];
      const enteredVal = 'Test Tools Three';
      const remove = false;
      const result = component.preparePrerequisite({
        prequisiteDetails,
        enteredVal,
        remove
      });
      expect(result).toEqual([...prequisiteDetails, enteredVal]);
    });

    it('should prepare prerequisite details for entered value of type Array', () => {
      const prequisiteDetails = ['Test Tools One', 'Test Tools Two'];
      const enteredVal = ['Test Tools Three', 'Test Tools Four'];
      const remove = false;
      const result = component.preparePrerequisite({
        prequisiteDetails,
        enteredVal,
        remove
      });
      expect(result).toEqual([...prequisiteDetails, ...enteredVal]);
    });

    it('should remove value from prerequisite details if remove is true', () => {
      const prequisiteDetails = ['Test Tools One', 'Test Tools Two'];
      const enteredVal = 'Test Tools Two';
      const remove = true;
      const result = component.preparePrerequisite({
        prequisiteDetails,
        enteredVal,
        remove
      });
      expect(result).toEqual(prequisiteDetails.slice(0, 1));
    });

    it('should not add to prerequisite details if enteredVal already exists in list', () => {
      const prequisiteDetails = ['Test Tools One', 'Test Tools Two'];
      const enteredVal = 'Test TOOLS two  ';
      const remove = false;
      const result = component.preparePrerequisite({
        prequisiteDetails,
        enteredVal,
        remove
      });
      expect(result).toEqual(prequisiteDetails);
    });
  });

  describe('updatePrequisite', () => {
    beforeEach(() => {
      (component.updatePrequisite as jasmine.Spy).and.callThrough();
      spyOn(component, 'preparePrerequisite').and.callThrough();
      spyOn(component.instructionDataEntry, 'emit');
    });

    it('should define function', () => {
      expect(component.updatePrequisite).toBeDefined();
    });

    it('should update prerequisite for type Tools', () => {
      const enteredVal = JSON.parse(workInstruction[0].Tools).FieldValue;
      const prerequisite = 'Tools';
      component.updatePrequisite(enteredVal, prerequisite, false, false);
      expect(component.preparePrerequisite).toHaveBeenCalledWith({
        prequisiteDetails: [],
        enteredVal,
        remove: false
      });
      expect(component.formControls.tools.value).toBe('');
      expect(component.selectedTools).toEqual(enteredVal);
      expect(component.selectedInstructionData.selectedTools).toEqual(
        enteredVal
      );
      expect(component.instructionDataEntry.emit).toHaveBeenCalledWith({
        insObj: workInstruction[0],
        update: false
      });
    });

    it('should update prerequisite with existing Tools data', () => {
      component['updateOverviewDetailsCalled'] = false;
      component.ngOnInit();
      const enteredVal = 'Test Tools Three';
      const prerequisite = 'Tools';
      const selectedTools = [
        ...JSON.parse(workInstruction[0].Tools).FieldValue
      ];
      component.updatePrequisite(enteredVal, prerequisite, true, false);
      expect(component.preparePrerequisite).toHaveBeenCalledWith({
        prequisiteDetails: [...selectedTools],
        enteredVal,
        remove: false
      });
      expect(component.formControls.tools.value).toBe('');
      expect(component.selectedTools).toEqual([...selectedTools, enteredVal]);
      expect(component.selectedInstructionData.selectedTools).toEqual([
        ...selectedTools,
        enteredVal
      ]);
      expect(component.instructionDataEntry.emit).toHaveBeenCalledWith({
        insObj: {
          ...workInstruction[0],
          Tools:
            '{"Title":"Tools","Position":0,"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","FieldValue":["Test Tools One","Test Tools Two","Test Tools Three"]}'
        },
        update: false
      });
    });

    it('should update prerequisite for type SafetyKit', () => {
      const enteredVal = JSON.parse(workInstruction[0].SafetyKit).FieldValue;
      const prerequisite = 'SafetyKit';
      component.updatePrequisite(enteredVal, prerequisite, false, false);
      expect(component.preparePrerequisite).toHaveBeenCalledWith({
        prequisiteDetails: [],
        enteredVal,
        remove: false
      });
      expect(component.formControls.safetyKit.value).toBe('');
      expect(component.selectedSafetyKits).toEqual(enteredVal);
      expect(component.selectedInstructionData.selectedSafetyKits).toEqual(
        enteredVal
      );
      expect(component.instructionDataEntry.emit).toHaveBeenCalledWith({
        insObj: workInstruction[0],
        update: false
      });
    });

    it('should update prerequisite for type SpareParts', () => {
      const enteredVal = JSON.parse(workInstruction[0].SpareParts).FieldValue;
      const prerequisite = 'SpareParts';
      component.updatePrequisite(enteredVal, prerequisite, true, false);
      expect(component.preparePrerequisite).toHaveBeenCalledWith({
        prequisiteDetails: [],
        enteredVal,
        remove: false
      });
      expect(component.formControls.spareParts.value).toBe('');
      expect(component.selectedSpareParts).toEqual(enteredVal);
      expect(component.selectedInstructionData.selectedSpareParts).toEqual(
        enteredVal
      );
      expect(component.instructionDataEntry.emit).toHaveBeenCalledWith({
        insObj: workInstruction[0],
        update: true
      });
    });
  });

  describe('getBusinessObjects', () => {
    it('should define function', () => {
      expect(component.getBusinessObjects).toBeDefined();
    });

    it('should set assignedObjectsList', () => {
      component.getBusinessObjects();
      expect(
        instructionServiceSpy.getAllBusinessObjects
      ).toHaveBeenCalledWith();
      expect(component.assignedObjectsList).toEqual(businessObjects);
      expect(component.updateAssignedObjects).toHaveBeenCalledWith();
    });
  });

  describe('assignedObjectsComparison', () => {
    it('should define function', () => {
      expect(component.assignedObjectsComparison).toBeDefined();
    });

    it('should return true/false on business objcets FILEDNAME comparision', () => {
      const result = component.assignedObjectsComparison(
        businessObjects[1],
        JSON.parse(workInstruction[0].AssignedObjects)[0]
      );
      expect(result).toBeTrue();
    });
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should set initilization data for component & call other initilization functions', () => {
      spyOn(component, 'reactiveForm');
      spyOn(component, 'getBusinessObjects');
      spyOn(component, 'enableReactiveFormFields');
      spyOn(component, 'updateOverviewDetails');
      component['updateOverviewDetailsCalled'] = false;
      component.ngOnInit();
      expect(component.reactiveForm).toHaveBeenCalledWith();
      expect(component.getBusinessObjects).toHaveBeenCalledWith();
      expect(component.recentWorkInstruction).toEqual(workInstruction[0]);
      expect(component['updateOverviewDetailsCalled']).toBeTrue();
      expect(component.categoriesList).toEqual(categoryDetails);
      expect(component.titleProvided).toBeTrue();
      expect(store.dispatch).toHaveBeenCalledWith(
        InstructionActions.updateCategories({ categories: categoryDetails })
      );
      expect(component.enableReactiveFormFields).toHaveBeenCalledWith();
      expect(component.updateOverviewDetails).toHaveBeenCalledWith(
        workInstruction[0]
      );
    });
  });

  describe('updateOverviewDetails', () => {
    it('should define function', () => {
      expect(component.updateOverviewDetails).toBeDefined();
    });

    it('should update overview details & fetch steps', () => {
      spyOn(component, 'updateOverviewDetails').and.callThrough();

      component['updateOverviewDetailsCalled'] = false;
      component.ngOnInit();

      expect(component.updateOverviewDetails).toHaveBeenCalledWith(
        workInstruction[0]
      );
      expect(instructionServiceSpy.getStepsByWID).toHaveBeenCalledWith(wid);
      expect(store.dispatch).toHaveBeenCalledWith(
        InstructionActions.updateSteps({ steps })
      );
      expect(component.assignedObjectsSelected).toEqual(
        JSON.parse(workInstruction[0].AssignedObjects)
      );
      expect(component.updateAssignedObjects).toHaveBeenCalledWith();
      expect(component.updatePrequisite).toHaveBeenCalledWith(
        JSON.parse(workInstruction[0].Tools).FieldValue,
        'Tools',
        false
      );
      expect(component.updatePrequisite).toHaveBeenCalledWith(
        JSON.parse(workInstruction[0].SpareParts).FieldValue,
        'SpareParts',
        false
      );
      expect(component.updatePrequisite).toHaveBeenCalledWith(
        JSON.parse(workInstruction[0].SafetyKit).FieldValue,
        'SafetyKit',
        false
      );
      expect(component['assignedObjcetsTmp']).toEqual(
        JSON.parse(workInstruction[0].AssignedObjects)
      );
    });

    it('should update overview details, fetch steps & step images', () => {
      const imageName = 'Thumbnail.jpg';
      (instructionServiceSpy.getStepsByWID as jasmine.Spy)
        .withArgs(wid)
        .and.returnValue(
          of([
            { ...steps[0], Attachment: JSON.stringify([imageName]) },
            steps[1]
          ])
        )
        .and.callThrough();
      (base64HelperServiceSpy.getImageContents as jasmine.Spy)
        .withArgs([imageName], `${wid}/${steps[0].StepId}`)
        .and.returnValue(of(IMAGECONTENT))
        .and.callThrough();
      spyOn(component, 'updateOverviewDetails').and.callThrough();

      component['updateOverviewDetailsCalled'] = false;
      component.ngOnInit();

      expect(component.updateOverviewDetails).toHaveBeenCalledWith(
        workInstruction[0]
      );
      expect(instructionServiceSpy.getStepsByWID).toHaveBeenCalledWith(wid);
      expect(store.dispatch).toHaveBeenCalledWith(
        InstructionActions.updateSteps({ steps })
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        InstructionActions.updateStepImages({
          stepImages: {
            stepId: steps[0].StepId,
            attachments: JSON.stringify([imageName]),
            imageContents: JSON.stringify(IMAGECONTENT)
          }
        })
      );
      expect(component.assignedObjectsSelected).toEqual(
        JSON.parse(workInstruction[0].AssignedObjects)
      );
      expect(component.updateAssignedObjects).toHaveBeenCalledWith();
      expect(component.updatePrequisite).toHaveBeenCalledWith(
        JSON.parse(workInstruction[0].Tools).FieldValue,
        'Tools',
        false
      );
      expect(component.updatePrequisite).toHaveBeenCalledWith(
        JSON.parse(workInstruction[0].SpareParts).FieldValue,
        'SpareParts',
        false
      );
      expect(component.updatePrequisite).toHaveBeenCalledWith(
        JSON.parse(workInstruction[0].SafetyKit).FieldValue,
        'SafetyKit',
        false
      );
      expect(component['assignedObjcetsTmp']).toEqual(
        JSON.parse(workInstruction[0].AssignedObjects)
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should define function', () => {
      expect(component.ngOnDestroy).toBeDefined();
    });

    it('should unsubscribe subscription', () => {
      spyOn(<any>component['currentPreviousStatusSubscription'], 'unsubscribe');
      spyOn(<any>component['instructionSubscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(
        base64HelperServiceSpy.resetBase64ImageDetails
      ).toHaveBeenCalledWith();
      expect(
        component['currentPreviousStatusSubscription'].unsubscribe
      ).toHaveBeenCalledWith();
      expect(
        component['instructionSubscription'].unsubscribe
      ).toHaveBeenCalledWith();
    });

    it('should unsubscribe imageContentsSubscription', () => {
      const imageName = 'Thumbnail.jpg';
      (instructionServiceSpy.getStepsByWID as jasmine.Spy)
        .withArgs(wid)
        .and.returnValue(
          of([
            { ...steps[0], Attachment: JSON.stringify([imageName]) },
            steps[1]
          ])
        )
        .and.callThrough();
      (base64HelperServiceSpy.getImageContents as jasmine.Spy)
        .withArgs([imageName], `${wid}/${steps[0].StepId}`)
        .and.returnValue(of(IMAGECONTENT))
        .and.callThrough();
      component['updateOverviewDetailsCalled'] = false;
      component.ngOnInit();
      spyOn(<any>component['imageContentsSubscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(
        component['imageContentsSubscription'].unsubscribe
      ).toHaveBeenCalledWith();
    });
  });
});
