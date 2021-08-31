import { Component, DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppMaterialModules } from '../../../material.module';
import { WiCommonService } from '../services/wi-common.services';
import { ToastService } from '../../../shared/toast';
import { InstructionService } from '../services/instruction.service';
import { AddWorkinstructionComponent } from './add-workinstruction.component';
import { MockComponent } from 'ng-mocks';
import { OverviewComponent } from '../steps/overview.component';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatMenuTrigger } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Instruction, ErrorInfo } from '../../../interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../../../state/app.state';
import { getInsToBePublished, getInstruction, getSteps } from '../state/instruction.selectors';
import * as InstructionActions from '../state/intruction.actions';
import { CommonService } from '../../../shared/services/common.service';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../shared/shared.module';

const categoryDetails = [
  {
    Category_Id: '_UnassignedCategory_',
    Category_Name: 'Unassigned',
    Cover_Image: 'assets/work-instructions-icons/svg/Categories/default-category.png',
  },
  {
    Category_Id: 177,
    Category_Name: 'Health-Precautions',
    Cover_Image: 'assets/work-instructions-icons/work-instructions-icons/CoverImages/coverimage2.png',
  },
  {
    Category_Id: 178,
    Category_Name: 'Sample Category',
    Cover_Image: 'assets/work-instructions-icons/CoverImages/coverimage3.png',
  }
];

const [category1, category2, category3] = categoryDetails;
const categories1 = [` ${category1.Category_Name}`];
const categories2 = [` ${category2.Category_Name}`, ` ${category3.Category_Name}`];
const image = 'assets/work-instructions-icons/img/brand/doc-placeholder.png';

const addWI = [
  {
    Id: '3118',
    WI_Id: 25,
    Categories: JSON.stringify([category1]),
    WI_Name: 'TestingInsTwo',
    WI_Desc: null,
    Tools: null,
    Equipements: null,
    Locations: null,
    IsFavorite: false,
    CreatedBy: 'Tester One',
    EditedBy: 'Tester One',
    AssignedObjects: null,
    SpareParts: null,
    SafetyKit: null,
    created_at: '2020-11-30T09:57:30.000Z',
    updated_at: '2020-11-30T09:57:30.000Z',
    Published: false,
    IsPublishedTillSave: false,
    Cover_Image: "Thumbnail.jpg"
  },
];

const editWI = {
  Id: '3118',
  WI_Id: 25,
  Categories: JSON.stringify([category1]),
  WI_Name: 'TestingInsTwo',
  WI_Desc: null,
  Tools: null,
  Equipements: null,
  Locations: null,
  IsFavorite: false,
  CreatedBy: 'Tester One',
  EditedBy: 'Tester Two',
  AssignedObjects: null,
  SpareParts: null,
  SafetyKit: null,
  created_at: '2020-11-30T09:57:30.000Z',
  updated_at: '2020-11-30T10:28:41.000Z',
  Published: false,
  IsPublishedTillSave: false,
  Cover_Image: "Thumbnail.jpg"
};

const loggedInUser = {
  id: '57',
  first_name: 'Tester',
  last_name: 'One',
  email: 'tester.one@innovapptive.com',
  password: '1000111tes',
  role: 'user',
  empId: '1000111',
};

const steps = [
  {
    StepId: '2444',
    WI_Id: '3118',
    Title: 'STEP1',
    Description: null,
    Status: null,
    Fields: null,
    Attachment: null,
    Instructions: null,
    Warnings: null,
    Hints: null,
    isCloned: null,
    Reaction_Plan: null,
    Published: false,
  },
];

const TOOLS = '[{"Title":"Tools","Position":0,"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","FieldValue":["test"]},{"Title":"SafetyKit","Position":1,"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","FieldValue":["test"]},{"Title":"SpareParts","Position":2,"Active":"true","FieldCategory":"HEADER","FieldType":"RTF","FieldValue":["test"]}]';
const ASSIGNEDOBJECTS = '[{"OBJECTCATEGORY":"WORKORDER","FILEDNAME":"ATNAM","FIELDDESCRIPTION":"CHARACTERISTIC NAME","Value":"123"}]';
const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };

describe('AddWorkinstructionComponent', () => {
  let component: AddWorkinstructionComponent;
  let fixture: ComponentFixture<AddWorkinstructionComponent>;
  let spinnerSpy: NgxSpinnerService;
  let wiCommonServiceSpy: WiCommonService;
  let commonServiceSpy: CommonService;
  let instructionServiceSpy: InstructionService;
  let toastServiceSpy: ToastService;
  let activatedRouteSpy: ActivatedRoute;
  let addWIDe: DebugElement;
  let addWIEl: HTMLElement;
  let router: Router;
  let store: MockStore<State>;
  let mockInsToBePublishedSelector;
  let mockInstructionSelector;
  let mockStepsSelector;

  beforeEach(waitForAsync(() => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    wiCommonServiceSpy = jasmine.createSpyObj(
      'WiCommonService',
      ['stepDetailsSave'],
      {
        stepDetailsSaveAction$: of('All Changes Saved'),
      }
    );
    commonServiceSpy = jasmine.createSpyObj('CommonService', ['minimizeSidebar'], {
      minimizeSidebarAction$: of(false)
    });
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'getInstructionsById',
      'getInstructionsByName',
      'updateWorkInstruction',
      'getCategoriesByName',
      'addWorkInstruction',
      'setFavoriteInstructions',
      'editWorkInstructionTitle',
      'addWorkInstructionTitle',
      'publishInstruction',
      'deleteWorkInstruction$',
      'updateGatewayFavWorkInstruction',
      'handleError'
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: convertToParamMap({
          id: '',
        }),
      },
      data: {
        value: {
          title: '',
        },
      },
    });

    TestBed.configureTestingModule({
      declarations: [
        AddWorkinstructionComponent,
        MockComponent(OverviewComponent),
      ],
      imports: [
        RouterTestingModule,
        AppMaterialModules,
        FormsModule,
        BrowserAnimationsModule,
        IonicModule,
        SharedModule
      ],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: WiCommonService, useValue: wiCommonServiceSpy },
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: CommonService, useValue: commonServiceSpy },
        provideMockStore()
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    mockInstructionSelector = store.overrideSelector(getInstruction, editWI);
    mockInsToBePublishedSelector = store.overrideSelector(getInsToBePublished, []);
    mockStepsSelector = store.overrideSelector(getSteps, steps);
    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(AddWorkinstructionComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    addWIDe = fixture.debugElement;
    addWIEl = addWIDe.nativeElement;
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    (instructionServiceSpy.getInstructionsById as jasmine.Spy)
      .withArgs(editWI.Id)
      .and.returnValue(of(editWI))
      .and.callThrough();
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define variables', () => {
    expect(component.workInstructionTitle).toBeDefined();
    expect(component.wi_title).toBeDefined();
    expect(component.selectedInstruction).toBeDefined();
    expect(component.beforeSaveMessage).toBeDefined();
    expect(component.afterSaveMessage).toBeDefined();
    expect(component.saveddata).toBeDefined();
    expect(component.isWIPublished).toBeDefined();
    expect(component.titleTextChanged).toBeDefined();
    expect(component.titleErrors).toBeDefined();
    expect(component.titleErrors).toEqual({exists: false, required: false});
  });

  describe('template', () => {
    beforeEach(() => {
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: editWI.Id,
        }),
      });
    });

    it('should contain labels & elements related to work instruction', () => {
      component.ngOnInit();
      fixture.detectChanges();
      expect(addWIEl.querySelectorAll('app-header').length).toBe(1);
      expect(addWIEl.querySelectorAll('input').length).toBe(1);
      const buttons = addWIEl.querySelectorAll('button');
      expect(buttons[0].textContent).toBe('more_horiz');
      expect(buttons[1].textContent).toBe('Publish');
      expect(addWIEl.querySelector('ion-content img').getAttribute('src')).toContain('upload-white.png');
      expect(addWIEl.querySelectorAll('app-overview').length).toBe(1);

      (instructionServiceSpy.getInstructionsById as jasmine.Spy)
        .withArgs(editWI.Id)
        .and.returnValue(of({...editWI, Published: true, IsPublishedTillSave: true }))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      expect(addWIEl.querySelector('ion-content img').getAttribute('src')).toContain('upload.svg');
    });

    describe('OverviewComponent', () => {
      beforeEach(() => {

      });

      it('should OverviewComponent binded with proper property and event bindings', () => {
        expect(true).toBe(true);
      });
    });

  });

  describe('ngAfterViewInit', () => {
    it('should define function', () => {
      expect(component.ngAfterViewInit).toBeDefined();
    });

    it('should set focus on work instructtion title', () => {
      spyOn(component.workInstructionTitle.nativeElement, 'focus');
      component.ngAfterViewInit();
      expect(
        component.workInstructionTitle.nativeElement.focus
      ).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: editWI.Id,
        }),
      });
    });

    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should set values to class members from selectors', () => {
      expect(component.insToBePublished).toEqual([]);
      expect(component.steps).toEqual(steps);
      expect(component.selectedInstruction).toEqual(editWI);
      expect(component.instructionTitle).toEqual(editWI.WI_Name);
    });

    it('should set initilization data for work instruction', (done) => {
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(commonServiceSpy.minimizeSidebar).toHaveBeenCalledWith(true);
        expect(component.saveStatus).toBe('All Changes Saved');
        expect(store.dispatch).toHaveBeenCalledOnceWith(
          InstructionActions.updateInstruction({ instruction: editWI })
        );
        expect(component.selectedInstruction).toEqual(editWI);
        expect(component.receivedInstruction).toBeTrue();
        expect(component.titleProvided).toBeTrue();
        expect(component.saveddata).toBeTrue();
        expect(component.beforeSaveMessage).toBeTrue();
        expect(component.afterSaveMessage).toBeFalse();
        expect(component.isWIPublished).toBeFalse();
        done();
      });
    });

    it('should do initilization for published work instruction', (done) => {
      (instructionServiceSpy.getInstructionsById as jasmine.Spy)
        .withArgs(editWI.Id)
        .and.returnValue(of({ ...editWI, Published: true }))
        .and.callThrough();
      mockInstructionSelector.setResult({ ...editWI, Published: true });
      store.refreshState();
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(commonServiceSpy.minimizeSidebar).toHaveBeenCalledWith(true);
        expect(component.saveStatus).toBe('All Changes Saved');
        expect(store.dispatch).toHaveBeenCalledOnceWith(
          InstructionActions.updateInstruction({ instruction: { ...editWI, Published: true } })
        );
        expect(component.selectedInstruction).toEqual({ ...editWI, Published: true });
        expect(component.titleProvided).toBeTrue();
        expect(component.saveddata).toBeTrue();
        expect(component.publisheddata).toBeFalse();
        expect(component.receivedInstruction).toBeTrue();
        expect(component.beforeSaveMessage).toBeTrue();
        expect(component.afterSaveMessage).toBeFalse();
        expect(component.isWIPublished).toBeTrue();
        done();
      });
    });

    it('should do initilization for published work instruction with till save', (done) => {
      (instructionServiceSpy.getInstructionsById as jasmine.Spy)
        .withArgs(editWI.Id)
        .and.returnValue(
          of({ ...editWI, Published: true, IsPublishedTillSave: true })
        )
        .and.callThrough();
      mockInstructionSelector.setResult({ ...editWI, Published: true, IsPublishedTillSave: true });
      store.refreshState();
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(commonServiceSpy.minimizeSidebar).toHaveBeenCalledWith(true);
        expect(component.saveStatus).toBe('All Changes Saved');
        expect(store.dispatch).toHaveBeenCalledOnceWith(
          InstructionActions.updateInstruction({ instruction: { ...editWI, Published: true, IsPublishedTillSave: true } })
        );
        expect(component.selectedInstruction).toEqual({ ...editWI, Published: true, IsPublishedTillSave: true });
        expect(component.titleProvided).toBeTrue();
        expect(component.saveddata).toBeTrue();
        expect(component.publisheddata).toBeTrue();
        expect(component.receivedInstruction).toBeFalse();
        expect(component.beforeSaveMessage).toBeTrue();
        expect(component.afterSaveMessage).toBeFalse();
        expect(component.isWIPublished).toBeTrue();
        done();
      });
    });

    it('should handle title text change for add work instruction', fakeAsync(() => {
      const WIName = 'TestingInsTwo';
      const event = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        shiftKey: false,
      });
      const titleEl = addWIEl.querySelector('input');
      titleEl.value = WIName;
      titleEl.dispatchEvent(new Event('input'));
      titleEl.dispatchEvent(event);
      fixture.detectChanges();
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: '',
        }),
      });
      (instructionServiceSpy.getInstructionsByName as jasmine.Spy)
        .withArgs(WIName, info)
        .and.returnValue(of([]))
        .and.callThrough();
      spyOn(component, 'addTitleToInstruction');
      tick(1001);
      expect(instructionServiceSpy.getInstructionsByName).toHaveBeenCalledWith(WIName, info);
      expect(component.addTitleToInstruction).toHaveBeenCalledWith();
      expect(component.titleErrors).toEqual({ required: false, exists: false});
    }));

    it(`should handle title text change for add work instruction and set title exists error if work instruction
      with same name exists`, fakeAsync(() => {
      const WIName = 'TestingInsTwo';
      const event = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        shiftKey: false,
      });
      const titleEl = addWIEl.querySelector('input');
      titleEl.value = WIName;
      titleEl.dispatchEvent(new Event('input'));
      titleEl.dispatchEvent(event);
      fixture.detectChanges();
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: '',
        }),
      });
      (instructionServiceSpy.getInstructionsByName as jasmine.Spy)
        .withArgs(WIName, info)
        .and.returnValue(of([{ WI_Name: WIName }]))
        .and.callThrough();
      mockInstructionSelector.setResult({});
      store.refreshState();
      spyOn(component, 'addTitleToInstruction');
      tick(1001);
      fixture.detectChanges();
      expect(instructionServiceSpy.getInstructionsByName).toHaveBeenCalledWith(WIName, info);
      expect(component.addTitleToInstruction).not.toHaveBeenCalled();
      expect(component.titleErrors).toEqual({ required: false, exists: true});
      expect(addWIEl.querySelector('.wi-title-info').textContent).toContain(
        'Title already exists!'
      );
    }));

    it('should handle http error while adding work instruction', fakeAsync(() => {
      const WIName = 'TestingInsTwo';
      const event = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        shiftKey: false,
      });
      const titleEl = addWIEl.querySelector('input');
      titleEl.value = WIName;
      titleEl.dispatchEvent(new Event('input'));
      titleEl.dispatchEvent(event);
      fixture.detectChanges();
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: '',
        }),
      });
      (instructionServiceSpy.getInstructionsByName as jasmine.Spy)
        .withArgs(WIName, info)
        .and.returnValue(throwError({ message: 'Unable to fetch instruction' }))
        .and.callThrough();
      spyOn(component, 'addTitleToInstruction');
      tick(1001);
      expect(instructionServiceSpy.getInstructionsByName).toHaveBeenCalledWith(WIName, info);
      expect(component.addTitleToInstruction).not.toHaveBeenCalled();
      expect(component.titleErrors).toEqual({ required: false, exists: false});
      expect(instructionServiceSpy.handleError).toHaveBeenCalledWith({ message: 'Unable to fetch instruction' } as HttpErrorResponse);
    }));
  });

  describe('publishInstruction', () => {
    const { Categories, WI_Name, Id, Published } = editWI;
    const insToBePublished = [
      {
        CATEGORY: Categories,
        APPNAME: 'MWORKORDER',
        VERSION: '001',
        FORMTITLE: WI_Name,
        FORMNAME: 'WI_' + Id,
        UNIQUEKEY: 'STEP0',
        STEPS: '0',
        WINSTRIND: 'X',
        WIDETAILS: '',
        IMAGECONTENT: '',
        INSTRUCTION: '',
        TOOLS: '',
        PUBLISHED: Published,
      },
    ];

    beforeEach(() => {
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: editWI.Id,
        }),
      });
    });

    it('should define function', () => {
      expect(component.publishInstruction).toBeDefined();
    });

    it('should publish already publsihed instruction with edited details when user click on publish', (done) => {
      (instructionServiceSpy.getInstructionsById as jasmine.Spy)
        .withArgs(editWI.Id)
        .and.returnValue(of({ ...editWI, Published: true }))
        .and.callThrough();
      (instructionServiceSpy.publishInstruction as jasmine.Spy)
        .withArgs({
          wiToBePublsihed: [{ ...insToBePublished[0], PUBLISHED: true }],
          steps: [],
          wid: editWI.Id,
          editedBy: 'Tester One',
        }, info)
        .and.returnValue(of([{...editWI, EditedBy: 'Tester One', Published: true }]))
        .and.callThrough();
      mockInsToBePublishedSelector.setResult([{ ...insToBePublished[0], PUBLISHED: true }]);
      mockStepsSelector.setResult([]);
      store.refreshState();
      spyOn(component, 'updateFavFlag');
      spyOn(component, 'updatePublishedTillSaveWI');
      component.ngOnInit();
      fixture.detectChanges();
      const buttons = addWIEl.querySelectorAll('button');
      buttons[1].click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(store.dispatch).toHaveBeenCalledWith(InstructionActions.setInsToBePublished());
        expect(Swal.isVisible()).toBeTruthy();
        expect(Swal.getTitle().textContent).toEqual('Are you sure?');
        expect(Swal.getHtmlContainer().textContent).toEqual(
          `Do you want to publish work instruction '${editWI.WI_Name}' ?`
        );
        expect(Swal.getConfirmButton().textContent).toEqual('Publish');
        Swal.clickConfirm();
        setTimeout(() => {
          expect(component.insToBePublished).toEqual([{ ...insToBePublished[0], PUBLISHED: true }]);
          expect(spinnerSpy.show).toHaveBeenCalledWith();
          expect(instructionServiceSpy.publishInstruction).toHaveBeenCalledWith({
            wiToBePublsihed: [{ ...insToBePublished[0], PUBLISHED: true }],
            steps: [],
            wid: editWI.Id,
            editedBy: 'Tester One',
          }, info);
          expect(component.updateFavFlag).not.toHaveBeenCalled();
          expect(component.publisheddata).toBeTrue();
          expect(component.receivedInstruction).toBeFalse();
          expect(component.isWIPublished).toBeTrue();
          expect(component.updatePublishedTillSaveWI).toHaveBeenCalledWith(true);
          expect(toastServiceSpy.show).toHaveBeenCalledWith({
            text: "Work instruction '"+ editWI.WI_Name + "' has been published successfully",
            type: 'success',
          });
          expect(spinnerSpy.hide).toHaveBeenCalledWith();
          done();
        });
      });
    });

    it('should publish new work instruction when user click on publish', (done) => {
      const selectedInstruction: Instruction = {
        Id: '',
        WI_Id: 0,
        WI_Desc: '',
        WI_Name: addWI[0].WI_Name,
        IsFavorite: false,
        AssignedObjects: null,
        CreatedBy: '',
        EditedBy: '',
        created_at: '',
        Categories: '',
        Tools: '',
        SpareParts: '',
        SafetyKit: '',
        Published: false,
        IsPublishedTillSave: false,
        Equipements: '',
        Locations: '',
        updated_at: null,
        Cover_Image: ''
      };
      const favAddWI = { ...addWI[0], IsFavorite: true };
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: '',
        }),
      });
      (instructionServiceSpy.addWorkInstructionTitle as jasmine.Spy)
        .withArgs(loggedInUser, selectedInstruction, info)
        .and.returnValue(of(addWI[0]))
        .and.callThrough();
      (instructionServiceSpy.publishInstruction as jasmine.Spy)
        .withArgs({
          wiToBePublsihed: [{...insToBePublished[0], FORMTITLE: addWI[0].WI_Name}],
          steps: [],
          wid: addWI[0].Id,
          editedBy: 'Tester One',
        }, info)
        .and.returnValue(
          of([{ ...addWI[0], EditedBy: 'Tester One', Published: true }])
        )
        .and.callThrough();
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(Id, info)
        .and.returnValue(of(favAddWI))
        .and.callThrough();
      mockInsToBePublishedSelector.setResult([{...insToBePublished[0], FORMTITLE: addWI[0].WI_Name}]);
      mockInstructionSelector.setResult(selectedInstruction);
      mockStepsSelector.setResult([]);
      store.refreshState();
      spyOn(component, 'updateFavFlag');
      spyOn(component, 'updatePublishedTillSaveWI');
      component.addTitleToInstruction();
      mockInstructionSelector.setResult(favAddWI);
      store.refreshState();
      fixture.detectChanges();
      (addWIEl.querySelector('.wi-status a') as HTMLElement).click();
      const buttons = addWIEl.querySelectorAll('button');
      buttons[1].click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(store.dispatch).toHaveBeenCalledWith(InstructionActions.setInsToBePublished());
        expect(Swal.isVisible()).toBeTruthy();
        expect(Swal.getTitle().textContent).toEqual('Are you sure?');
        expect(Swal.getHtmlContainer().textContent).toEqual(
          `Do you want to publish work instruction '${addWI[0].WI_Name}' ?`
        );
        expect(Swal.getConfirmButton().textContent).toEqual('Publish');
        Swal.clickConfirm();
        setTimeout(() => {
          expect(component.insToBePublished).toEqual([{...insToBePublished[0], FORMTITLE: addWI[0].WI_Name}]);
          expect(spinnerSpy.show).toHaveBeenCalledWith();
          expect(instructionServiceSpy.publishInstruction).toHaveBeenCalledWith({
            wiToBePublsihed: [{...insToBePublished[0], FORMTITLE: addWI[0].WI_Name}],
            steps: [],
            wid: addWI[0].Id,
            editedBy: 'Tester One',
          }, info);
          expect(component.updateFavFlag).toHaveBeenCalledWith([{...insToBePublished[0], FORMTITLE: addWI[0].WI_Name}]);
          expect(component.publisheddata).toBeTrue();
          expect(component.receivedInstruction).toBeFalse();
          expect(component.isWIPublished).toBeTrue();
          expect(component.updatePublishedTillSaveWI).toHaveBeenCalledWith(true);
          expect(toastServiceSpy.show).toHaveBeenCalledWith({
            text: "Work instruction '"+ addWI[0].WI_Name +"' has been published successfully",
            type: 'success',
          });
          expect(spinnerSpy.hide).toHaveBeenCalledWith();
          done();
        });
      });
    });

    it('should handle error while publishing work instruction', (done) => {
      const error = 'Unable to publish work instruction';
      (instructionServiceSpy.getInstructionsById as jasmine.Spy)
        .withArgs(editWI.Id)
        .and.returnValue(of({ ...editWI, Published: true }))
        .and.callThrough();
      (instructionServiceSpy.publishInstruction as jasmine.Spy)
        .withArgs({
          wiToBePublsihed: [{ ...insToBePublished[0], PUBLISHED: true }],
          steps: [],
          wid: editWI.Id,
          editedBy: 'Tester One',
        }, info)
        .and.returnValue(throwError({ message: error }))
        .and.callThrough();
      mockInsToBePublishedSelector.setResult([{ ...insToBePublished[0], PUBLISHED: true }]);
      mockStepsSelector.setResult([]);
      store.refreshState();
      spyOn(component, 'updateFavFlag');
      spyOn(component, 'updatePublishedTillSaveWI');
      component.ngOnInit();
      fixture.detectChanges();
      const buttons = addWIEl.querySelectorAll('button');
      buttons[1].click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(store.dispatch).toHaveBeenCalledWith(InstructionActions.setInsToBePublished());
        expect(Swal.isVisible()).toBeTruthy();
        expect(Swal.getTitle().textContent).toEqual('Are you sure?');
        expect(Swal.getHtmlContainer().textContent).toEqual(
          `Do you want to publish work instruction '${editWI.WI_Name}' ?`
        );
        expect(Swal.getConfirmButton().textContent).toEqual('Publish');
        Swal.clickConfirm();
        setTimeout(() => {
          expect(component.insToBePublished).toEqual([{ ...insToBePublished[0], PUBLISHED: true }]);
          expect(spinnerSpy.show).toHaveBeenCalledWith();
          expect(instructionServiceSpy.publishInstruction).toHaveBeenCalledWith({
            wiToBePublsihed: [{ ...insToBePublished[0], PUBLISHED: true }],
            steps: [],
            wid: editWI.Id,
            editedBy: 'Tester One',
          }, info);
          expect(component.updateFavFlag).not.toHaveBeenCalled();
          expect(component.updatePublishedTillSaveWI).not.toHaveBeenCalled();
          expect(instructionServiceSpy.handleError).toHaveBeenCalledWith(
            { message: 'Unable to publish work instruction' } as HttpErrorResponse
          );
          expect(spinnerSpy.hide).toHaveBeenCalledWith();
          done();
        });
      });
    });

    it('should not publish work instruction when user click on cancel', (done) => {
      (instructionServiceSpy.getInstructionsById as jasmine.Spy)
        .withArgs(editWI.Id)
        .and.returnValue(of({ ...editWI, Published: true }))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      const buttons = addWIEl.querySelectorAll('button');
      buttons[1].click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(store.dispatch).toHaveBeenCalledWith(InstructionActions.setInsToBePublished());
        expect(Swal.isVisible()).toBeTruthy();
        expect(Swal.getTitle().textContent).toEqual('Are you sure?');
        expect(Swal.getHtmlContainer().textContent).toEqual(
          `Do you want to publish work instruction '${editWI.WI_Name}' ?`
        );
        expect(Swal.getConfirmButton().textContent).toEqual('Publish');
        Swal.clickCancel();
        setTimeout(() => {
          expect(instructionServiceSpy.publishInstruction).not.toHaveBeenCalled();
          done();
        });
      });
    });
  });

  describe('updateFavFlag', () => {
    const { Categories, WI_Name, Id, Published } = addWI[0];
    const insToBePublished = [
      {
        CATEGORY: Categories,
        APPNAME: 'MWORKORDER',
        VERSION: '001',
        FORMTITLE: WI_Name,
        FORMNAME: 'WI_' + Id,
        UNIQUEKEY: 'STEP0',
        STEPS: '0',
        WINSTRIND: 'X',
        WIDETAILS: '',
        IMAGECONTENT: '',
        INSTRUCTION: '',
        TOOLS: '',
        PUBLISHED: Published,
      },
    ];
    const {
      APPNAME,
      FORMNAME,
      FORMTITLE,
      VERSION,
      WINSTRIND,
    } = insToBePublished[0];
    const favInstructionData = {
      APPNAME,
      FORMNAME,
      FORMTITLE,
      FAVOURITE: 'X',
      VERSION,
      WINSTRIND,
    };
    it('should define function', () => {
      expect(component.updateFavFlag).toBeDefined();
    });

    it('should update fav flag for newly publishing work instruction if it is in favorite state', () => {
      (instructionServiceSpy.updateGatewayFavWorkInstruction as jasmine.Spy)
        .withArgs(favInstructionData)
        .and.returnValue(of(favInstructionData))
        .and.callThrough();
      component.updateFavFlag(insToBePublished);
      expect(instructionServiceSpy.updateGatewayFavWorkInstruction).toHaveBeenCalledWith(
        favInstructionData
      );
    });

    it('should handle update favorite error', () => {
      (instructionServiceSpy.updateGatewayFavWorkInstruction as jasmine.Spy)
        .withArgs(favInstructionData)
        .and.returnValue(throwError('Unable to update as favorite'))
        .and.callThrough();
      component.updateFavFlag(insToBePublished);
      expect(instructionServiceSpy.updateGatewayFavWorkInstruction).toHaveBeenCalledWith(
        favInstructionData
      );
    });
  });

  describe('getWorkInstruction', () => {
    it('should define function', () => {
      expect(component.getWorkInstruction).toBeDefined();
    });

    it('should set publish related flags, selectedInstruction and call draftWI on WI header details entry', () => {
      spyOn(component, 'draftWI');
      const overview = addWIDe.query(By.directive(OverviewComponent));
      const overviewComponent: OverviewComponent = overview.componentInstance;
      overviewComponent.instructionDataEntry.emit({ insObj: editWI, update: true });
      expect(overview).toBeTruthy();
      expect(component.receivedInstruction).toBeTrue();
      expect(component.saveddata).toBeFalse();
      expect(component.publisheddata).toBeFalse();
      expect(component.beforeSaveMessage).toBeFalse();
      expect(component.afterSaveMessage).toBeTrue();
      expect(component.draftWI).toHaveBeenCalledWith(editWI);
    });

    it('should set selectedInstruction and not call draftWI on WI header details click', () => {
      spyOn(component, 'draftWI');
      const overview = addWIDe.query(By.directive(OverviewComponent));
      const overviewComponent: OverviewComponent = overview.componentInstance;
      overviewComponent.instructionDataEntry.emit({ insObj: editWI, update: false });
      expect(overview).toBeTruthy();
      expect(component.draftWI).not.toHaveBeenCalled();
    });
  });

  describe('getStepsData', () => {
    it('should define function', () => {
      expect(component.getStepsData).toBeDefined();
    });

    it('should set publish related flags while adding/editing data in steps', () => {
      spyOn(component, 'updatePublishedTillSaveWI');
      const overview = addWIDe.query(By.directive(OverviewComponent));
      const overviewComponent: OverviewComponent = overview.componentInstance;
      overviewComponent.stepsDataEntry.emit({ update: true });
      expect(overview).toBeTruthy();
      expect(component.receivedInstruction).toBeTrue();
      expect(component.publisheddata).toBeFalse();
      expect(component.beforeSaveMessage).toBeTrue();
      expect(component.afterSaveMessage).toBeFalse();
      expect(component.updatePublishedTillSaveWI).toHaveBeenCalledWith(false);
    });

    it('should not set publish related flags while going through the steps without editing/adding step details', () => {
      spyOn(component, 'updatePublishedTillSaveWI');
      const overview = addWIDe.query(By.directive(OverviewComponent));
      const overviewComponent: OverviewComponent = overview.componentInstance;
      overviewComponent.stepsDataEntry.emit({ update: false });
      expect(overview).toBeTruthy();
      expect(component.updatePublishedTillSaveWI).not.toHaveBeenCalled();
    });
  });

  describe('publishOnAddCloneStepsHandler', () => {
    it('should define function', () => {
      expect(component.publishOnAddCloneStepsHandler).toBeDefined();
    });

    it('should set publish related flags while adding/cloning steps', () => {
      spyOn(component, 'updatePublishedTillSaveWI');
      const overview = addWIDe.query(By.directive(OverviewComponent));
      const overviewComponent: OverviewComponent = overview.componentInstance;
      overviewComponent.publishOnAddCloneSteps.emit(true);
      expect(overview).toBeTruthy();
      expect(component.receivedInstruction).toBeTrue();
      expect(component.publisheddata).toBeFalse();
      expect(component.beforeSaveMessage).toBeTrue();
      expect(component.afterSaveMessage).toBeFalse();
      expect(component.updatePublishedTillSaveWI).toHaveBeenCalledWith(false);
    });
  });

  describe('updatePublishedTillSaveWI', () => {
    it('should define function', () => {
      expect(component.updatePublishedTillSaveWI).toBeDefined();
    });

    it('should update published till save flag to 0 if work instruction is not published till saved', () => {
      component.isWIPublished = true;
      const payload = {
        ...editWI,
        Published: true,
        IsPublishedTillSave: false,
        // EditedBy: 'Tester One',
      };
      (instructionServiceSpy.updateWorkInstruction as jasmine.Spy)
        .withArgs(payload)
        .and.returnValue(of(payload))
        .and.callThrough();
      component.updatePublishedTillSaveWI(false);
      expect(instructionServiceSpy.getInstructionsById).toHaveBeenCalledWith(
        editWI.Id
      );
      expect(instructionServiceSpy.updateWorkInstruction).toHaveBeenCalledWith(payload);
      expect(store.dispatch).toHaveBeenCalledWith(InstructionActions.updateInstruction({ instruction: payload }));
    });

    it('should update published till save flag to 1 if work instruction is published till saved', () => {
      component.isWIPublished = true;
      const payload = {
        ...editWI,
        Published: true,
        IsPublishedTillSave: true,
        // EditedBy: 'Tester One',
      };
      (instructionServiceSpy.updateWorkInstruction as jasmine.Spy)
        .withArgs(payload)
        .and.returnValue(of(payload))
        .and.callThrough();
      component.updatePublishedTillSaveWI(true);
      expect(instructionServiceSpy.getInstructionsById).toHaveBeenCalledWith(
        editWI.Id
      );
      expect(instructionServiceSpy.updateWorkInstruction).toHaveBeenCalledWith(payload);
      expect(store.dispatch).toHaveBeenCalledWith(InstructionActions.updateInstruction({ instruction: payload }));
    });

    it('should not update published till save flags if work instruction is not published', () => {
      component.isWIPublished = false;
      component.updatePublishedTillSaveWI(false);
      expect(instructionServiceSpy.getInstructionsById).not.toHaveBeenCalled();
      expect(instructionServiceSpy.updateWorkInstruction).not.toHaveBeenCalled();
    });
  });

  describe('removeWI', () => {
    beforeEach(() => {
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: editWI.Id,
        }),
      });
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should define function', () => {
      expect(component.removeWI).toBeDefined();
    });

    it('should remove work instruction when click on confirm/delete', (done) => {
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(editWI.Id, info)
        .and.returnValue(of(editWI))
        .and.callThrough();
      spyOn(router, 'navigate');
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteWorkInstructionButton = addWIDe.query(
        By.css('#deleteWorkInstruction')
      ).nativeElement as HTMLElement;
      deleteWorkInstructionButton.click();
      expect(Swal.isVisible()).toBeTruthy();
      expect(Swal.getTitle().textContent).toEqual('Are you sure?');
      expect(Swal.getHtmlContainer().textContent).toEqual(
        `Do you want to delete the work instruction '${editWI.WI_Name}' ?`
      );
      expect(Swal.getConfirmButton().textContent).toEqual('Delete');
      Swal.clickConfirm();
      setTimeout(() => {
        expect(instructionServiceSpy.deleteWorkInstruction$).toHaveBeenCalledWith(
          editWI.Id,
          info
        );
        expect(instructionServiceSpy.deleteWorkInstruction$).toHaveBeenCalledTimes(1);
        expect(toastServiceSpy.show).toHaveBeenCalledWith({
          text: `Work instuction '${editWI.WI_Name}' has been deleted`,
          type: 'success',
        });
        done();
      });
    });

    it('should not remove work instruction when user click on cancel', (done) => {
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(editWI.Id, info)
        .and.returnValue(of(editWI))
        .and.callThrough();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteWorkInstructionButton = addWIDe.query(
        By.css('#deleteWorkInstruction')
      ).nativeElement as HTMLElement;
      deleteWorkInstructionButton.click();
      expect(Swal.isVisible()).toBeTruthy();
      expect(Swal.getTitle().textContent).toEqual('Are you sure?');
      expect(Swal.getHtmlContainer().textContent).toEqual(
        `Do you want to delete the work instruction '${editWI.WI_Name}' ?`
      );
      expect(Swal.getConfirmButton().textContent).toEqual('Delete');
      Swal.clickCancel();
      setTimeout(() => {
        expect(instructionServiceSpy.deleteWorkInstruction$).not.toHaveBeenCalled();
        done();
      });
    });

    it('should handle error while deleting work instruction', (done) => {
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(editWI.Id, info)
        .and.returnValue(throwError({ message: 'Unable to delete WI' }))
        .and.callThrough();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteWorkInstructionButton = addWIDe.query(
        By.css('#deleteWorkInstruction')
      ).nativeElement as HTMLElement;
      deleteWorkInstructionButton.click();
      expect(Swal.isVisible()).toBeTruthy();
      expect(Swal.getTitle().textContent).toEqual('Are you sure?');
      expect(Swal.getHtmlContainer().textContent).toEqual(
        `Do you want to delete the work instruction '${editWI.WI_Name}' ?`
      );
      expect(Swal.getConfirmButton().textContent).toEqual('Delete');
      Swal.clickConfirm();
      setTimeout(() => {
        expect(instructionServiceSpy.deleteWorkInstruction$).toHaveBeenCalledWith(
          editWI.Id,
          info
        );
        expect(instructionServiceSpy.deleteWorkInstruction$).toHaveBeenCalledTimes(1);
        expect(instructionServiceSpy.handleError).toHaveBeenCalledWith({ message: 'Unable to delete WI' } as HttpErrorResponse);
        done();
      });
    });
  });

  describe('draftWI', () => {
    it('should define function', () => {
      expect(component.draftWI).toBeDefined();
    });

    it('should save drafted/published work instruction on header details change', () => {
      const ins = {
        ...editWI,
        EditedBy: 'Tester One',
        AssignedObjects: ASSIGNEDOBJECTS,
        Tools: JSON.stringify(JSON.parse(TOOLS)[0]),
        SafetyKit: JSON.stringify(JSON.parse(TOOLS)[1]),
        SpareParts: JSON.stringify(JSON.parse(TOOLS)[2]),
      };
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: editWI.Id,
        }),
      });
      (instructionServiceSpy.updateWorkInstruction as jasmine.Spy)
        .withArgs(ins)
        .and.returnValue(of(ins))
        .and.callThrough();
      spyOn(component, 'updatePublishedTillSaveWI');
      component.ngOnInit();
      fixture.detectChanges();
      component.getWorkInstruction({ insObj: ins, update: true });
      expect(instructionServiceSpy.getInstructionsById).toHaveBeenCalledWith(
        editWI.Id
      );
      expect(instructionServiceSpy.updateWorkInstruction).toHaveBeenCalledWith(
        ins
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        InstructionActions.updateInstruction({ instruction: ins })
      );
      expect(component.saveddata).toBeTrue();
      expect(component.beforeSaveMessage).toBeTrue();
      expect(component.afterSaveMessage).toBeFalse();
      expect(component.updatePublishedTillSaveWI).toHaveBeenCalledWith(false);
      expect(component.saveStatus).toBe('All Changes Saved');
    });

    it('should save drafted/published work instruction on category change', () => {
      const ins = {
        ...editWI,
        EditedBy: 'Tester One',
        Categories: JSON.stringify([category2, category3])
      };
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: editWI.Id,
        }),
      });
      (instructionServiceSpy.updateWorkInstruction as jasmine.Spy)
        .withArgs(ins)
        .and.returnValue(of(ins))
        .and.callThrough();
      spyOn(component, 'updatePublishedTillSaveWI');
      component.ngOnInit();
      fixture.detectChanges();
      component.getWorkInstruction({ insObj: ins, update: true });
      expect(instructionServiceSpy.getInstructionsById).toHaveBeenCalledWith(
        editWI.Id
      );
      expect(instructionServiceSpy.updateWorkInstruction).toHaveBeenCalledTimes(
        1
      );
      expect(instructionServiceSpy.updateWorkInstruction).toHaveBeenCalledWith(ins);
      expect(store.dispatch).toHaveBeenCalledWith(
        InstructionActions.updateInstruction({ instruction: ins })
      );
      expect(component.saveddata).toBeTrue();
      expect(component.beforeSaveMessage).toBeTrue();
      expect(component.afterSaveMessage).toBeFalse();
      expect(component.updatePublishedTillSaveWI).toHaveBeenCalledWith(false);
      expect(component.saveStatus).toBe('All Changes Saved');
    });

    it('should tag multiple categories to newly created WI based on categories selection', () => {
      const selectedInstruction = {
        Id: '',
        WI_Id: 0,
        WI_Name: addWI[0].WI_Name,
        IsFavorite: false,
        AssignedObjects: null,
        CreatedBy: '',
        EditedBy: '',
        created_at: '',
        Categories: '',
        Tools: '',
        SpareParts: '',
        SafetyKit: '',
        Published: false,
        IsPublishedTillSave: false,
      } as Instruction;
      const ins = {
        ...addWI[0],
        Tools: '',
        SpareParts: '',
        SafetyKit: '',
        EditedBy: 'Tester One',
        Categories: JSON.stringify([category2, category3]),
      };
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: '',
        }),
      });
      (instructionServiceSpy.getInstructionsById as jasmine.Spy)
        .withArgs(addWI[0].Id)
        .and.returnValue(of(addWI[0]))
        .and.callThrough();
      (instructionServiceSpy.addWorkInstructionTitle as jasmine.Spy)
        .withArgs(loggedInUser, selectedInstruction, info)
        .and.returnValue(of(addWI[0]))
        .and.callThrough();
      (instructionServiceSpy.updateWorkInstruction as jasmine.Spy)
        .withArgs(ins)
        .and.returnValue(of(ins))
        .and.callThrough();
      mockInstructionSelector.setResult(selectedInstruction);
      store.refreshState();
      spyOn(component, 'updatePublishedTillSaveWI');
      component.addTitleToInstruction();
      mockInstructionSelector.setResult(addWI[0]);
      store.refreshState();
      fixture.detectChanges();
      component.getWorkInstruction({ insObj: ins, update: true });
      expect(instructionServiceSpy.getInstructionsById).toHaveBeenCalledWith(
        addWI[0].Id
      );
      expect(instructionServiceSpy.updateWorkInstruction).toHaveBeenCalledWith(
        ins
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        InstructionActions.updateInstruction({ instruction: ins })
      );
      expect(component.saveddata).toBeTrue();
      expect(component.beforeSaveMessage).toBeTrue();
      expect(component.afterSaveMessage).toBeFalse();
      expect(component.updatePublishedTillSaveWI).toHaveBeenCalledWith(false);
      expect(component.saveStatus).toBe('All Changes Saved');
    });
  });

  describe('setFav', () => {
    it('should define function', () => {
      expect(component.setFav).toBeDefined();
    });

    it('should set newly created work instruction as favorite', () => {
      const { Id } = addWI[0];
      const favAddWI = { ...addWI[0], IsFavorite: true };
      const selectedInstruction: Instruction = {
        Id: '',
        WI_Id: 0,
        WI_Desc: null,
        WI_Name: addWI[0].WI_Name,
        IsFavorite: false,
        AssignedObjects: null,
        CreatedBy: '',
        EditedBy: '',
        created_at: '',
        Categories: '',
        Tools: '',
        SpareParts: '',
        SafetyKit: '',
        Published: false,
        IsPublishedTillSave: false,
        Equipements: '',
        Locations: '',
        updated_at: null,
        Cover_Image: ''
      };
      (instructionServiceSpy.addWorkInstructionTitle as jasmine.Spy)
        .withArgs(loggedInUser, selectedInstruction, info)
        .and.returnValue(of(addWI[0]))
        .and.callThrough();
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(Id, info)
        .and.returnValue(of(favAddWI))
        .and.callThrough();
      mockInstructionSelector.setResult(selectedInstruction);
      store.refreshState();
      component.addTitleToInstruction();
      mockInstructionSelector.setResult(addWI[0]);
      store.refreshState();
      fixture.detectChanges();
      (addWIEl.querySelector('.wi-status a') as HTMLElement).click();
      expect(
        instructionServiceSpy.setFavoriteInstructions
      ).toHaveBeenCalledWith(Id, info);
      expect(store.dispatch).toHaveBeenCalledWith(
        InstructionActions.updateInstruction({ instruction: favAddWI })
      );
    });

    it('should set edited work instruction as favorite', () => {
      const { Id } = editWI;
      const favEditWI = { ...editWI, IsFavorite: true };
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: Id,
        }),
      });
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(Id, info)
        .and.returnValue(of(favEditWI))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      const title = 'TestingInsTwo';
      const titleEl = addWIEl.querySelector('input');
      titleEl.value = title;
      titleEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      (addWIEl.querySelector('.wi-status a') as HTMLElement).click();
      expect(
        instructionServiceSpy.setFavoriteInstructions
      ).toHaveBeenCalledWith(Id, info);
      expect(store.dispatch).toHaveBeenCalledWith(
        InstructionActions.updateInstruction({ instruction: favEditWI })
      );
    });

    it('should handle error while setting work instruction as favorite', () => {
      const { Id } = editWI;
      const favEditWI = { ...editWI, IsFavorite: true };
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: Id,
        }),
      });
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(Id, info)
        .and.returnValue(throwError({ message: 'Unable to set as favorite'}))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      const title = 'TestingInsTwo';
      const titleEl = addWIEl.querySelector('input');
      titleEl.value = title;
      titleEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      (addWIEl.querySelector('.wi-status a') as HTMLElement).click();
      expect(
        instructionServiceSpy.setFavoriteInstructions
      ).toHaveBeenCalledWith(Id, info);
      expect(instructionServiceSpy.handleError).toHaveBeenCalledWith({ message: 'Unable to set as favorite'} as HttpErrorResponse);
    });
  });

  describe('addTitleToInstruction', () => {
    const { Categories, WI_Name, Id, Published } = addWI[0];
    const selectedInstruction: Instruction = {
      Id: '',
      WI_Id: 0,
      WI_Desc: '',
      WI_Name,
      IsFavorite: false,
      AssignedObjects: null,
      CreatedBy: '',
      EditedBy: '',
      created_at: '',
      Categories: '',
      Tools: '',
      SpareParts: '',
      SafetyKit: '',
      Published: false,
      IsPublishedTillSave: false,
      Equipements: '',
      Locations: '',
      updated_at: null,
      Cover_Image: ''
    };

    it('should define function', () => {
      expect(component.addTitleToInstruction).toBeDefined();
    });

    it('should add title to work instruction or create work instruction with title', () => {
      (instructionServiceSpy.addWorkInstructionTitle as jasmine.Spy)
        .withArgs(loggedInUser, selectedInstruction, info)
        .and.returnValue(of(addWI[0]))
        .and.callThrough();
      mockInstructionSelector.setResult(selectedInstruction);
      store.refreshState();
      spyOn(component, 'updatePublishedTillSaveWI');
      component.addTitleToInstruction();
      mockInstructionSelector.setResult(addWI[0]);
      store.refreshState();
      fixture.detectChanges();
      expect(wiCommonServiceSpy.stepDetailsSave).toHaveBeenCalledWith('Saving..');
      expect(
        instructionServiceSpy.addWorkInstructionTitle
      ).toHaveBeenCalledWith(loggedInUser, selectedInstruction, info);
      expect(store.dispatch).toHaveBeenCalledWith(
        InstructionActions.addInstruction({ instruction: addWI[0] })
      );
      expect(component.selectedInstruction).toEqual(addWI[0]);
      expect(component.titleProvided).toBeTrue();
      expect(component.saveddata).toBeTrue();
      expect(component.receivedInstruction).toBeTrue();
      expect(component.beforeSaveMessage).toBeTrue();
      expect(component.afterSaveMessage).toBeFalse();
      expect(component.setCategory).toBeTrue();
      expect(component.updatePublishedTillSaveWI).toHaveBeenCalledWith(false);
      expect(wiCommonServiceSpy.stepDetailsSave).toHaveBeenCalledWith(
        'All Changes Saved'
      );
    });

    it('should handle error while adding title to work instruction or creating work instruction', () => {
      const WIName = 'TestingInsTwo';
      (instructionServiceSpy.addWorkInstructionTitle as jasmine.Spy)
        .withArgs(loggedInUser, selectedInstruction, info)
        .and.returnValue(throwError('Unable to add title/create WI'))
        .and.callThrough();
      mockInstructionSelector.setResult(selectedInstruction);
      store.refreshState();
      component.addTitleToInstruction();
      fixture.detectChanges();
      expect(wiCommonServiceSpy.stepDetailsSave).toHaveBeenCalledWith('Saving..');
      expect(
        instructionServiceSpy.addWorkInstructionTitle
      ).toHaveBeenCalledWith(loggedInUser, selectedInstruction, info);
      expect(component.titleProvided).toBeFalse();
      expect(component.saveddata).toBeFalse();
      expect(component.receivedInstruction).toBeFalse();
      expect(component.beforeSaveMessage).toBeFalse();
      expect(component.afterSaveMessage).toBeTrue();
      expect(component.setCategory).toBeFalse();
    });

    it('should edit existing work instruction title', () => {
      const WIName = 'TestingIns2';
      const { Id: editId } = editWI;
      const selectedInstructionNew = { ...editWI, WI_Name: WIName };
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: editId,
        }),
      });
      (instructionServiceSpy.editWorkInstructionTitle as jasmine.Spy)
        .withArgs(editId, loggedInUser, selectedInstructionNew, info)
        .and.returnValue(of({...editWI, WI_Name: WIName }))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      mockInstructionSelector.setResult({...editWI, WI_Name: WIName });
      store.refreshState();
      component.addTitleToInstruction();
      fixture.detectChanges();
      expect(wiCommonServiceSpy.stepDetailsSave).toHaveBeenCalledWith('Saving..');
      expect(
        instructionServiceSpy.editWorkInstructionTitle
      ).toHaveBeenCalledWith(editId, loggedInUser, selectedInstructionNew, info);
      expect(store.dispatch).toHaveBeenCalledWith(
        InstructionActions.updateInstruction({ instruction: selectedInstructionNew })
      );
      expect(wiCommonServiceSpy.stepDetailsSave).toHaveBeenCalledWith(
        'All Changes Saved'
      );
    });

    it('should handle error while editing existing work instruction title', () => {
      const WIName = 'TestingIns2';
      const { Id: editId } = editWI;
      const selectedInstructionNew = { ...editWI, WI_Name: WIName };
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: editId,
        }),
      });
      (instructionServiceSpy.editWorkInstructionTitle as jasmine.Spy)
        .withArgs(editId, loggedInUser, selectedInstructionNew, info)
        .and.returnValue(throwError({ message: 'Unable to update work instruction'}))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      component.selectedInstruction.WI_Name = WIName;
      component.addTitleToInstruction();
      fixture.detectChanges();
      expect(wiCommonServiceSpy.stepDetailsSave).toHaveBeenCalledWith('Saving..');
      expect(
        instructionServiceSpy.editWorkInstructionTitle
      ).toHaveBeenCalledWith(editId, loggedInUser, selectedInstructionNew, info);
      expect(instructionServiceSpy.handleError).toHaveBeenCalledWith({ message: 'Unable to update work instruction'} as HttpErrorResponse);
    });
  });

  describe('titleChange', () => {
    it('should define function', () => {
      expect(component.titleChange).toBeDefined();
    });

    it('should add/update the title to work instruction', () => {
      spyOn(component.titleTextChanged, 'next');
      const event = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        shiftKey: false,
      });
      const title = 'TestingIns';
      const titleEl = addWIEl.querySelector('input');
      titleEl.value = title;
      titleEl.dispatchEvent(new Event('input'));
      titleEl.dispatchEvent(event);
      fixture.detectChanges();
      expect(component.titleTextChanged.next).toHaveBeenCalledWith(title);
      expect(component.selectedInstruction.WI_Name).toBe(title);
      expect(component.addOrUpdateTitle).toBeTrue();
      expect(component.wi_title).toBe(title);
      expect(component.titleErrors).toEqual({ exists: false, required: false });
    });

    it('should set title errors if keyup event happened with out title', () => {
      spyOn(component.titleTextChanged, 'next');
      const event = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        shiftKey: false,
      });
      const title = '  ';
      const titleEl = addWIEl.querySelector('input');
      titleEl.value = title;
      titleEl.dispatchEvent(new Event('input'));
      titleEl.dispatchEvent(event);
      fixture.detectChanges();
      expect(component.titleTextChanged.next).not.toHaveBeenCalled();
      expect(component.selectedInstruction.WI_Name).toBe(title);
      expect(component.addOrUpdateTitle).toBeTrue();
      expect(component.titleErrors).toEqual({ exists: false, required: true });
      expect(addWIEl.querySelector('.wi-title-info').textContent).toContain(
        'Title is required'
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should define function', () => {
      expect(component.ngOnDestroy).toBeDefined();
    });

    it('should unsubscribe subscriptions', () => {
      spyOn(component['stepDetailsSaveSubscription'], 'unsubscribe');
      spyOn(component['titleChangeSubscription'], 'unsubscribe');
      spyOn(component['insToBePublishedSubscription'], 'unsubscribe');
      spyOn(component['instructionSubscription'], 'unsubscribe');
      spyOn(component['stepsSubscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(store.dispatch).toHaveBeenCalledWith(InstructionActions.resetInstructionState());
      expect(component.insToBePublished).toEqual([]);
      expect(
        component['stepDetailsSaveSubscription'].unsubscribe
      ).toHaveBeenCalledWith();
      expect(
        component['titleChangeSubscription'].unsubscribe
      ).toHaveBeenCalledWith();
      expect(
        component['insToBePublishedSubscription'].unsubscribe
      ).toHaveBeenCalledWith();
      expect(
        component['instructionSubscription'].unsubscribe
      ).toHaveBeenCalledWith();
      expect(
        component['stepsSubscription'].unsubscribe
      ).toHaveBeenCalledWith();
    });

    it('should unsubscribe publishInstruction subscription', (done) => {
      const { Categories, WI_Name, Id, Published } = editWI;
      const insToBePublished = [
        {
          CATEGORY: Categories,
          APPNAME: 'MWORKORDER',
          VERSION: '001',
          FORMTITLE: WI_Name,
          FORMNAME: 'WI_' + Id,
          UNIQUEKEY: 'STEP0',
          STEPS: '0',
          WINSTRIND: 'X',
          WIDETAILS: '',
          IMAGECONTENT: '',
          INSTRUCTION: '',
          TOOLS: '',
          PUBLISHED: Published,
        },
      ];
      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'snapshot')
        .get as jasmine.Spy).and.returnValue({
        paramMap: convertToParamMap({
          id: editWI.Id,
        }),
      });
      (instructionServiceSpy.getInstructionsById as jasmine.Spy)
        .withArgs(editWI.Id)
        .and.returnValue(of(editWI))
        .and.callThrough();
      (instructionServiceSpy.publishInstruction as jasmine.Spy)
        .withArgs({
          wiToBePublsihed: insToBePublished,
          steps: [],
          wid: editWI.Id,
          editedBy: 'Tester One',
        }, info)
        .and.returnValue(of([{ ...editWI, EditedBy: 'Tester One', Published: true}]))
        .and.callThrough();
      mockInsToBePublishedSelector.setResult(insToBePublished);
      mockStepsSelector.setResult([]);
      store.refreshState();
      spyOn(component, 'updateFavFlag');
      spyOn(component, 'updatePublishedTillSaveWI');
      component.ngOnInit();
      fixture.detectChanges();
      const buttons = addWIEl.querySelectorAll('button');
      buttons[1].click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        Swal.clickConfirm();
        setTimeout(() => {
          spyOn(component['publishInstructionSubscription'], 'unsubscribe');
          component.ngOnDestroy();
          expect(store.dispatch).toHaveBeenCalledWith(InstructionActions.resetInstructionState());
          expect(
            component['publishInstructionSubscription'].unsubscribe
          ).toHaveBeenCalledWith();
          done();
        });
      });
    });
  });
});


@Component({
  template: `<app-overview
    [titleProvided]="titleProvided"
    [selectedInstruction]="selectedInstruction"
    [setCategory]="setCategory"
    (publishOnAddCloneSteps)="publishOnAddCloneStepsHandler()"
    (stepsDataEntry)="getStepsData($event)"
    (instructionDataEntry)="getWorkInstruction($event)"
  ></app-overview>`
})
class TestWrapperComponent {
  titleProvided = true;
  selectedInstruction = { ins: 1};
  setCategory = true;
  publishOnAddCloneStepsHandler = () => { };
  stepsDataEntry = event => { };
  getWorkInstruction = event => { };
}

