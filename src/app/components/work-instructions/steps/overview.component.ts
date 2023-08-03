import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  OnDestroy,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { InstructionService } from '../services/instruction.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgZone, ViewChild } from '@angular/core';
import { map, mergeMap, take } from 'rxjs/operators';
import { WiCommonService } from '../services/wi-common.services';
import { combineLatest, of, Subscription } from 'rxjs';
import { Base64HelperService } from '../services/base64-helper.service';
import { Instruction, Step } from '../../../interfaces';
import { Store } from '@ngrx/store';
import * as InstructionActions from '../state/intruction.actions';
import { getInstruction, getSteps } from '../state/instruction.selectors';
import {
  defaultCategoryId,
  defaultCategoryName,
  permissions
} from '../../../app.constants';
import { State } from '../state/instruction.reducer';

interface Category {
  Category_Id: string;
  Category_Name: string;
  Cover_Image: string;
}

export interface SelectedInstructionData {
  selectedTools: any[];
  selectedSpareParts: any[];
  selectedSafetyKits: any[];
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
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
  public previewDisplay = true;
  public WI_Details = [];
  public WI_Details_Drafting = [];
  public recentWorkInstruction: Instruction;
  public selectedInstructionData: SelectedInstructionData = {
    selectedTools: [],
    selectedSpareParts: [],
    selectedSafetyKits: []
  };
  public coverImageFiles = [];
  public attachedStepImageFiles = [];
  private currentPreviousStatusSubscription: Subscription;
  private instructionSubscription: Subscription;
  private imageContentsSubscription: Subscription;
  private assignedObjcetsTmp: any[];
  frmSubscribe: FormGroup;
  imageDataCalls: any = {};
  private updateOverviewDetailsCalled = false;
  titleProvided = false;

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(
    private _ngZone: NgZone,
    private _formBuilder: FormBuilder,
    private _commonSvc: WiCommonService,
    private _instructionSvc: InstructionService,
    private base64HelperService: Base64HelperService,
    private store: Store<State>
  ) {}

  triggerResize() {
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  OnCategoryObjectsList(obj: string) {
    const categories = this.categoriesSelected;
    const updatedCategoryObjects = this.removeFirst(categories, obj);
    this.categoriesSelected = updatedCategoryObjects;
    if (this.categoriesSelected.length !== 0) {
      const selectedCategories = this.categoriesList
        .map((category) => {
          if (updatedCategoryObjects.indexOf(category.Category_Name) > -1) {
            return category.Category_Id;
          }
        })
        .filter((categoryId) => categoryId);
      this.recentWorkInstruction.Categories =
        JSON.stringify(selectedCategories);
    } else {
      let category_names = [];
      category_names = [...category_names, defaultCategoryName];
      this.categoriesSelected = category_names;
      this.recentWorkInstruction.Categories = JSON.stringify([
        defaultCategoryId
      ]);
    }
    this.instructionDataEntry.emit({
      insObj: this.recentWorkInstruction,
      update: true
    });
  }

  removePrequisite = ({ type, value }) => {
    this.updatePrequisite(value, type, true, true);
  };

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
    if (
      this.recentWorkInstruction.AssignedObjects &&
      Array.isArray(JSON.parse(this.recentWorkInstruction.AssignedObjects))
    ) {
      let assignedObjects = JSON.parse(
        this.recentWorkInstruction.AssignedObjects
      );
      const indexAssObj = assignedObjects.findIndex(
        (data) => data.FILEDNAME === toRemove.FILEDNAME
      );
      if (indexAssObj !== -1) {
        assignedObjects.splice(indexAssObj, 1);
        this.WI_Details_Drafting.splice(indexAssObj, 1);
      }
      assignedObjects = assignedObjects.length
        ? JSON.stringify(assignedObjects)
        : null;
      this.recentWorkInstruction.AssignedObjects = assignedObjects;
    }
    this.instructionDataEntry.emit({
      insObj: this.recentWorkInstruction,
      update: true
    });
    return array;
  }

  reactiveForm() {
    this.createWIForm = this._formBuilder.group({
      categories: new FormControl({ value: [], disabled: true }),
      assignedObjects: new FormControl({ value: [], disabled: true }),
      coverImage: new FormControl({ value: '', disabled: true }),
      tools: new FormControl({ value: '', disabled: true }, [
        Validators.min(3),
        Validators.max(150)
      ]),
      safetyKit: new FormControl({ value: '', disabled: true }, [
        Validators.min(3),
        Validators.max(150)
      ]),
      spareParts: new FormControl({ value: '', disabled: true }, [
        Validators.min(3),
        Validators.max(150)
      ])
    });
  }

  enableReactiveFormFields = () => {
    this.createWIForm.enable();
  };

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
  };

  updateCategory(selectedValues) {
    let category_names = [];
    if (selectedValues && selectedValues.length === 0) {
      category_names = [...category_names, defaultCategoryName];
      this.formControls.categories.setValue(category_names);
      this.categoriesSelected = [...category_names];
      this.recentWorkInstruction.Categories = JSON.stringify([
        defaultCategoryId
      ]);
      this.instructionDataEntry.emit({
        insObj: this.recentWorkInstruction,
        update: true
      });
    }
    if (selectedValues && selectedValues.length !== 0) {
      if (this.recentWorkInstruction) {
        const selectedCategories = this.categoriesList
          .map((category) => {
            if (selectedValues.indexOf(category.Category_Name) > -1) {
              if (
                selectedValues.length === 1 ||
                (selectedValues.length > 1 &&
                  category.Category_Name !== 'Unassigned')
              ) {
                category_names = [...category_names, category.Category_Name];
                return category.Category_Id;
              }
            }
          })
          .filter((categoryId) => categoryId);
        this.formControls.categories.setValue(category_names);
        this.categoriesSelected = [...category_names];
        this.recentWorkInstruction.Categories =
          JSON.stringify(selectedCategories);
        this.instructionDataEntry.emit({
          insObj: this.recentWorkInstruction,
          update: true
        });
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
  };

  updateAssignedObjects = (assignedObjets: any[] = null) => {
    this.assignedObjectsSelected = [];
    if (
      this.assignedObjcetsTmp &&
      this.assignedObjcetsTmp.length &&
      this.assignedObjectsList
    ) {
      this.assignedObjectsList.forEach((assignedObjet: any, index: number) => {
        const indexObj = this.assignedObjcetsTmp.findIndex(
          (assignedObjetTmp) => {
            return assignedObjetTmp.FILEDNAME === assignedObjet.FILEDNAME;
          }
        );
        if (indexObj !== -1) {
          this.assignedObjectsList[index]['Value'] =
            this.assignedObjcetsTmp[indexObj].Value;
          this.assignedObjcetsTmp.splice(indexObj, 1);
          this.updateBusinessObject(
            assignedObjet,
            { target: { value: assignedObjet.Value } },
            false
          );
          this.assignedObjectsSelected = [
            ...this.assignedObjectsSelected,
            assignedObjet
          ];
        }
      });
    }

    if (assignedObjets && assignedObjets.length) {
      this.assignedObjectsSelected = assignedObjets;
      this.assignedObjectsList.forEach((assignedObjet: any, index: number) => {
        const indexObj = assignedObjets.findIndex((assignedObjetTmp) => {
          return assignedObjetTmp.FILEDNAME === assignedObjet.FILEDNAME;
        });
        if (indexObj === -1) {
          if (this.assignedObjectsList[index]['Value']) {
            const updatedAssignedObjects = this.removeFirst(assignedObjets, {
              ...assignedObjet
            });
            this.assignedObjectsSelected = updatedAssignedObjects;
          }
          this.assignedObjectsList[index]['Value'] = '';
        }
      });
    }
  };

  updateBusinessObject(obj, event: any, update: boolean = true) {
    const { value: enteredVal } = event.target as HTMLInputElement;
    this.assignedObjectsList.forEach((assignedObjet: any, index: number) => {
      if (assignedObjet.FILEDNAME === obj.FILEDNAME) {
        this.assignedObjectsList[index]['Value'] = enteredVal;
      }
    });
    if (this.recentWorkInstruction) {
      if (enteredVal.trim() || enteredVal.trim() === '') {
        const assignedObjectInDrafting = {
          OBJECTCATEGORY: 'WORKORDER',
          FILEDNAME: obj.FILEDNAME,
          FIELDDESCRIPTION: obj.FIELDDESCRIPTION,
          Value: enteredVal ? enteredVal : ''
        };

        const index = this.WI_Details_Drafting.findIndex(
          (e) => e.FILEDNAME === assignedObjectInDrafting.FILEDNAME
        );
        if (index === -1) {
          this.WI_Details_Drafting.push(assignedObjectInDrafting);
        } else {
          this.WI_Details_Drafting[index] = assignedObjectInDrafting;
        }

        this.recentWorkInstruction.AssignedObjects = JSON.stringify(
          this.WI_Details_Drafting
        );
        this.instructionDataEntry.emit({
          insObj: this.recentWorkInstruction,
          update
        });
      }
    }
  }

  requisiteChange = (event: any, type) => {
    const { value } = event.target as HTMLInputElement;
    if (value && type) {
      this.updatePrequisite(value, type, true);
    }
  };

  uploadCoverImageFile(event: any) {
    const { files } = event.target as HTMLInputElement;
    const wid = this.recentWorkInstruction.Id;
    const file = files[0];
    const imageForm = new FormData();
    imageForm.append('path', wid);
    imageForm.append('image', file);
    this._instructionSvc
      .uploadAttachments(imageForm)
      .subscribe((attachmentsResp) => {
        if (Object.keys(attachmentsResp).length) {
          const { image: uploadedImage } = attachmentsResp;
          this.coverImageFiles = [uploadedImage];
          this.base64HelperService.getBase64Image(uploadedImage, wid);
          const coverImage = this.recentWorkInstruction.Cover_Image;
          const instruction = {
            ...this.recentWorkInstruction,
            Cover_Image: this.coverImageFiles[0]
          };
          this._instructionSvc
            .updateWorkInstruction(instruction)
            .pipe(
              mergeMap((resp) => {
                if (
                  Object.keys(resp).length &&
                  coverImage.indexOf('assets/') === -1 &&
                  coverImage !== resp.Cover_Image
                ) {
                  return this._instructionSvc
                    .deleteFile(`${resp.Id}/${coverImage}`)
                    .pipe(map(() => resp));
                } else {
                  return of(resp);
                }
              })
            )
            .subscribe(() => {
              this.store.dispatch(
                InstructionActions.updateInstruction({ instruction })
              );
            });
        }
      });
  }

  getImageSrc = (file: string) => {
    if (
      !this.imageDataCalls[file] &&
      !this.base64HelperService.getBase64ImageData(
        file,
        this.recentWorkInstruction.Id
      )
    ) {
      this.imageDataCalls[file] = true;
      this.base64HelperService.getBase64Image(
        file,
        this.recentWorkInstruction.Id
      );
    }
    return this.base64HelperService.getBase64ImageData(
      file,
      this.recentWorkInstruction.Id
    );
  };

  preparePrerequisite = ({ prequisiteDetails, enteredVal, remove }) => {
    if (remove) {
      prequisiteDetails = prequisiteDetails.filter(
        (data) => data !== enteredVal
      );
    } else {
      if (Array.isArray(enteredVal)) {
        enteredVal.forEach((data) => {
          prequisiteDetails = [...prequisiteDetails, data];
        });
      } else {
        const index = prequisiteDetails.findIndex(
          (data) => data.toLowerCase() === enteredVal.toLowerCase().trim()
        );
        if (index === -1) {
          prequisiteDetails = [...prequisiteDetails, enteredVal];
        }
      }
    }
    return prequisiteDetails;
  };

  updatePrequisite(
    enteredVal,
    prequisite,
    update: boolean = true,
    remove: boolean = false
  ) {
    const field = {
      Title: prequisite,
      Position: 0,
      Active: 'true',
      FieldCategory: 'HEADER',
      FieldType: 'RTF',
      FieldValue: []
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
    this.instructionDataEntry.emit({
      insObj: this.recentWorkInstruction,
      update
    });
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
    this.reactiveForm();
    this.getBusinessObjects();
    this.instructionSubscription = combineLatest([
      this.store.select(getInstruction),
      this._instructionSvc.getAllCategories()
    ]).subscribe(([instruction, categories]) => {
      this.recentWorkInstruction = { ...instruction };
      if (
        !this.updateOverviewDetailsCalled &&
        Object.keys(instruction).length
      ) {
        this.updateOverviewDetailsCalled = true;
        this.categoriesList = categories;
        this.titleProvided = true;
        this.store.dispatch(
          InstructionActions.updateCategories({ categories })
        );
        this.enableReactiveFormFields();
        this.updateOverviewDetails(instruction);
      }
    });

    this.currentPreviousStatusSubscription =
      this._commonSvc.currentPreviewStatus.subscribe((status) => {
        this.previewDisplay = status;
      });
  }

  updateOverviewDetails = (insdata: Instruction) => {
    const { Cover_Image: coverImage } = insdata;
    this.coverImageFiles =
      coverImage && coverImage.indexOf('assets/') > -1
        ? this.coverImageFiles
        : [coverImage];
    this.formControls.coverImage.setValue({ coverImage });
    this.formControls.coverImage.valueChanges.subscribe((val) => {
      const [coverImg] = this.coverImageFiles;
      if (coverImg && val !== coverImg) {
        this.createWIForm.patchValue({ coverImage: coverImg });
      }
    });
    this._instructionSvc.getStepsByWID(insdata.Id).subscribe((stepsResp) => {
      if (stepsResp && stepsResp.length > 0) {
        this.store.dispatch(
          InstructionActions.updateSteps({ steps: stepsResp })
        );
        if (stepsResp) {
          const steps = stepsResp;
          for (let stepCnt = 0; stepCnt < steps.length; stepCnt++) {
            const { Attachment, StepId, WI_Id } = steps[stepCnt];
            if (Attachment && JSON.parse(Attachment).length > 0) {
              this.attachedStepImageFiles = JSON.parse(Attachment);
              this.imageContentsSubscription = this.base64HelperService
                .getImageContents(
                  this.attachedStepImageFiles,
                  `${WI_Id}/${StepId}`
                )
                .subscribe((imageContents) => {
                  this.store.dispatch(
                    InstructionActions.updateStepImages({
                      stepImages: {
                        stepId: StepId,
                        attachments: Attachment,
                        imageContents: imageContents.length
                          ? JSON.stringify(imageContents)
                          : ''
                      }
                    })
                  );
                });
            }
          }
        }
      }
    });

    const selectedCategories = JSON.parse(insdata.Categories);
    let catNames = [];
    for (let catCnt = 0; catCnt < selectedCategories?.length; catCnt++) {
      catNames = [
        ...catNames,
        this.categoriesList.find(
          (category) => category.Category_Id === selectedCategories[catCnt]
        ).Category_Name
      ];
    }
    this.categoriesSelected = catNames;
    this.assignedObjcetsTmp = JSON.parse(insdata.AssignedObjects);
    this.assignedObjectsSelected = JSON.parse(insdata.AssignedObjects);
    if (this.assignedObjectsSelected?.length) {
      this.updateAssignedObjects();
    }
    if (insdata.Tools) {
      this.updatePrequisite(
        JSON.parse(insdata.Tools).FieldValue,
        'Tools',
        false
      );
    }
    if (insdata.SpareParts) {
      this.updatePrequisite(
        JSON.parse(insdata.SpareParts).FieldValue,
        'SpareParts',
        false
      );
    }
    if (insdata.SafetyKit) {
      this.updatePrequisite(
        JSON.parse(insdata.SafetyKit).FieldValue,
        'SafetyKit',
        false
      );
    }
  };

  ngOnDestroy() {
    this.base64HelperService.resetBase64ImageDetails();
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
  styleUrls: ['./step.component.scss'],
  providers: [{ provide: CdkStepper, useExisting: CustomStepperComponent }]
})
export class CustomStepperComponent
  extends CdkStepper
  implements OnInit, OnDestroy, AfterViewChecked
{
  public selectedFormFactor = { id: '1', name: 'iPad' };
  public loadedImages: any = [];
  public instructions: any = [];
  public fields: any = [];

  public warnings: any = [];
  public hints: any = [];
  // @Input() headerInfoProvided;
  public reactionPlan: any = [];
  public firstButton = true;
  public lastButton = false;
  titleProvided = false;
  @Output() allStepData: EventEmitter<any> = new EventEmitter<any>();
  @Output() publishOnAddCloneSteps = new EventEmitter<boolean>();
  public currentStepTitle = '';
  public tabs = ['HEADER'];
  public tabsObject = { HEADER: 'HEADER' };
  public devices = [
    { id: 1, name: 'iPad' },
    { id: 2, name: 'iPhone' }
  ];
  public formFactors: FormGroup;
  public shownPreview = true;
  public selectedID = new FormControl(0);
  stepTabs = Array.from({ length: 30 }, (_, index) => index + 1);
  readonly permissions = permissions;
  private currentStepTitleSubscription: Subscription;
  private currentTabsSubscription: Subscription;
  private currentPreviousStatusSubscription: Subscription;
  private unLoadedImagesSubscription: Subscription;
  private currentImgFromPreviewSectionSubscription: Subscription;
  private currentStepDetailsSectionSubscription: Subscription;
  @Input() selectedInstructionData;
  allSteps: Step[];
  instruction: Instruction;
  private stepsSubscription: Subscription;
  private instructionSubscription: Subscription;
  private setUpdatedStepsCalled = false;

  constructor(
    private _instructionSvc: InstructionService,
    private fb: FormBuilder,
    private _commonSvc: WiCommonService,
    private cdrf: ChangeDetectorRef,
    private store: Store<State>
  ) {
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
    if (this.selectedID.value === 0) {
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

  buttonActionsInHeader(noOfSteps) {
    this.selectedID.setValue(0);
    if (this.selectedID.value === 0) {
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

  buttonActionsInSteps(index, noOfSteps) {
    this.selectedID.setValue(index);
    if (this.selectedID.value === 0) {
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
    const userName = JSON.parse(localStorage.getItem('loggedInUser'));
    const EditedBy = userName.first_name + ' ' + userName.last_name;
    const instruction = {
      ...this.instruction,
      IsPublishedTillSave: false,
      EditedBy
    };
    this._instructionSvc.updateWorkInstruction(instruction).subscribe(() => {
      this.store.dispatch(
        InstructionActions.updateInstruction({ instruction })
      );
    });
  }

  addTab() {
    this._commonSvc.stepDetailsSave('Saving..');
    const step = {
      Title: 'STEP' + this.tabs.length,
      WI_Id: this.instruction.Id
    };
    this._instructionSvc.addStep(step).subscribe((resp) => {
      if (Object.keys(resp).length) {
        this.store.dispatch(InstructionActions.addStep({ step: resp }));
        this._commonSvc.setUpdatedSteps(this.allSteps);
        this.selectedID.setValue(this.tabs.length);
        this.publishOnAddCloneSteps.emit(true);
        this.editByUser();
        this._commonSvc.stepDetailsSave('All Changes Saved');
      }
    });
  }

  cloneTab(step: Step) {
    this._commonSvc.stepDetailsSave('Saving..');
    step = { ...step, isCloned: true };
    this._instructionSvc
      .addStep(step)
      .pipe(
        mergeMap((resp) => {
          if (
            Object.keys(resp).length &&
            resp.Attachment &&
            JSON.parse(resp.Attachment).length
          ) {
            return this._instructionSvc
              .copyFiles({
                folderPath: `${step.WI_Id}/${step.StepId}`,
                newFolderPath: `${resp.WI_Id}/${resp.StepId}`
              })
              .pipe(map(() => resp));
          } else {
            return of(resp);
          }
        })
      )
      .subscribe((resp) => {
        if (Object.keys(resp).length) {
          this.editByUser();
          this.store.dispatch(InstructionActions.addStep({ step: resp }));
          this._commonSvc.setUpdatedSteps(this.allSteps);
          this.selectedID.setValue(this.tabs.length);
          this.publishOnAddCloneSteps.emit(true);
          this._commonSvc.stepDetailsSave('All Changes Saved');
        }
      });
  }

  prepareHeaderTitle = () => `Header`.toUpperCase();
  prepareStepTitle = (selectedTab: number) =>
    this.tabs[selectedTab + 1]?.toUpperCase();
  prepareAddStepTitle = (tabsLength: number) =>
    `Add Step ${tabsLength}`.toUpperCase();

  get f() {
    return this.formFactors.controls;
  }

  onDeviceSelection(e) {
    this.selectedFormFactor = this.formFactors.value.formFactors;
  }

  ngOnInit() {
    this.instructionSubscription = this.store
      .select(getInstruction)
      .subscribe((instruction) => {
        this.instruction = instruction;
        if (Object.keys(instruction).length) {
          this.titleProvided = true;
        }
      });
    this.stepsSubscription = this.store.select(getSteps).subscribe((steps) => {
      this.allSteps = steps;
      if (!this.setUpdatedStepsCalled && this.allSteps.length) {
        this.setUpdatedStepsCalled = true;
        this._commonSvc.setUpdatedSteps(steps);
      }
    });
    this.currentStepTitleSubscription =
      this._commonSvc.currentStepTitle.subscribe((title) => {
        this.currentStepTitle = title;
      });
    this.currentPreviousStatusSubscription =
      this._commonSvc.currentPreviewStatus.subscribe((status) => {
        this.shownPreview = status;
      });
    this.currentTabsSubscription = this._commonSvc.currentTabs.subscribe(
      ({ steps, removedStep }) => {
        for (let step of steps) {
          this.tabsObject = { ...this.tabsObject, [step.StepId]: step.Title };
        }
        if (Object.keys(removedStep)) {
          delete this.tabsObject[removedStep.StepId];
        }
        this.tabs = Object.values(this.tabsObject);
      }
    );

    this.formFactors = this.fb.group({
      formFactors: [null, Validators.required]
    });

    const selectedDevice = this.devices.find((c) => c.id === 1);
    this.formFactors.get('formFactors').setValue(selectedDevice);

    this.unLoadedImagesSubscription = this._commonSvc.unLoadedImages.subscribe(
      (emptyArr) => {
        this.loadedImages = emptyArr;
      }
    );
    this.currentImgFromPreviewSectionSubscription =
      this._commonSvc.currentImgFromPreviewSection.subscribe(
        ({ image, index }) => {
          const obj = {
            src: image
          };
          if (index !== undefined) {
            this.loadedImages.splice(index, 1, obj);
          } else {
            this.loadedImages = [...this.loadedImages, obj];
          }
        }
      );
    this.currentStepDetailsSectionSubscription =
      this._commonSvc.currentStepDetails.subscribe((field) => {
        if (field && Object.keys(field).length) {
          let content = '';
          if (field.FieldValue !== '\n' && field.FieldValue) {
            content = field.FieldValue.replace(
              /<li>/g,
              '<li class="editor-listvalues">'
            )
              .replace(/<ol>/g, '<ol class="editor-ol">')
              .replace(/<ul>/g, '<ul class="editor-ul">')
              .replace(/<p>/g, '<p class="editor-p">');
          }
          switch (field.Title) {
            case 'Instruction':
              {
              }
              this.instructions = { header: field.Title, content };
              break;
            case 'Warning':
              this.warnings = { header: field.Title, content };
              break;
            case 'Hint':
              this.hints = { header: field.Title, content };
              break;
            case 'Reaction Plan':
              this.reactionPlan = { header: field.Title, content };
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
    if (this.instructionSubscription) {
      this.instructionSubscription.unsubscribe();
    }
  }
}
