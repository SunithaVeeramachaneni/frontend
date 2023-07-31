import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { FormHeaderConfigurationComponent } from './form-header-configuration.component';
import { RaceDynamicFormService } from '../services/rdf.service';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state/app.state';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from '../../login/services/login.service';
import { formConfigurationStatus } from 'src/app/app.constants';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { ToastService } from 'src/app/shared/toast';
import { OperatorRoundsService } from '../../operator-rounds/services/operator-rounds.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Router } from '@angular/router';

// Import necessary testing modules and classes

fdescribe('FormHeaderConfigurationComponent', () => {
  let component: FormHeaderConfigurationComponent;
  let fixture: ComponentFixture<FormHeaderConfigurationComponent>;
  let store: Store<State>;
  let rdfService: RaceDynamicFormService;
  let cdrf: ChangeDetectorRef;
  let mockPlantService: jasmine.SpyObj<PlantService>;

  beforeEach(async(() => {
    mockPlantService = jasmine.createSpyObj('PlantService', [
      'fetchAllPlants$'
    ]);
    TestBed.configureTestingModule({
      declarations: [FormHeaderConfigurationComponent],
      imports: [
        ReactiveFormsModule
        // Add other relevant imports here
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: FormBuilder, useClass: FormBuilder },
        { provide: LoginService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: RaceDynamicFormService, useValue: {} },
        { provide: ChangeDetectorRef, useValue: {} },
        { provide: PlantService, useValue: mockPlantService },
        { provide: ToastService, useValue: {} },
        { provide: OperatorRoundsService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: NgxImageCompressService, useValue: {} },
        { provide: Router, useValue: {} }
        // Add other relevant providers here
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormHeaderConfigurationComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    rdfService = TestBed.inject(RaceDynamicFormService);
    cdrf = TestBed.inject(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component and fetch tags from the RDF service', () => {
    const mockTagsData = [{ values: ['tag1', 'tag2', 'tag3'] }];

    spyOn(rdfService, 'getDataSetsByType$').and.returnValue(of(mockTagsData));
    spyOn(component.tagsCtrl, 'setValue').and.callThrough();
    spyOn(cdrf, 'detectChanges').and.callThrough();

    // Expect the rdfService.getDataSetsByType$ to be called
    expect(rdfService.getDataSetsByType$).toHaveBeenCalledWith('tags');

    // Expect the allTags and originalTags to be set with the fetched tags
    expect(component.allTags).toEqual(mockTagsData[0].values);
    expect(component.originalTags).toEqual(mockTagsData[0].values);

    // Expect the tagsCtrl to be set to an empty string
    expect(component.tagsCtrl.setValue).toHaveBeenCalledWith('');

    // Expect the cdrf.detectChanges to be called
    expect(cdrf.detectChanges).toHaveBeenCalled();

    // Expect the filteredTags to be set correctly
    component.filteredTags.subscribe((tags) => {
      expect(tags).toEqual(component.allTags.slice());
    });
  });

  it('should initialize the headerDataForm with expected controls and validators', () => {
    const formValue = {
      name: '',
      description: '',
      isPublic: false,
      isArchived: false,
      formStatus: formConfigurationStatus.draft,
      formType: formConfigurationStatus.standalone,
      tags: component.tags,
      plantId: '',
      additionalDetails: [],
      instructions: {
        notes: '',
        attachments: '',
        pdfDocs: ''
      }
    };

    expect(component.headerDataForm.value).toEqual(formValue);

    // Check the existence and validity of form controls
    expect(component.headerDataForm.get('name')).toBeTruthy();
    expect(component.headerDataForm.get('description')).toBeTruthy();
    expect(component.headerDataForm.get('isPublic')).toBeTruthy();
    expect(component.headerDataForm.get('isArchived')).toBeTruthy();
    expect(component.headerDataForm.get('formStatus')).toBeTruthy();
    expect(component.headerDataForm.get('formType')).toBeTruthy();
    expect(component.headerDataForm.get('tags')).toBeTruthy();
    expect(component.headerDataForm.get('plantId')).toBeTruthy();
    expect(component.headerDataForm.get('additionalDetails')).toBeTruthy();
    expect(component.headerDataForm.get('instructions.notes')).toBeTruthy();
    expect(
      component.headerDataForm.get('instructions.attachments')
    ).toBeTruthy();
    expect(component.headerDataForm.get('instructions.pdfDocs')).toBeTruthy();

    // Check the validators of specific form controls
    const nameControl = component.headerDataForm.get('name');
    expect(nameControl.validator).toEqual(
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ])
    );

    const plantIdControl = component.headerDataForm.get('plantId');
    expect(plantIdControl.validator).toEqual(Validators.required);
  });

  it('should patch form metadata into headerDataForm from the store', () => {
    const formMetadata = {
      name: 'Form Name',
      description: 'Form Description'
    };
    spyOn(store, 'select').and.returnValue(of(formMetadata));

    // Call ngOnInit method
    component.ngOnInit();

    // Check if the form metadata is patched into the headerDataForm
    expect(component.headerDataForm.get('name').value).toEqual(
      formMetadata.name
    );
    expect(component.headerDataForm.get('description').value).toEqual(
      formMetadata.description
    );
  });

  it('should call getAllPlantsData and retrieveDetails methods during component initialization', () => {
    spyOn(component, 'getAllPlantsData');
    spyOn(component, 'retrieveDetails');

    // Call ngOnInit method
    component.ngOnInit();

    // Check if getAllPlantsData and retrieveDetails methods are called
    expect(component.getAllPlantsData).toHaveBeenCalled();
    expect(component.retrieveDetails).toHaveBeenCalled();
  });

  const validatorFn = component.maxLengthWithoutBulletPoints(10); // Set the desired maxLength for testing

  it('should return null if control value is within maxLength', () => {
    const control = new FormControl('This is a test.'); // Total length without bullet points = 14
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should return null if control value is exactly maxLength', () => {
    const control = new FormControl('Hello, world!'); // Total length without bullet points = 13
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should return an error object if control value exceeds maxLength without bullet points', () => {
    const control = new FormControl(
      '<ul><li>List item 1</li><li>List item 2</li></ul>'
    ); // Total length without bullet points = 0
    const result = validatorFn(control);
    expect(result).toEqual({ maxLength: { value: control.value } });
  });

  it('should return null if control value is empty', () => {
    const control = new FormControl('');
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should return null if control value is null', () => {
    const control = new FormControl(null);
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should update isOpen value when focus is true', () => {
    component.isOpen = new FormControl(false);
    component.handleEditorFocus(true);
    expect(component.isOpen.value).toBe(true);
  });

  it('should update isOpen value when focus is false', () => {
    component.isOpen = new FormControl(true);
    component.handleEditorFocus(false);
    expect(component.isOpen.value).toBe(false);
  });

  it('should not update isOpen value when focus is the same', () => {
    component.isOpen = new FormControl(true);
    component.handleEditorFocus(true);
    expect(component.isOpen.value).toBe(true);

    component.isOpen = new FormControl(false);
    component.handleEditorFocus(false);
    expect(component.isOpen.value).toBe(false);
  });

  it('should update headerDataForm when fetchAllPlants$ returns data', () => {
    const mockPlantsData = {
      items: [
        { id: 1, name: 'Plant 1' },
        { id: 2, name: 'Plant 2' }
      ]
    };
    mockPlantService.fetchAllPlants$.and.returnValue(of(mockPlantsData));

    component.getAllPlantsData();

    expect(component.allPlantsData).toEqual(mockPlantsData.items);
    expect(component.plantInformation).toEqual(mockPlantsData.items);
  });

  it('should update headerDataForm with formData when data is present', () => {
    const mockFormData = {
      name: 'Form Name',
      description: 'Form Description',
      formType: 'Form Type',
      plantId: 'Plant ID',
      formStatus: 'Form Status',
      instructions: {
        notes: 'Form Notes',
        attachments: 'Attachments',
        pdfDocs: 'PDF Docs'
      },
      additionalDetails: []
    };
    component.data = { formData: mockFormData };

    component.getAllPlantsData();

    expect(component.headerDataForm.value).toEqual({
      name: mockFormData.name,
      description: mockFormData.description,
      formType: mockFormData.formType,
      plantId: mockFormData.plantId,
      formStatus: mockFormData.formStatus,
      instructions: mockFormData.instructions,
      tags: [],
      isPublic: false,
      isArchived: false,
      additionalDetails: []
    });
  });

  it('should update additional details and tags', () => {
    const mockFormData = {
      name: 'Form Name',
      description: 'Form Description',
      formType: 'Form Type',
      plantId: 'Plant ID',
      formStatus: 'Form Status',
      instructions: {
        notes: 'Form Notes',
        attachments: 'Attachments',
        pdfDocs: 'PDF Docs'
      },
      tags: ['Tag1', 'Tag2'],
      additionalDetails: [{ detail: 'Detail 1' }, { detail: 'Detail 2' }]
    };
    component.data = { formData: mockFormData };

    spyOn(component, 'updateAdditionalDetailsArray');
    spyOn(component, 'patchTags');

    component.getAllPlantsData();

    expect(component.updateAdditionalDetailsArray).toHaveBeenCalledWith(
      mockFormData.additionalDetails
    );
    expect(component.patchTags).toHaveBeenCalledWith(mockFormData.tags);
  });
  it('should mark headerDataForm as dirty if there is existing form data', () => {
    const mockFormData = {
      name: 'Form Name',
      description: 'Form Description',
      formType: 'Form Type',
      plantId: 'Plant ID',
      formStatus: 'Form Status',
      instructions: {
        notes: 'Form Notes',
        attachments: 'Attachments',
        pdfDocs: 'PDF Docs'
      },
      additionalDetails: []
    };
    component.data = { formData: mockFormData };

    component.getAllPlantsData();

    expect(component.headerDataForm.dirty).toBe(true);
  });
  it('should not mark headerDataForm as dirty if there is no existing form data', () => {
    component.data = null;

    component.getAllPlantsData();

    expect(component.headerDataForm.dirty).toBe(false);
  });

  afterEach(() => {
    // Perform cleanup tasks
  });
});
