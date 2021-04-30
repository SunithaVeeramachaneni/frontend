import {Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewChecked, ChangeDetectorRef} from '@angular/core';
import {CdkStepper} from '@angular/cdk/stepper';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {InstructionService} from '../instruction.service';
import {ActivatedRoute} from '@angular/router';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {NgZone, ViewChild} from '@angular/core';
import {take} from 'rxjs/operators';
import {CommonService} from '../../../shared/common.services';
import {Subscription} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import { Base64HelperService } from '../../../shared/base64-helper.service';
import { Instruction } from '../../../interfaces/instruction';
import { Step } from '../../../interfaces/step';
import { Store } from '@ngrx/store';
import { State } from '../../../state/app.state';
import * as InstructionActions from '../state/intruction.actions';
import { getInstruction, getInstructionId, getSteps } from '../state/instruction.selectors';

interface Category {
  Category_Id: string;
  Category_Name: string;
  Cover_Image: string;
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})


export class OverviewComponent implements OnInit, OnDestroy {
  @Input() set setCategory(value: boolean) {
    if (value) {
      this.updateCategoryOnSetCategoryChange();
    }
  }
  private _titleProvided: boolean;
  get titleProvided(): boolean {
    return this._titleProvided;
  }
  @Input() set titleProvided(value: boolean) {
    this._titleProvided = value;
    if (value) {
      this.enableReactiveFormFields();
    }
  }
  @Input() selectedInstruction: Instruction;
  @Output() instructionDataEntry: EventEmitter<any> = new EventEmitter<any>();
  @Output() stepsDataEntry: EventEmitter<any> = new EventEmitter<any>();
  @Output() publishOnAddCloneSteps = new EventEmitter<boolean>();
  public createWIForm: FormGroup;
  // public headerInfoProvided: boolean = false;
  public assignedObjectsList: any[];
  assignedObjectsSelected: any[];
  isAssignedObjectsOpened = false;
  public categoriesList: Category[];
  categoriesSelected: any[];
  isCategoryOpened = false;
  public selectedTools = [];
  public selectedSafetyKits = [];
  public selectedSpareParts = [];
  public previewDisplay = true ;
  public WI_Details = [];
  public WI_Details_Drafting = [];
  public recentWorkInstruction: Instruction;
  public selectedInstructionData = {
    selectedTools: [],
    selectedSpareParts: [],
    selectedSafetyKits: [],
  };
  public coverImageFiles = [];
  public attachedStepImageFiles = [];
  private insByIdSubscription: Subscription;
  private currentPreviousStatusSubscription: Subscription;
  private instructionSubscription: Subscription;
  private imageContentsSubscription: Subscription;
  private assignedObjcetsTmp: any[];
  frmSubscribe: FormGroup;

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  updateCategoryOnSetCategoryChange = () => {
    const WI = this.recentWorkInstruction;
    const {Categories} = WI;
    const CategoriesArrayObject = JSON.parse(Categories);
    const category = this.categoriesList.find(cat => cat.Category_Id === CategoriesArrayObject[0].Category_Id);
    this.categoriesSelected = [category.Category_Name];
  }

  triggerResize() {
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }


  constructor(private _ngZone: NgZone,
              private _formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private _commonSvc: CommonService,
              private _instructionSvc: InstructionService,
              private base64HelperService: Base64HelperService,
              private store: Store<State>) { }

  OnCategoryObjectsList(obj: string) {
    const categories = this.categoriesSelected;
    const updatedCategoryObjects = this.removeFirst(categories, obj);
    this.categoriesSelected = updatedCategoryObjects;
    if (this.categoriesSelected.length !== 0) {
      const selectedCategories = this.categoriesList.map(category => {
        if (updatedCategoryObjects.indexOf(category.Category_Name) > -1 ) {
          return category;
        }
      }).filter(category => category);
      this.recentWorkInstruction.Categories = JSON.stringify(selectedCategories);
    } else {
      let category_names = [];
      category_names = [...category_names, 'Unassigned'];
      this.categoriesSelected = category_names;
      const defaultCategory = [
        {'Category_Id': "4d08pHYBr", 'Category_Name': "Unassigned", 'Cover_Image': "assets/img/brand/category-placeholder.png"}
      ];
      this.recentWorkInstruction.Categories = JSON.stringify(defaultCategory);
    }
    this.instructionDataEntry.emit({insObj: this.recentWorkInstruction, update: true});
  }

  removePrequisite = ({type, value}) => {
    this.updatePrequisite(value, type, true, true);
  }

  getAllStepData({ update }): void {
    this.stepsDataEntry.emit({ update });
  }

  publishOnAddCloneStepsHandler(publish: boolean) {
    this.publishOnAddCloneSteps.emit(publish);
  }

  updatePreviewStatus(status) {
     this._commonSvc.setPreviewStatus(!status);
  }

  OnassignedObjectsList(obj: any) {
    const objects = this.assignedObjectsSelected;
    const updatedAssignedObjects = this.removeFirst(objects, obj);
    this.assignedObjectsSelected = updatedAssignedObjects;
    this.updateAssignedObjects(updatedAssignedObjects);
  }

  private removeFirst<T>(array: T[], toRemove: any): T[] {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
    if (this.recentWorkInstruction.AssignedObjects && Array.isArray(JSON.parse(this.recentWorkInstruction.AssignedObjects))) {
      let assignedObjects = JSON.parse(this.recentWorkInstruction.AssignedObjects);
      const indexAssObj = assignedObjects.findIndex(data => data.FILEDNAME === toRemove.FILEDNAME);
      if (indexAssObj !== -1) {
        assignedObjects.splice(indexAssObj, 1);
      }
      assignedObjects = assignedObjects.length ? JSON.stringify(assignedObjects) : null;
      this.recentWorkInstruction.AssignedObjects = assignedObjects;
    }
    this.instructionDataEntry.emit({insObj: this.recentWorkInstruction, update: true});
    return array;
  }

  getAllCategories() {
    this._instructionSvc.getAllCategories().subscribe((resp) => {
      this.categoriesList = resp;
    });
  }

  reactiveForm() {
    this.createWIForm = this._formBuilder.group({
      categories: new FormControl({ value: [], disabled: true}),
      assignedObjects: new FormControl({ value: [], disabled: true}),
      coverImage: new FormControl({ value: '', disabled: true}),
      tools: new FormControl({ value: '', disabled: true}, [Validators.min(3), Validators.max(150)]),
      safetyKit: new FormControl({ value: '', disabled: true}, [Validators.min(3), Validators.max(150)]),
      spareParts: new FormControl({ value: '', disabled: true}, [Validators.min(3), Validators.max(150)])
    });
  }

  enableReactiveFormFields = () => {
    this.createWIForm.enable();
  }

  get formControls() {
    return this.createWIForm.controls;
  }

  onCategoryOpenClose = () => {
    if (this.categoriesSelected.length) {
      this.formControls.categories.setValue(this.categoriesSelected);
    }
    if (this.isCategoryOpened) {
      this.formControls.categories.setValue([]);
    }
    this.isCategoryOpened = !this.isCategoryOpened;
  }

  updateCategory(selectedValues) {
    let category_names = [];
    if (selectedValues && selectedValues.length === 0) {
      category_names = [...category_names, 'Unassigned'];
      this.formControls.categories.setValue(category_names);
      this.categoriesSelected = [...category_names];
      const defaultCategory = [
        {'Category_Id': "4d08pHYBr ", 'Category_Name': "Unassigned", 'Cover_Image': "assets/img/brand/category-placeholder.png"}
      ];
      this.recentWorkInstruction.Categories = JSON.stringify(defaultCategory);
      this.instructionDataEntry.emit({insObj: this.recentWorkInstruction, update: true});
    }
    if (selectedValues && selectedValues.length !== 0) {
      if (this.recentWorkInstruction) {
        const selectedCategories = this.categoriesList.map(category => {
          if (selectedValues.indexOf(category.Category_Name) > -1) {
            if ((selectedValues.length === 1) || (selectedValues.length > 1 && category.Category_Name !== 'Unassigned')) {
              category_names = [...category_names, category.Category_Name];
              return category;
            }
          }
        }).filter(category => category);
        this.formControls.categories.setValue(category_names);
        this.categoriesSelected = [...category_names];
        this.recentWorkInstruction.Categories = JSON.stringify(selectedCategories);
        this.instructionDataEntry.emit({insObj: this.recentWorkInstruction, update: true});
      }
    }
  }

  onAssignedObjectsOpenClose = () => {
    if (this.assignedObjectsSelected?.length) {
      this.formControls.assignedObjects.setValue(this.assignedObjectsSelected);
    }
    if (this.isAssignedObjectsOpened) {
      this.formControls.assignedObjects.setValue([]);
    }
    this.isAssignedObjectsOpened = !this.isAssignedObjectsOpened;
  }

  updateAssignedObjects = (assignedObjets: any[] = null) => {
    this.assignedObjectsSelected = [];
    if (this.assignedObjcetsTmp && this.assignedObjcetsTmp.length && this.assignedObjectsList) {
      this.assignedObjectsList.forEach((assignedObjet: any, index: number) => {
        const indexObj = this.assignedObjcetsTmp.findIndex(assignedObjetTmp => {
          return assignedObjetTmp.FILEDNAME === assignedObjet.FILEDNAME;
        });
        if (indexObj !== -1) {
          this.assignedObjectsList[index]['Value'] = this.assignedObjcetsTmp[indexObj].Value;
          this.assignedObjcetsTmp.splice(indexObj, 1);
          this.updateBusinessObject(assignedObjet, assignedObjet.Value, false);
          this.assignedObjectsSelected = [...this.assignedObjectsSelected, assignedObjet];
        }
      });
    }

    if (assignedObjets && assignedObjets.length >= 0) {
      this.assignedObjectsSelected = assignedObjets;
      this.assignedObjectsList.forEach((assignedObjet: any, index: number) => {
        const indexObj = assignedObjets.findIndex(assignedObjetTmp => {
          return assignedObjetTmp.FILEDNAME === assignedObjet.FILEDNAME;
        });
        if (indexObj === -1) {
          if (this.assignedObjectsList[index]['Value']) {
            const updatedAssignedObjects = this.removeFirst(assignedObjets, {...assignedObjet});
            this.assignedObjectsSelected = updatedAssignedObjects;
          }
          this.assignedObjectsList[index]['Value'] = '';
        }
      });
    }
  }

  updateBusinessObject(obj, enteredVal, update: boolean = true) {
    this.assignedObjectsList.forEach((assignedObjet: any, index: number) => {
      if (assignedObjet.FILEDNAME === obj.FILEDNAME) {
        this.assignedObjectsList[index]['Value'] = enteredVal;
      }
    });
    if (this.recentWorkInstruction) {
      if (enteredVal.trim() || enteredVal.trim() === '') {
        const assignedObjectInDrafting = {
          'OBJECTCATEGORY': 'WORKORDER',
          'FILEDNAME': obj.FILEDNAME,
          'FIELDDESCRIPTION': obj.FIELDDESCRIPTION,
          'Value': enteredVal ? enteredVal : ''
        };

        const index = this.WI_Details_Drafting.findIndex((e) => e.FILEDNAME === assignedObjectInDrafting.FILEDNAME);
        if (index === -1) {
          this.WI_Details_Drafting.push(assignedObjectInDrafting);
        } else {
          this.WI_Details_Drafting[index] = assignedObjectInDrafting;
        }

        this.recentWorkInstruction.AssignedObjects = JSON.stringify(this.WI_Details_Drafting);
        this.instructionDataEntry.emit({insObj: this.recentWorkInstruction, update});
      }
    }
  }

  requisiteChange = (val: string, type) => {
    if (val && type) {
      this.updatePrequisite(val, type, true);
    }
  }

  uploadCoverImageFile(files: FileList) {
    const wid = this.route.snapshot.paramMap.get('id') || this.recentWorkInstruction?.Id;
    const file = files[0];
    const imageForm = new FormData();
    imageForm.append('image', file);
    this._instructionSvc.uploadAttachments(imageForm).subscribe(
      attachmentsResp => {
        if (Object.keys(attachmentsResp).length) {
          const {image: uploadedImage} = attachmentsResp;
          this.coverImageFiles = [uploadedImage];
          this.base64HelperService.getBase64Image(uploadedImage);
          this._instructionSvc.getInstructionsById(wid).subscribe((instruction) => {
            if (Object.keys(instruction).length) {
              instruction.Cover_Image = this.coverImageFiles[0];
              this._instructionSvc.updateWorkInstruction(instruction).subscribe(
                () => {
                  this.store.dispatch(InstructionActions.updateInstruction({ instruction }));
                });
            }
          });
        }
      }
    );
  }

  getImageSrc = (file: string) => this.base64HelperService.getBase64ImageData(file);

  preparePrerequisite = ({prequisiteDetails, enteredVal, remove}) => {
    if (remove) {
      prequisiteDetails = prequisiteDetails.filter(data => data !== enteredVal);
    } else {
      if (Array.isArray(enteredVal)) {
        enteredVal.forEach(data => {
          prequisiteDetails = [...prequisiteDetails, data];
        });
      } else {
        const index = prequisiteDetails.findIndex(data => data.toLowerCase() === enteredVal.toLowerCase().trim());
        if (index === -1) {
          prequisiteDetails = [...prequisiteDetails, enteredVal];
        }
      }
    }
    return prequisiteDetails;
  }

  updatePrequisite(enteredVal, prequisite, update: boolean = true, remove: boolean = false) {
    const field = {
      "Title": prequisite,
      "Position": 0,
      "Active": "true",
      "FieldCategory": "HEADER",
      "FieldType": "RTF",
      "FieldValue": []
    };
    switch (prequisite) {
      case 'Tools': {
        field.Position = 0;
        this.selectedTools = this.preparePrerequisite({
          prequisiteDetails: [...this.selectedTools],
          enteredVal,
          remove
        });
        field.FieldValue = [...field.FieldValue, ...this.selectedTools];
        this.recentWorkInstruction.Tools = JSON.stringify(field);
        this.selectedInstructionData = {
          ...this.selectedInstructionData,
          selectedTools: [...this.selectedTools]
        };
        this.formControls.tools.setValue('');
        break;
      }
      case 'SafetyKit': {
        field.Position = 1;
        this.selectedSafetyKits = this.preparePrerequisite({
          prequisiteDetails: [...this.selectedSafetyKits],
          enteredVal,
          remove
        });
        field.FieldValue = [...field.FieldValue, ...this.selectedSafetyKits];
        this.recentWorkInstruction.SafetyKit = JSON.stringify(field);
        this.selectedInstructionData = {
          ...this.selectedInstructionData,
          selectedSafetyKits: [...this.selectedSafetyKits]
        };
        this.formControls.safetyKit.setValue('');
        break;
      }
      case 'SpareParts': {
        field.Position = 2;
        this.selectedSpareParts = this.preparePrerequisite({
          prequisiteDetails: [...this.selectedSpareParts],
          enteredVal,
          remove
        });
        field.FieldValue = [...field.FieldValue, ...this.selectedSpareParts];
        this.recentWorkInstruction.SpareParts = JSON.stringify(field);
        this.selectedInstructionData = {
          ...this.selectedInstructionData,
          selectedSpareParts: [...this.selectedSpareParts]
        };
        this.formControls.spareParts.setValue('');
        break;
      }
    }
    this.instructionDataEntry.emit({ insObj: this.recentWorkInstruction, update });
  }

  getBusinessObjects() {
    this._instructionSvc.getAllBusinessObjects().subscribe((resp) => {
      if (resp && resp.length > 0) {
        this.assignedObjectsList = resp;
        this.updateAssignedObjects();
      }
    });
  }

  assignedObjectsComparison(option: any, value: any): boolean {
    return option.FILEDNAME === value.FILEDNAME;
  }

  ngOnInit() {
    this.instructionSubscription = this.store.select(getInstruction).subscribe(
      instruction => this.recentWorkInstruction = { ...instruction }
    );

    const wid = this.route.snapshot.paramMap.get('id') || this.recentWorkInstruction?.Id;
    this.reactiveForm();
    this.getAllCategories();
    this.getBusinessObjects();
    if (wid) {
      this.insByIdSubscription = this._instructionSvc.getInstructionsById(wid).subscribe((insdata) => {
        if (Object.keys(insdata).length) {
          const {Cover_Image: coverImage} = insdata;
          this.coverImageFiles = coverImage && coverImage.indexOf('assets') > -1 ? this.coverImageFiles : [coverImage];
          this.formControls.coverImage.setValue({coverImage});
          this.formControls.coverImage.valueChanges.subscribe(val => {
            const [coverImg] = this.coverImageFiles;
            if (coverImg && val !== coverImg) {
              this.createWIForm.patchValue({coverImage: coverImg});
            }
          });
          this._instructionSvc.getStepsByWID(insdata.Id).subscribe((stepsResp) => {
            if (stepsResp && stepsResp.length > 0) {
              this.store.dispatch(InstructionActions.updateSteps( { steps: stepsResp }));
              if (stepsResp) {
                const steps = stepsResp;
                for (let stepCnt = 0; stepCnt < steps.length; stepCnt++) {
                  const {Attachment, StepId} = steps[stepCnt];
                  if (Attachment && JSON.parse(Attachment).length > 0) {
                    this.attachedStepImageFiles = JSON.parse(Attachment);
                    this.imageContentsSubscription = this.base64HelperService.getImageContents(this.attachedStepImageFiles).subscribe(
                      imageContents => {
                        imageContents = imageContents.filter(imageContent => Object.keys(imageContent).length !== 0);
                        this.store.dispatch(InstructionActions.updateStepImages({ stepImages: {
                          stepId: StepId,
                          attachments: Attachment,
                          imageContents: imageContents.length ? JSON.stringify(imageContents) : ''
                        }}));
                      }
                    );
                  }
                }
              }
            }
          });

          const selectedCategories = JSON.parse(insdata.Categories);
          let catNames = [];
          for (let catCnt = 0; catCnt < selectedCategories.length; catCnt++) {
            catNames = [...catNames, selectedCategories[catCnt].Category_Name];
          }
          this.categoriesSelected = catNames;
          this.assignedObjcetsTmp = JSON.parse(insdata.AssignedObjects);
          this.assignedObjectsSelected = JSON.parse(insdata.AssignedObjects);
          if (this.assignedObjectsSelected?.length) {
            this.updateAssignedObjects();
          }
          if (insdata.Tools) {
            this.updatePrequisite(JSON.parse(insdata.Tools).FieldValue, 'Tools', false);
          }
          if (insdata.SpareParts) {
            this.updatePrequisite(JSON.parse(insdata.SpareParts).FieldValue, 'SpareParts', false);
          }
          if (insdata.SafetyKit) {
            this.updatePrequisite(JSON.parse(insdata.SafetyKit).FieldValue, 'SafetyKit', false);
          }
        }
      });
    }

    this.currentPreviousStatusSubscription = this._commonSvc.currentPreviewStatus.subscribe(status => {
      this.previewDisplay = status;
    });
  }


  ngOnDestroy() {
    this.base64HelperService.resetBase64ImageDetails();
    if (this.insByIdSubscription) {
      this.insByIdSubscription.unsubscribe();
    }
    if (this.currentPreviousStatusSubscription) {
      this.currentPreviousStatusSubscription.unsubscribe();
    }
    if (this.instructionSubscription) {
      this.instructionSubscription.unsubscribe();
    }
    if (this.imageContentsSubscription) {
      this.imageContentsSubscription.unsubscribe();
    }
  }
}

@Component({
  selector: 'app-custom-stepper',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css'],
  providers: [{provide: CdkStepper, useExisting: CustomStepperComponent}]
})

export class CustomStepperComponent extends CdkStepper implements OnInit, OnDestroy, AfterViewChecked {
  public selectedFormFactor = {id: '1', name: 'iPad'};
  public loadedImages: any = [];
  public instructions: any = [];
  public fields: any = [];

  public warnings: any = [];
  public hints: any = [];
  // @Input() headerInfoProvided;
  public reactionPlan: any = [];
  public firstButton = true;
  public lastButton = false;
  @Input() titleProvided;
  @Input() selectedInstruction: Instruction;
  @Output() allStepData: EventEmitter<any> = new EventEmitter<any>();
  @Output() publishOnAddCloneSteps = new EventEmitter<boolean>();
  public currentStepTitle = '';
  public tabs = ['HEADER'];
  public devices = [{id: 1, name: 'iPad'}, {id: 2, name: 'iPhone'}];
  public formFactors: FormGroup;
  public shownPreview = true;
  public selectedID = new FormControl(0);
  private currentStepTitleSubscription: Subscription;
  private currentTabsSubscription: Subscription;
  private currentPreviousStatusSubscription: Subscription;
  private unLoadedImagesSubscription: Subscription;
  private currentImgFromPreviewSectionSubscription: Subscription;
  private currentStepDetailsSectionSubscription: Subscription;
  @Input() selectedInstructionData;
  allSteps: Step[];
  instructionId: string;
  private stepsSubscription: Subscription;
  private instructionIdSubscription: Subscription;

  constructor(private spinner: NgxSpinnerService,
              private _instructionSvc: InstructionService,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private _commonSvc: CommonService,
              private cdrf: ChangeDetectorRef,
              private store: Store<State>) {
    // @ts-ignore
    super();
  }

  hidePreview() {
    this.shownPreview = !this.shownPreview;
    this._commonSvc.setPreviewStatus(this.shownPreview);
  }



  onTabChange(index: number, noOfSteps) {
    if (index === 0) {
      this._commonSvc.unloadImages([]);
    }
    if (this.selectedID.value === 0 ) {
      this.firstButton = true;
    } else {
      this.firstButton = false;
    }

    if (this.selectedID.value === noOfSteps - 1) {
      this.lastButton = true;
    } else {
      this.lastButton = false;
    }
  }


  buttonActionsInHeader (noOfSteps) {
    this.selectedID.setValue(0);
    if (this.selectedID.value === 0 ) {
      this.firstButton = true;
    } else {
      this.firstButton = false;
    }

    if (this.selectedID.value === noOfSteps - 1) {
      this.lastButton = true;
    } else {
      this.lastButton = false;
    }
  }

  buttonActionsInSteps (index , noOfSteps) {
    this.selectedID.setValue(index);
    if (this.selectedID.value === 0 ) {
      this.firstButton = true;
    } else {
      this.firstButton = false;
    }

    if (this.selectedID.value === noOfSteps - 1) {
      this.lastButton = true;
    } else {
      this.lastButton = false;
    }
  }

  previewDisplayStatus(prevewDisplayStatus: any): void {
    this.shownPreview = !prevewDisplayStatus;
    this._commonSvc.setPreviewStatus(this.shownPreview);
  }

  getStepData({ update = true }): void {
    this.allStepData.emit({ update });
  }

  onClickHeader(): void {
    this.selectedID.setValue(0);
  }

  onClickOfStep(val): void {
    this.selectedID.setValue(val);
  }

  editByUser() {
    const userName = JSON.parse(localStorage.getItem("loggedInUser"));
    this._instructionSvc.getInstructionsById(this.instructionId).subscribe((instruction) => {
      if (Object.keys(instruction).length) {
        instruction.EditedBy = userName.first_name + " " + userName.last_name;
        instruction.IsPublishedTillSave = false;
        this._instructionSvc.updateWorkInstruction(instruction).subscribe(
          () => {
            this.store.dispatch(InstructionActions.updateInstruction({ instruction }));
          });
      }
    });
  }

  addTab() {
    this._commonSvc.stepDetailsSave('Saving..');
    // this.spinner.show();
    this.tabs.push('Step' + (this.tabs.length));
    const step = {
      Title: 'STEP' + (this.tabs.length - 1),
      WI_Id: this.instructionId
    };
    this._instructionSvc.addStep(step).subscribe((resp) => {
      if (Object.keys(resp).length) {
        this.store.dispatch(InstructionActions.addStep({ step: resp }));
        this.selectedID.setValue(this.tabs.length);
        this._commonSvc.setUpdatedSteps(this.allSteps);
        this.publishOnAddCloneSteps.emit(true);
        this.editByUser();
        this._commonSvc.stepDetailsSave('All Changes Saved');
      }
    });
  }

  cloneTab(step: Step) {
    this._commonSvc.stepDetailsSave('Saving..');
    this.tabs.push('Step' + (this.tabs.length));
    step = {...step, isCloned: true};

    this._instructionSvc.addStep(step).subscribe((resp) => {
      if (Object.keys(resp).length) {
        this.editByUser();
        this.store.dispatch(InstructionActions.addStep({ step: resp }));
        this.selectedID.setValue(this.tabs.length);
        this._commonSvc.setUpdatedSteps(this.allSteps);
        this.publishOnAddCloneSteps.emit(true);
        this._commonSvc.stepDetailsSave('All Changes Saved');
      }
    });
  }

  getStepsByWId() {
    const insId = this.route.snapshot.paramMap.get('id');
   if(insId){
    this._instructionSvc.getInstructionsById(insId).subscribe((instruction) => {
      if (Object.keys(instruction).length) {
        const { Id } = instruction;
        if (Id) {
          this._instructionSvc.getStepsByWID(Id).subscribe((resp) => {
            this.store.dispatch(InstructionActions.updateSteps({ steps: resp }));
            this._commonSvc.setUpdatedSteps(resp);
            this.tabs = ['HEADER'];
            for (let cnt = 1; cnt <= resp.length; cnt++) {
              const stepVal = cnt - 1;
              if (resp[stepVal]) {
                // resp[stepVal].UNIQUEKEY = resp[stepVal].UNIQUEKEY;
                this.tabs.push(resp[stepVal].Title);
              }
            }
          });
        }
      }
    });
  }
  }

  prepareHeaderTitle = () => `Header`.toUpperCase();
  prepareStepTitle = (selectedTab: number) => this.tabs[selectedTab + 1]?.toUpperCase();
  prepareAddStepTitle = (tabsLength: number) => `Add Step ${tabsLength}`.toUpperCase();

  get f() {
    return this.formFactors.controls;
  }


  onDeviceSelection(e) {
    this.selectedFormFactor = this.formFactors.value.formFactors;
  }


ngOnInit() {
    this.stepsSubscription = this.store.select(getSteps).subscribe(
      steps => this.allSteps = steps
    );
    this.instructionIdSubscription = this.store.select(getInstructionId).subscribe(
      id => this.instructionId = id
    );

    this.getStepsByWId();
    this.currentStepTitleSubscription = this._commonSvc.currentStepTitle.subscribe(title => {
      this.currentStepTitle = title;
    });
    this.currentPreviousStatusSubscription = this._commonSvc.currentPreviewStatus.subscribe(status => {
      this.shownPreview = status;
    });
    this.currentTabsSubscription = this._commonSvc.currentTabs.subscribe(allsteps => {
      this.tabs = ['HEADER'];
      for (let stepCnt = 0; stepCnt < allsteps.length; stepCnt++) {
        this.tabs.push(allsteps[stepCnt].Title);
      }
    });

    this.formFactors = this.fb.group({
      formFactors: [null, Validators.required]
    });

    const selectedDevice = this.devices.find(c => c.id === 1);
    this.formFactors.get('formFactors').setValue(selectedDevice);

    this.unLoadedImagesSubscription = this._commonSvc.unLoadedImages.subscribe(emptyArr => {
      this.loadedImages = emptyArr;
    });
    this.currentImgFromPreviewSectionSubscription = this._commonSvc.currentImgFromPreviewSection.subscribe(({image, index}) => {
      const obj = {
        src: image
      };
      if (index !== undefined) {
        this.loadedImages.splice(index, 1, obj);
      } else {
        this.loadedImages = [...this.loadedImages, obj];
      }
    });
    this.currentStepDetailsSectionSubscription = this._commonSvc.currentStepDetails.subscribe(field => {
      if (field && Object.keys(field).length) {
        let content = "";
        if (field.FieldValue) {
          content = field.FieldValue.replace(/<li>/g, '<li class="editor-listvalues">')
            .replace(/<ol>/g, '<ol class="editor-ol">')
            .replace(/<ul>/g, '<ul class="editor-ul">')
            .replace(/<p>/g, '<p class="editor-p">');
        }
        switch (field.Title) {
          case 'Instruction': {
          }
            this.instructions = {header: field.Title, content};
            break;
          case 'Warning':
            this.warnings = {header: field.Title, content};
            break;
          case 'Hint':
            this.hints = {header: field.Title, content};
            break;
          case 'Reaction Plan':
            this.reactionPlan = {header: field.Title, content};
            break;
          default:
          // do nothing
        }
      }
    });
  }

  ngAfterViewChecked(): void {
    this.cdrf.detectChanges();
  }

  ngOnDestroy() {
    this.loadedImages = [];
    if (this.currentStepTitleSubscription) {
      this.currentStepTitleSubscription.unsubscribe();
    }
    if (this.currentTabsSubscription) {
      this.currentTabsSubscription.unsubscribe();
    }
    if (this.unLoadedImagesSubscription) {
      this.unLoadedImagesSubscription.unsubscribe();
    }
    if (this.currentImgFromPreviewSectionSubscription) {
      this.currentImgFromPreviewSectionSubscription.unsubscribe();
    }
    if (this.currentStepDetailsSectionSubscription) {
      this.currentStepDetailsSectionSubscription.unsubscribe();
    }
    if (this.currentPreviousStatusSubscription) {
      this.currentPreviousStatusSubscription.unsubscribe();
    }
    if (this.stepsSubscription) {
      this.stepsSubscription.unsubscribe();
    }
    if (this.instructionIdSubscription) {
      this.instructionIdSubscription.unsubscribe();
    }
  }
}
