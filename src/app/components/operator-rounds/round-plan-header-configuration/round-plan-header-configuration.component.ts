/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, Subject, Subscription, merge, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pairwise,
  startWith,
  takeUntil,
  tap
} from 'rxjs/operators';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn
} from '@angular/forms';
import { ValidationError, FormMetadata } from 'src/app/interfaces';
import { LoginService } from '../../login/services/login.service';
import { Store } from '@ngrx/store';
import { State, getFormMetadata } from 'src/app/forms/state';
import {
  BuilderConfigurationActions,
  RoundPlanConfigurationActions
} from 'src/app/forms/state/actions';
import {
  DEFAULT_PDF_BUILDER_CONFIG,
  fileUploadSizeToastMessage,
  formConfigurationStatus
} from 'src/app/app.constants';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { LocationService } from '../../master-configurations/locations/services/location.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/shared/toast';
import { SlideshowComponent } from 'src/app/shared/components/slideshow/slideshow.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { PDFDocument } from 'pdf-lib';
import { RoundPlanModalComponent } from '../round-plan-modal/round-plan-modal.component';
import { Router } from '@angular/router';
import { cloneDeep, isEqual } from 'lodash-es';

@Component({
  selector: 'app-round-plan-header-configuration',
  templateUrl: './round-plan-header-configuration.component.html',
  styleUrls: ['./round-plan-header-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundPlanHeaderConfigurationComponent
  implements OnInit, OnDestroy
{
  @ViewChild('tagsInput', { static: false })
  tagsInput: ElementRef<HTMLInputElement>;
  @ViewChild('valueInput', { static: false }) valueInput: ElementRef;
  @ViewChild('labelInput', { static: false }) labelInput: ElementRef;
  @ViewChild('roundPlanFileUpload', { static: false })
  roundPlanFileUpload: ElementRef;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) auto: MatAutocompleteTrigger;
  @Output() gotoNextStep = new EventEmitter<void>();
  @Input() roundData;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl: FormControl;
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  labels: any = {};
  filteredLabels$: Observable<any>;
  filteredValues$: Observable<any>;
  allTags: string[] = [];
  originalTags: string[] = [];
  selectedOption: string;
  allPlantsData = [];
  plantInformation = [];
  changedValues: any;
  headerDataForm: FormGroup;
  errors: ValidationError = {};
  convertedDetail = {};
  additionalDetailsIdMap = {};
  deletedLabel = '';

  plantFilterInput = '';
  unitFilterInput = '';
  readonly formConfigurationStatus = formConfigurationStatus;

  dropDownIsOpen = false;
  modalIsOpen = false;
  attachment: any;
  formMetadata: FormMetadata;
  form: FormGroup;
  isOpen = new FormControl(false);
  options: any = [];
  filteredMediaType: any = { mediaType: [] };
  filteredMediaTypeIds: any = { mediaIds: [] };
  filteredMediaPdfTypeIds: any = [];
  filteredMediaPdfType: any = [];
  base64result: string;
  pdfFiles: any = { mediaType: [] };
  additionalDetails: FormArray;
  labelSelected: any;
  hasFormChanges = false;

  formMetadataSubscrption: Subscription;
  allUnitLocations = [];
  unitLocations = this.allUnitLocations;
  searchUnits: '';
  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RoundPlanModalComponent>,
    private readonly loginService: LoginService,
    private store: Store<State>,
    private operatorRoundsService: OperatorRoundsService,
    private plantService: PlantService,
    private locationService: LocationService,
    private cdrf: ChangeDetectorRef,
    private toastService: ToastService,
    public dialog: MatDialog,
    private imageCompress: NgxImageCompressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tagsCtrl = new FormControl('', [
      Validators.maxLength(25),
      WhiteSpaceValidator.whiteSpace,
      WhiteSpaceValidator.trimWhiteSpace
    ]);
    this.operatorRoundsService
      .getDataSetsByType$('roundHeaderTags')
      .subscribe((tags) => {
        if (tags && tags.length) {
          this.allTags = tags[0].values;
          this.originalTags = cloneDeep(tags[0].values);
          this.tagsCtrl.patchValue('');
          this.cdrf.detectChanges();
        }
      });
    this.filteredTags = this.tagsCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this.filter(tag) : this.allTags.slice()
      ),
      map((tagsArray) => tagsArray.filter((tag) => !!tag))
    );
    this.headerDataForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      description: [''],
      isPublic: [false],
      isArchived: [false],
      formStatus: [formConfigurationStatus.draft],
      formType: [formConfigurationStatus.standalone],
      tags: [this.tags],
      plantId: ['', Validators.required],
      unitId: [''],
      additionalDetails: this.fb.array([]),
      instructions: this.fb.group({
        notes: [
          '',
          [
            this.maxLengthWithoutBulletPoints(250),
            WhiteSpaceValidator.trimWhiteSpace,
            WhiteSpaceValidator.whiteSpace
          ]
        ],
        attachments: '',
        pdfDocs: ''
      })
    });

    this.formMetadataSubscrption = this.store
      .select(getFormMetadata)
      .subscribe((res) => {
        this.formMetadata = res;
        if (res.plantId) {
          this.getUnitLocations(res.plantId, res.unitId);
        }
        this.headerDataForm.patchValue({
          name: res.name,
          description: res.description ? res.description : '',
          unitId: res.unitId || ''
        });
      });
    this.getAllPlantsData();
    this.retrieveDetails();

    this.operatorRoundsService.attachmentsMapping$
      .pipe(map((data) => (Array.isArray(data) ? data : [])))
      .subscribe((attachments) => {
        attachments?.forEach((att) => {
          this.filteredMediaType.mediaType = [
            ...this.filteredMediaType.mediaType,
            att.attachment
          ];
          this.filteredMediaTypeIds.mediaIds = [
            ...this.filteredMediaTypeIds.mediaIds,
            att.id
          ];
        });
        this.cdrf.detectChanges();
      });

    this.operatorRoundsService.pdfMapping$
      .pipe(map((data) => (Array.isArray(data) ? data : [])))
      .subscribe((pdfs) => {
        pdfs?.forEach((pdf) => {
          this.pdfFiles = {
            mediaType: [...this.pdfFiles.mediaType, JSON.parse(pdf.fileInfo)]
          };
          this.filteredMediaPdfTypeIds.push(pdf.id);
        });
        this.cdrf.detectChanges();
      });

    this.headerDataForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(100),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([previous, current]) => {
          delete previous.plantId;
          delete current.plantId;
          if (isEqual(previous, current)) this.hasFormChanges = false;
          else this.hasFormChanges = true;
        })
      )
      .subscribe(() => {
        if (this.hasFormChanges) {
          this.store.dispatch(
            BuilderConfigurationActions.updateFormStatus({
              formStatus: formConfigurationStatus.draft
            })
          );
        }
      });

    this.additionalDetails = this.headerDataForm.get(
      'additionalDetails'
    ) as FormArray;

    if (this.additionalDetails) {
      merge(
        ...this.additionalDetails.controls.map(
          (control: AbstractControl, index: number) =>
            control.valueChanges.pipe(
              map((value) => ({ rowIndex: index, value }))
            )
        )
      ).subscribe((changes) => {
        this.changedValues = changes.value;
      });
    }
  }

  getAllPlantsData() {
    this.plantService.fetchLoggedInUserPlants$().subscribe((plants) => {
      this.allPlantsData = plants || [];
      this.plantInformation = this.allPlantsData;
      const plantId = this.roundData?.formMetadata?.plantId;
      if (plantId !== undefined) {
        this.headerDataForm.patchValue({ plantId });
      }
    });

    if (Object.keys(this.roundData?.formMetadata).length !== 0) {
      this.headerDataForm.patchValue(
        {
          name: this.roundData.formMetadata.name,
          description: this.roundData.formMetadata.description,
          formStatus: this.roundData.formMetadata.formStatus,
          instructions: this.roundData.formMetadata.instructions
        },
        { emitEvent: false }
      );

      const additionalDetailsArray =
        this.roundData.formMetadata.additionalDetails;

      const tagsValue = [...this.roundData.formMetadata.tags];

      this.updateAdditionalDetailsArray(additionalDetailsArray);
      this.patchTags(tagsValue);

      this.headerDataForm.markAsDirty();
    }
  }

  patchTags(values: any[]): void {
    this.tags = [...values];
    this.headerDataForm.get('tags').setValue([...this.tags]);
  }

  updateAdditionalDetailsArray(values: any[]): void {
    if (values) {
      const formGroups = values.map((value) =>
        this.fb.group({
          label: [value.FIELDLABEL],
          value: [value.DEFAULTVALUE]
        })
      );
      const formArray = this.fb.array(formGroups);
      this.headerDataForm.setControl('additionalDetails', formArray);
    }
  }

  maxLengthWithoutBulletPoints(maxLength: number): ValidatorFn {
    const htmlTagsRegex = /<[^>]+>/g;
    return (control: AbstractControl): { [key: string]: any } | null => {
      const textWithoutTags = control?.value?.replace(htmlTagsRegex, '');
      if (textWithoutTags?.length > maxLength) {
        return { maxLength: { value: control.value } };
      }
      return null;
    };
  }

  add(event: MatChipInputEvent): void {
    if (!this.processValidationErrorTags()) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.tags = [...this.tags, value.trim()];
      }

      if (input) {
        input.value = '';
      }

      this.tagsCtrl.patchValue('');
    }
  }

  processValidationErrorTags(): boolean {
    const errors = this.tagsCtrl.errors;

    this.errors.tagsCtrl = null;
    if (errors) {
      Object.keys(errors).forEach((messageKey) => {
        this.errors.tagsCtrl = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return this.errors.tagsCtrl === null ? false : true;
  }

  openAutoComplete() {
    this.auto.openPanel();
  }

  remove(tag: string): void {
    this.allTags.push(tag);
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags = [...this.tags.slice(0, index), ...this.tags.slice(index + 1)];
    }
    this.filteredTags = of(
      this.tagsCtrl.value
        ? this.filter(this.tagsCtrl.value)
        : this.allTags.slice()
    );
    this.headerDataForm.get('tags').setValue([...this.tags]);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const index = this.allTags.indexOf(event.option.viewValue);

    if (index >= 0) {
      this.allTags.splice(index, 1);
    }

    this.tags = [...this.tags, event.option.viewValue];
    this.tagsInput.nativeElement.value = '';
    this.tagsCtrl.patchValue('');
    this.headerDataForm.patchValue({
      ...this.headerDataForm.value,
      tags: this.tags
    });
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }
  handleEditorFocus(focus: boolean) {
    if (this.isOpen.value !== focus) {
      this.isOpen.setValue(focus);
    }
  }

  next() {
    const additionalinfoArray = this.headerDataForm.get(
      'additionalDetails'
    ) as FormArray;
    const updatedAdditionalDetails = additionalinfoArray.value.map(
      (additionalinfo) => ({
        FIELDLABEL: additionalinfo.label,
        DEFAULTVALUE: additionalinfo.value,
        UIFIELDTYPE: 'LF'
      })
    );

    const newTags = [];
    this.headerDataForm
      .get('instructions.attachments')
      .setValue(this.filteredMediaTypeIds.mediaIds);
    this.headerDataForm
      .get('instructions.pdfDocs')
      .setValue(this.filteredMediaPdfTypeIds);
    this.tags.forEach((selectedTag) => {
      if (this.originalTags.indexOf(selectedTag) < 0) {
        newTags.push(selectedTag);
      }
    });
    if (newTags.length) {
      const dataSet = {
        type: 'roundHeaderTags',
        values: newTags
      };
      this.operatorRoundsService.createTags$(dataSet).subscribe((response) => {
        // do nothing
      });
    }

    const plant = this.allPlantsData.find(
      (p) => p.id === this.headerDataForm.get('plantId').value
    );

    if (this.headerDataForm.valid) {
      const userName = this.loginService.getLoggedInUserName();
      if (this.roundData?.roundExists === false) {
        this.store.dispatch(
          BuilderConfigurationActions.addFormMetadata({
            formMetadata: {
              ...this.headerDataForm.value,
              tags: this.tags,
              additionalDetails: updatedAdditionalDetails,
              plant: plant.name
            },
            formDetailPublishStatus: formConfigurationStatus.draft,
            formSaveStatus: formConfigurationStatus.saving
          })
        );
        this.store.dispatch(
          BuilderConfigurationActions.updateCreateOrEditForm({
            createOrEditForm: true
          })
        );

        this.store.dispatch(
          RoundPlanConfigurationActions.createRoundPlan({
            formMetadata: {
              ...this.headerDataForm.value,
              tags: this.tags,
              additionalDetails: updatedAdditionalDetails,
              pdfTemplateConfiguration: DEFAULT_PDF_BUILDER_CONFIG,
              author: userName,
              formLogo: 'assets/img/svg/round-plans-icon.svg'
            }
          })
        );
        this.router.navigate(['/operator-rounds/create']);
        this.gotoNextStep.emit();
      } else if (this.roundData?.roundExists === true) {
        this.store.dispatch(
          BuilderConfigurationActions.updateFormMetadata({
            formMetadata: {
              ...this.headerDataForm.value,
              id: this.roundData.formMetadata.id,
              tags: this.tags,
              additionalDetails: updatedAdditionalDetails,
              plant: plant.name,
              lastModifiedBy: this.loginService.getLoggedInUserName()
            },
            formStatus: this.hasFormChanges
              ? formConfigurationStatus.draft
              : this.headerDataForm.value.formStatus,
            formDetailPublishStatus: formConfigurationStatus.draft,
            formSaveStatus: formConfigurationStatus.saving
          })
        );
        this.store.dispatch(
          BuilderConfigurationActions.updateCreateOrEditForm({
            createOrEditForm: true
          })
        );
        this.store.dispatch(
          RoundPlanConfigurationActions.updateRoundPlan({
            formMetadata: {
              ...this.headerDataForm.value,
              tags: this.tags,
              id: this.roundData.formMetadata.id,
              additionalDetails: updatedAdditionalDetails,
              plant: plant.name,
              lastModifiedBy: this.loginService.getLoggedInUserName()
            },
            formListDynamoDBVersion: this.roundData.formListDynamoDBVersion,
            formStatus: this.hasFormChanges
              ? formConfigurationStatus.draft
              : this.headerDataForm.value.formStatus,
            formDetailPublishStatus: formConfigurationStatus.draft,
            formSaveStatus: formConfigurationStatus.saving
          })
        );
        this.gotoNextStep.emit();
      }
    }
  }

  trackBySelectedattachments(index: number, el: any): string {
    return el?.id;
  }

  onCancel(): void {
    this.dialogRef.close();
    this.router.navigate(['/operator-rounds']);
  }

  resetPlantSearchFilter = () => {
    this.plantFilterInput = '';
    this.plantInformation = this.allPlantsData;
    this.getUnitLocations();
  };

  resetUnitSearchFilter = () => {
    this.unitFilterInput = '';
    this.unitLocations = this.allUnitLocations;
  };

  onKeyPlant(event) {
    this.plantFilterInput = event.target.value.trim() || '';
    if (this.plantFilterInput) {
      this.plantInformation = this.allPlantsData.filter(
        (plant) =>
          plant.name
            .toLowerCase()
            .indexOf(this.plantFilterInput.toLowerCase()) !== -1 ||
          plant.plantId
            .toLowerCase()
            .indexOf(this.plantFilterInput.toLowerCase()) !== -1
      );
    } else {
      this.plantInformation = this.allPlantsData;
    }
  }

  onKeyUnit(event) {
    this.unitFilterInput = event.target.value.trim() || '';
    if (this.unitFilterInput) {
      this.unitLocations = this.unitLocations.filter((unit) =>
        unit.name.toLowerCase().includes(this.unitFilterInput.toLowerCase())
      );
    } else {
      this.unitLocations = this.allUnitLocations;
    }
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.headerDataForm.get(controlName).touched;
    const errors = this.headerDataForm.get(controlName).errors;
    this.errors[controlName] = null;
    if (touched && errors) {
      Object.keys(errors).forEach((messageKey) => {
        this.errors[controlName] = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return !touched || this.errors[controlName] === null ? false : true;
  }

  roundplanFileUploadHandler = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files);
    const reader = new FileReader();

    if (files.length > 0 && files[0] instanceof File) {
      const file: File = files[0];
      const maxSize = 390000;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.base64result = reader?.result as string;
        if (this.base64result.includes('data:application/pdf;base64,')) {
          this.resizePdf(this.base64result).then((compressedPdf) => {
            const onlybase64 = compressedPdf.split(',')[1];
            const resizedPdfSize = atob(onlybase64).length;
            const pdf = {
              fileInfo: { name: file.name, size: resizedPdfSize },
              attachment: onlybase64
            };
            if (resizedPdfSize <= maxSize) {
              this.operatorRoundsService
                .uploadAttachments$({
                  file: pdf,
                  objectId: this.formMetadata?.id,
                  plantId: this.formMetadata?.plantId
                })
                .pipe(
                  tap((response) => {
                    if (response) {
                      this.pdfFiles = {
                        mediaType: [...this.pdfFiles.mediaType, file]
                      };
                      const responsenew =
                        response?.data?.createRoundPlanAttachments?.id;
                      this.filteredMediaPdfTypeIds.push(responsenew);
                      this.filteredMediaPdfType.push(this.base64result);
                    }
                    this.cdrf.detectChanges();
                  })
                )
                .subscribe();
            } else {
              this.toastService.show({
                type: 'warning',
                text: fileUploadSizeToastMessage
              });
            }
          });
        } else {
          this.resizeImage(this.base64result).then((compressedImage) => {
            const onlybase64 = compressedImage.split(',')[1];
            const resizedImageSize = atob(onlybase64).length;
            const image = {
              fileInfo: { name: file.name, size: resizedImageSize },
              attachment: onlybase64
            };
            if (resizedImageSize <= maxSize) {
              this.operatorRoundsService
                .uploadAttachments$({
                  file: image,
                  objectId: this.formMetadata?.id,
                  plantId: this.formMetadata?.plantId
                })
                .pipe(
                  tap((response) => {
                    if (response) {
                      const responsenew =
                        response?.data?.createRoundPlanAttachments?.id;
                      this.filteredMediaTypeIds = {
                        mediaIds: [
                          ...this.filteredMediaTypeIds.mediaIds,
                          responsenew
                        ]
                      };
                      this.filteredMediaType = {
                        mediaType: [
                          ...this.filteredMediaType.mediaType,
                          onlybase64
                        ]
                      };
                      this.cdrf.detectChanges();
                    }
                  })
                )
                .subscribe();
            } else {
              this.toastService.show({
                type: 'warning',
                text: fileUploadSizeToastMessage
              });
            }
          });
        }
      };
    }
    this.clearAttachmentUpload();
  };

  async resizeImage(base64result: string): Promise<string> {
    const compressedImage = await this.imageCompress.compressFile(
      base64result,
      -1,
      100,
      800,
      600
    );
    return compressedImage;
  }

  async resizePdf(base64Pdf: string): Promise<string> {
    try {
      const base64Data = base64Pdf.split(',')[1];
      const binaryString = atob(base64Data);

      const encoder = new TextEncoder();
      const pdfBytes = encoder.encode(binaryString);

      const pdfDoc = await PDFDocument.load(pdfBytes);

      const currentSize = pdfBytes.length / 1024;
      const desiredSize = 400 * 1024;
      if (currentSize <= desiredSize) {
        return base64Pdf;
      }

      const scalingFactor = Math.sqrt(desiredSize / currentSize);
      const pages = pdfDoc.getPages();
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.setSize(width * scalingFactor, height * scalingFactor);
      });

      const modifiedPdfBytes = await pdfDoc.save();

      const decoder = new TextDecoder();
      const base64ModifiedPdf = btoa(decoder.decode(modifiedPdfBytes));

      return base64ModifiedPdf;
    } catch (error) {
      throw error;
    }
  }

  openPreviewDialog() {
    const filteredMediaTypes = [...this.filteredMediaType.mediaType];
    const slideshowImages = [];
    filteredMediaTypes.forEach((media) => {
      slideshowImages.push(media);
    });

    if (slideshowImages) {
      this.dialog.open(SlideshowComponent, {
        width: '100%',
        height: '100%',
        panelClass: 'slideshow-container',
        backdropClass: 'slideshow-backdrop',
        data: { images: slideshowImages, type: 'forms' }
      });
    }
  }

  roundPlanFileDeleteHandler(index: number): void {
    this.filteredMediaType.mediaType = this.filteredMediaType.mediaType.filter(
      (_, i) => i !== index
    );
    this.filteredMediaTypeIds.mediaIds =
      this.filteredMediaTypeIds.mediaIds.filter((_, i) => i !== index);
  }

  roundPlanPdfDeleteHandler(index: number): void {
    this.pdfFiles.mediaType = this.pdfFiles.mediaType.filter(
      (_, i) => i !== index
    );
    this.filteredMediaPdfTypeIds = this.filteredMediaPdfTypeIds.filter(
      (_, i) => i !== index
    );
  }

  processValidationErrorsAdditionalDetails(
    index: number,
    controlName: string
  ): boolean {
    const touched: boolean = (
      this.headerDataForm?.get('additionalDetails') as FormArray
    )
      .at(index)
      .get(controlName)?.touched;
    const errors: ValidationError = (
      this.headerDataForm?.get('additionalDetails') as FormArray
    )
      .at(index)
      .get(controlName)?.errors;
    this.errors[controlName] = null;
    if (touched && errors) {
      Object.keys(errors)?.forEach((messageKey) => {
        this.errors[controlName] = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return !touched || this.errors[controlName] === null ? false : true;
  }

  addAdditionalDetails() {
    this.additionalDetails.push(
      this.fb.group({
        label: [
          '',
          [
            Validators.maxLength(25),
            WhiteSpaceValidator.trimWhiteSpace,
            WhiteSpaceValidator.whiteSpace
          ]
        ],
        value: [
          '',
          [
            Validators.maxLength(40),
            WhiteSpaceValidator.trimWhiteSpace,
            WhiteSpaceValidator.whiteSpace
          ]
        ]
      })
    );

    if (this.additionalDetails) {
      merge(
        ...this.additionalDetails.controls.map(
          (control: AbstractControl, index: number) =>
            control.valueChanges.pipe(
              map((value) => ({ rowIndex: index, value }))
            )
        )
      ).subscribe((changes) => {
        this.changedValues = changes.value;
        if (this.changedValues.label) {
          this.filteredLabels$ = of(
            Object.keys(this.labels)?.filter(
              (label) =>
                label
                  .toLowerCase()
                  .indexOf(this.changedValues.label.toLowerCase()) === 0
            )
          );
        } else {
          this.filteredLabels$ = of([]);
        }

        if (this.changedValues.value && this.labels[this.changedValues.label]) {
          this.filteredValues$ = of(
            this.labels[this.changedValues.label]?.filter(
              (value) =>
                value
                  .toLowerCase()
                  .indexOf(this.changedValues.value.toLowerCase()) === 0
            )
          );
        } else {
          this.filteredValues$ = of([]);
        }
      });
    }
  }

  deleteAdditionalDetails(index: number) {
    const add = this.headerDataForm.get('additionalDetails') as FormArray;
    add.removeAt(index);
  }

  storeDetails(i) {
    this.operatorRoundsService
      .createAdditionalDetails$({
        ...this.changedValues,
        type: 'rounds',
        level: 'header'
      })
      .subscribe((response) => {
        if (response?.label) {
          this.toastService.show({
            type: 'success',
            text: 'Label added successfully'
          });
        }
        const additionalinfoArray = this.headerDataForm.get(
          'additionalDetails'
        ) as FormArray;
        this.labels[response?.label] = response?.values;
        this.filteredLabels$ = of(Object.keys(this.labels));
        this.additionalDetailsIdMap[response?.label] = response?.id;
        additionalinfoArray.at(i).get('label').setValue(response.label);
      });
  }

  storeValueDetails(i) {
    const currentLabel = this.changedValues.label;
    const currentValue = this.changedValues.value;
    if (Object.keys(this.labels).includes(currentLabel)) {
      if (
        this.labels[currentLabel].every(
          (value) => value.toLowerCase() !== currentValue.toLowerCase()
        )
      ) {
        const newValues = [...this.labels[currentLabel], currentValue];
        this.operatorRoundsService
          .updateValues$({
            value: newValues,
            labelId: this.additionalDetailsIdMap[currentLabel]
          })
          .subscribe(() => {
            this.toastService.show({
              type: 'success',
              text: 'Value added successfully'
            });
            this.labels[currentLabel] = newValues;
            this.filteredValues$ = of(this.labels[currentLabel]);
            const additionalinfoArray = this.headerDataForm.get(
              'additionalDetails'
            ) as FormArray;
            additionalinfoArray.at(i).get('value').setValue(currentValue);
          });
      } else {
        this.toastService.show({
          type: 'warning',
          text: 'Value already exists'
        });
      }
    } else {
      this.toastService.show({
        type: 'warning',
        text: 'Label does not exist'
      });
    }
  }

  retrieveDetails() {
    this.operatorRoundsService
      .getAdditionalDetails$({ type: 'rounds', level: 'header' })
      .subscribe((details: any[]) => {
        this.labels = this.convertArrayToObject(details);
        details.forEach((data) => {
          this.additionalDetailsIdMap[data.label] = data.id;
        });
      });
  }

  convertArrayToObject(details) {
    details.map((obj) => {
      this.convertedDetail[obj.label] = obj.values;
    });
    return this.convertedDetail;
  }

  valueOptionClick(index) {
    this.labelSelected =
      this.headerDataForm.get('additionalDetails').value[index].label;
    if (
      this.headerDataForm.get('additionalDetails').value[index].value &&
      this.labelSelected &&
      this.labels[this.labelSelected]
    ) {
      this.filteredValues$ = of(
        this.labels[
          this.headerDataForm.get('additionalDetails').value[index].label
        ].filter((data) =>
          data.includes(
            this.headerDataForm.get('additionalDetails').value[index].value
          )
        )
      );
    } else {
      this.filteredValues$ = of([]);
    }
  }

  labelOptionClick(index) {
    const labelSelectedData =
      this.headerDataForm.get('additionalDetails').value[index].label;
    if (labelSelectedData) {
      this.filteredLabels$ = of(
        Object.keys(this.labels).filter((data) =>
          data.includes(labelSelectedData)
        )
      );
    } else {
      this.filteredLabels$ = of([]);
    }
  }

  removeLabel(label, i) {
    const documentId = this.additionalDetailsIdMap[label];
    this.operatorRoundsService.removeLabel$(documentId).subscribe(() => {
      delete this.labels[label];
      delete this.additionalDetailsIdMap[label];
      this.toastService.show({
        type: 'success',
        text: 'Label deleted Successfully'
      });
      this.deletedLabel = label;
      const additionalinfoArray = this.headerDataForm.get(
        'additionalDetails'
      ) as FormArray;
      additionalinfoArray.at(i).get('label').setValue('');
      additionalinfoArray.controls.forEach((control, index) => {
        if (control.value.label === label) {
          control.get('label').setValue('');
          control.get('value').setValue('');
        }
      });
    });
  }
  removeValue(deleteValue, i) {
    const currentLabel = this.changedValues.label;
    const newValue = this.labels[this.changedValues.label].filter(
      (value) => value !== deleteValue
    );
    this.operatorRoundsService
      .deleteAdditionalDetailsValue$({
        value: newValue,
        labelId: this.additionalDetailsIdMap[this.changedValues.label]
      })
      .subscribe(() => {
        this.labels[this.changedValues.label] = newValue;
        this.toastService.show({
          type: 'success',
          text: 'Value deleted Successfully'
        });
        const additionalinfoArray = this.headerDataForm.get(
          'additionalDetails'
        ) as FormArray;
        additionalinfoArray.at(i).get('value').setValue('');
        additionalinfoArray.controls.forEach((control, index) => {
          if (
            control.value.value === deleteValue &&
            control.value.label === currentLabel
          ) {
            control.get('value').setValue('');
          }
        });
      });
  }

  getAdditionalDetailList() {
    return (this.headerDataForm.get('additionalDetails') as FormArray).controls;
  }

  ngOnDestroy() {
    this.formMetadataSubscrption.unsubscribe();
    this.operatorRoundsService.attachmentsMapping$.next([]);
    this.operatorRoundsService.pdfMapping$.next([]);
    this.destroy$.next();
    this.destroy$.complete();
  }
  clearAttachmentUpload() {
    this.roundPlanFileUpload.nativeElement.value = '';
  }

  getUnitLocations(selectedPlantId?: string, selectedLocationId?: string) {
    const selectedPlant =
      selectedPlantId || this.headerDataForm.get('plantId').value;
    if (selectedPlant) {
      const filter = {
        plantId: selectedPlant || ''
      };
      this.locationService.fetchUnitLocations$(filter).subscribe((units) => {
        this.allUnitLocations = units.items;
        this.unitLocations = this.allUnitLocations;
        if (selectedLocationId) {
          const selectedLocation = this.unitLocations.find(
            (loc) => loc.id === selectedLocationId
          );
          this.headerDataForm.patchValue({
            unitId: selectedLocation.id || ''
          });
        }
      });
    }
  }
}
