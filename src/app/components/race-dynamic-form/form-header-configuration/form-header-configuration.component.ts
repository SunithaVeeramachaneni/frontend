/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  Input,
  OnDestroy
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  merge,
  of
} from 'rxjs';
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
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ValidationError } from 'src/app/interfaces';
import { LoginService } from '../../login/services/login.service';
import { Store } from '@ngrx/store';
import { State, getFormMetadata } from 'src/app/forms/state';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import {
  DEFAULT_PDF_BUILDER_CONFIG,
  formConfigurationStatus
} from 'src/app/app.constants';
import { RaceDynamicFormService } from '../services/rdf.service';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { ToastService } from 'src/app/shared/toast';
import { MatDialog } from '@angular/material/dialog';
import { SlideshowComponent } from 'src/app/shared/components/slideshow/slideshow.component';
import { OperatorRoundsService } from '../../operator-rounds/services/operator-rounds.service';
import { FormModalComponent } from '../form-modal/form-modal.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { PDFDocument } from 'pdf-lib';
import { Router, ActivatedRoute } from '@angular/router';
import { isEqual } from 'lodash-es';
import { getRequestCounter } from 'src/app/forms/state/builder/builder-state.selectors';
import { FormUpdateProgressService } from 'src/app/forms/services/form-update-progress.service';
import { v4 as uuidv4 } from 'uuid';
import * as annyang from 'annyang';

@Component({
  selector: 'app-form-header-configuration',
  templateUrl: './form-header-configuration.component.html',
  styleUrls: ['./form-header-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormHeaderConfigurationComponent implements OnInit, OnDestroy {
  @ViewChild('name') formName: ElementRef;
  @ViewChild('tagsInput', { static: false })
  tagsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) auto: MatAutocompleteTrigger;
  @Output() gotoNextStep = new EventEmitter<void>();
  @Input() data;
  @Input() formData;
  formMetaDataSubscription: Subscription;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  labels: any = {};
  filteredLabels$: Observable<any>;
  filteredValues$: Observable<any>;
  allTags: string[] = [];
  originalTags: string[] = [];
  allPlantsData = [];
  plantInformation = [];
  changedValues: any;
  addNewShow = new BehaviorSubject<boolean>(false);
  formCreateLoading$ = new BehaviorSubject<boolean>(false);
  isPromptGenerated$ = new BehaviorSubject<boolean>(false);
  disableRegenerateIdx = [];
  forms = [];
  headerDataForm: FormGroup;
  errors: ValidationError = {};
  convertedDetail = {};
  additionalDetailsIdMap = {};
  deletedLabel = '';
  isDisabled = false;
  isOpen = new FormControl(false);
  isCreateAI: boolean;
  language = '';
  isAiFormLoading = false;
  promptFormData: FormGroup;
  generatedPromptForm: FormGroup;
  sections = [];
  formTitle = '';
  requestCounter = 0;
  isSpeechRecgonitionOn = false;
  transcript = '';
  inactivityTimeout: any;
  inactivityDuration = 2000;

  plantFilterInput = '';
  readonly formConfigurationStatus = formConfigurationStatus;
  additionalDetails: FormArray;
  labelSelected: any;
  filteredMediaType: any = { mediaType: [] };
  filteredMediaTypeIds: any = { mediaIds: [] };
  filteredMediaPdfTypeIds: any = [];
  filteredMediaPdfType: any = [];
  base64result: string;
  pdfFiles: any = { mediaType: [] };
  hasFormChanges = false;
  private destroy$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<FormModalComponent>,
    private fb: FormBuilder,
    private readonly loginService: LoginService,
    private store: Store<State>,
    private rdfService: RaceDynamicFormService,
    private cdrf: ChangeDetectorRef,
    private plantService: PlantService,
    private toastService: ToastService,
    private operatorRoundService: OperatorRoundsService,
    public dialog: MatDialog,
    private imageCompress: NgxImageCompressService,
    private router: Router,
    private route: ActivatedRoute,
    private formAiGenService: FormUpdateProgressService
  ) {
    this.rdfService.getDataSetsByType$('tags').subscribe((tags) => {
      if (tags && tags.length) {
        this.allTags = tags[0].values;
        this.originalTags = JSON.parse(JSON.stringify(tags[0].values));
        this.tagsCtrl.setValue('');
        this.cdrf.detectChanges();
      }
    });
    this.filteredTags = this.tagsCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this.filter(tag) : this.allTags.slice()
      )
    );
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

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.isCreateAI) {
        this.gotoNextStep.emit();
      }
    });
    const {
      formData: { isCreateAI }
    } = this.data;
    this.isCreateAI = isCreateAI;
    this.generatedPromptForm = this.fb.group({
      generatedForms: this.fb.array([])
    });
    this.promptFormData = this.fb.group({
      plantId: [{}, Validators.required],
      prompt: ['', [Validators.required]]
    });
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

    if (annyang) {
      const commands = {
        '*text': (text: string) => {
          this.transcript += ' ' + text;
          this.promptFormData.get('prompt').setValue(this.transcript);
          this.resetInactivityTimeout();
        }
      };
      annyang.addCommands(commands);
    }

    this.formMetaDataSubscription = this.store
      .select(getFormMetadata)
      .subscribe((res) => {
        this.headerDataForm.patchValue({
          name: res.name,
          description: res.description ? res.description : ''
        });
      });

    this.getAllPlantsData();
    this.retrieveDetails();
    this.getAiFormLoading();
    this.rdfService.attachmentsMapping$
      .pipe(map((data) => (Array.isArray(data) ? data : [])))
      .subscribe((attachments) => {
        attachments?.forEach((att) => {
          this.filteredMediaType.mediaType.push(att.attachment);
          this.filteredMediaTypeIds.mediaIds.push(att.id);
        });
        this.cdrf.detectChanges();
      });

    this.rdfService.pdfMapping$
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
          if (isEqual(previous, current)) this.hasFormChanges = false;
          else this.hasFormChanges = true;
        })
      )
      .subscribe();
  }

  get generatedForms(): FormArray {
    return this.generatedPromptForm.get('generatedForms') as FormArray;
  }
  getAiFormLoading() {
    this.formAiGenService.aiFormLoading$.subscribe((data) => {
      if (this.isAiFormLoading && !data) this.gotoNextStep.emit();
      this.isAiFormLoading = data;
      this.cdrf.detectChanges();
    });
  }
  startListening() {
    if (annyang) {
      this.promptFormData.get('prompt').setValue('');
      this.isSpeechRecgonitionOn = true;
      annyang.start();
    }
  }

  stopListening() {
    if (annyang) {
      this.isSpeechRecgonitionOn = false;
      annyang.abort();
      this.transcript = '';
    }
  }

  resetInactivityTimeout() {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.stopListening();
      this.onPromptSubmit();
    }, this.inactivityDuration);
  }

  getSize(value) {
    if (value && value === value.toUpperCase()) {
      return value.length;
    }
    return value.length - 1;
  }

  editFormName() {
    // this.formConfiguration.get('name').enable();
    this.formName.nativeElement.focus();
  }
  onSectionRegenerate(idx: number) {
    this.disableRegenerateIdx.push(idx.toString());
    const formName = this.generatedForms.controls[idx].value.formTitle;
    this.store
      .select(getRequestCounter)
      .subscribe((count) => (this.requestCounter = count));

    this.rdfService
      .regenerateSectionsFromTitle$(formName, this.requestCounter)
      .subscribe((data) => {
        if (data?.sections?.length > 0) {
          let sectionStr = '<ul>';
          data?.sections?.forEach((section) => {
            sectionStr += `<li>${section?.sectionName}</li>`;
          });
          sectionStr += '</ul>';
          data.sections = sectionStr;
          this.generatedForms.controls[idx].patchValue(data);
        }
        this.disableRegenerateIdx.splice(
          this.disableRegenerateIdx.findIndex((i) => i === idx.toString()),
          1
        );
        this.cdrf.detectChanges();
      });
  }
  onPromptSubmit() {
    this.formCreateLoading$.next(true);
    this.isPromptGenerated$.next(false);
    const prompt = this.promptFormData.value.prompt.trim();
    this.store
      .select(getRequestCounter)
      .subscribe((count) => (this.requestCounter = count));
    this.rdfService
      .createSectionsFromPrompt$(prompt, this.requestCounter, {
        displayToast: true,
        failureResponse: {}
      })
      .subscribe((data) => {
        this.store.dispatch(
          BuilderConfigurationActions.incrementRequestCounter()
        );
        if (Object.keys(data)?.length) {
          this.generatedForms.clear();
          const { forms, language } = data;
          this.language = language;
          this.forms = forms;
          this.forms.forEach((form) => {
            this.addToGeneratedForm(form);
          });
          this.isPromptGenerated$.next(true);
        }
        this.formCreateLoading$.next(false);
      });
  }
  addToGeneratedForm(form) {
    let sectionStr = '<ul>';
    form?.sections?.forEach((section) => {
      sectionStr += `<li>${section?.sectionName}</li>`;
    });
    sectionStr += '</ul>';
    this.generatedForms.push(
      this.fb.group({
        formTitle: [form?.formTitle, [Validators.required]],
        sections: [sectionStr, [Validators.required]]
      })
    );
  }

  handleEditorFocus(focus: boolean) {
    if (this.isOpen.value !== focus) {
      this.isOpen.setValue(focus);
    }
  }
  getAllPlantsData() {
    this.plantService.fetchAllPlants$().subscribe((plants) => {
      this.allPlantsData = plants.items || [];
      this.plantInformation = this.allPlantsData;
    });
    if (this.data?.formData) {
      this.headerDataForm.patchValue(
        {
          name: this.data.formData.name,
          description: this.data.formData.description,
          formType: this.data.formData.formType,
          plantId: this.data.formData.plantId,
          formStatus: this.data.formData.formStatus,
          instructions: this.data.formData.instructions
        },
        { emitEvent: false }
      );

      const additionalDetailsArray = this.data.formData.additionalDetails;

      const tagsValue = this.data.formData.tags;
      if (additionalDetailsArray?.length)
        this.updateAdditionalDetailsArray(additionalDetailsArray);
      this.patchTags(tagsValue);

      this.headerDataForm.markAsDirty();
    }
  }

  patchTags(values: any[]): void {
    this.tags = values || [];
  }

  updateAdditionalDetailsArray(values: any[]): void {
    const formGroups = values.map((value) =>
      this.fb.group({
        label: [value.FIELDLABEL],
        value: [value.DEFAULTVALUE]
      })
    );
    const formArray = this.fb.array(formGroups);
    this.headerDataForm.setControl('additionalDetails', formArray);
  }

  resetPlantSearchFilter = () => {
    this.plantFilterInput = '';
    this.plantInformation = this.allPlantsData;
  };

  onKeyPlant(event) {
    this.plantFilterInput = event.target.value.trim() || '';

    if (this.plantFilterInput) {
      this.plantInformation = this.allPlantsData.filter(
        (plant) =>
          plant.name.toLowerCase().indexOf(this.plantFilterInput) !== -1 ||
          plant.plantId.toLowerCase().indexOf(this.plantFilterInput) !== -1
      );
    } else {
      this.plantInformation = this.allPlantsData;
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    if (input) {
      input.value = '';
    }

    this.tagsCtrl.setValue(null);
  }
  openAutoComplete() {
    this.auto.openPanel();
  }

  remove(tag: string): void {
    this.allTags.push(tag);
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    this.filteredTags = of(
      this.tagsCtrl.value
        ? this.filter(this.tagsCtrl.value)
        : this.allTags.slice()
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const index = this.allTags.indexOf(event.option.viewValue);

    if (index >= 0) {
      this.allTags.splice(index, 1);
    }

    this.tags.push(event.option.viewValue);
    this.tagsInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }

  next() {
    if (!this.isCreateAI) {
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
      this.tags?.forEach((selectedTag) => {
        if (this.originalTags.indexOf(selectedTag) < 0) {
          newTags.push(selectedTag);
        }
      });
      if (newTags.length) {
        const dataSet = {
          type: 'tags',
          values: newTags
        };
        this.rdfService.createTags$(dataSet).subscribe((response) => {
          // do nothing
        });
      }

      const plant = this.allPlantsData.find(
        (p) => p.id === this.headerDataForm.get('plantId').value
      );

      if (this.headerDataForm.valid) {
        const userName = this.loginService.getLoggedInUserName();
        if (this.formData.formExists === false) {
          this.store.dispatch(
            BuilderConfigurationActions.addFormMetadata({
              formMetadata: {
                ...this.headerDataForm.value,
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
            BuilderConfigurationActions.createForm({
              formMetadata: {
                ...this.headerDataForm.value,
                additionalDetails: updatedAdditionalDetails,
                pdfTemplateConfiguration: DEFAULT_PDF_BUILDER_CONFIG,
                author: userName,
                formLogo: 'assets/rdf-forms-icons/formlogo.svg'
              }
            })
          );
          this.router.navigate(['/forms/create']);
        } else if (this.formData.formExists === true) {
          this.store.dispatch(
            BuilderConfigurationActions.updateFormMetadata({
              formMetadata: {
                ...this.headerDataForm.value,
                id: this.formData.formMetadata.id,
                additionalDetails: updatedAdditionalDetails,
                plant: plant?.name
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
            BuilderConfigurationActions.updateForm({
              formMetadata: {
                ...this.headerDataForm.value,
                id: this.formData.formMetadata.id,
                additionalDetails: updatedAdditionalDetails,
                pdfTemplateConfiguration: DEFAULT_PDF_BUILDER_CONFIG
              },
              formListDynamoDBVersion: this.formData.formListDynamoDBVersion
            })
          );
        }

        if (this.data?.formData && this.data?.type === 'add') {
          this.rdfService
            .updateTemplate$(this.data.formData.id, {
              formsUsageCount: this.data.formData.formsUsageCount + 1
            })
            .subscribe(() => {
              this.store.dispatch(
                BuilderConfigurationActions.replacePagesAndCounter({
                  pages: JSON.parse(
                    this.data.formData.authoredFormTemplateDetails[0].pages
                  ),
                  counter: this.data.formData.counter
                })
              );
              this.gotoNextStep.emit();
            });
        } else {
          this.gotoNextStep.emit();
        }
      }
    } else {
      const formsArray = this.generatedForms.value.map((form) => {
        const { formTitle, sections: formSections } = form;
        const sections = this.getSectionsArrayFromHTML(formSections);
        return {
          uid: uuidv4(),
          formTitle,
          sections
        };
      });

      this.store
        .select(getRequestCounter)
        .subscribe((count) => (this.requestCounter = count));
      const forms = {
        language: this.language,
        forms: formsArray,
        plantId: this.promptFormData.value.plantId.id,
        plant: this.promptFormData.value.plantId.name,
        requestCounter: this.requestCounter
      };

      this.formAiGenService.aiFormGeneratePayload$.next(forms);
      this.formAiGenService.aiFormLoading$.next(true);
    }
  }

  getSectionsArrayFromHTML(inputString: string) {
    const regex = /<li>(.*?)<\/li>/g;
    const matches = inputString.match(regex);

    const sectionsArray = matches.map((match) => {
      const sectionName = match.replace(/<\/?li>/g, '');
      return { sectionName };
    });

    return sectionsArray;
  }

  trackBySelectedattachments(index: number, el: any): string {
    return el?.id;
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

  formFileUploadHandler = (event: Event) => {
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
              this.rdfService
                .uploadAttachments$({ file: pdf })
                .pipe(
                  tap((response) => {
                    if (response) {
                      this.pdfFiles = {
                        mediaType: [...this.pdfFiles.mediaType, file]
                      };
                      const responsenew =
                        response?.data?.createFormAttachments?.id;
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
                text: 'File size should not exceed 390KB'
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
              this.rdfService
                .uploadAttachments$({ file: image })
                .pipe(
                  tap((response) => {
                    if (response) {
                      const responsenew =
                        response?.data?.createFormAttachments?.id;
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
                text: 'File size should not exceed 390KB'
              });
            }
          });
        }
      };
    }
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

  formFileDeleteHandler(index: number): void {
    this.filteredMediaType.mediaType = this.filteredMediaType.mediaType.filter(
      (_, i) => i !== index
    );
    this.filteredMediaTypeIds.mediaIds =
      this.filteredMediaTypeIds.mediaIds.filter((_, i) => i !== index);
  }

  formPdfDeleteHandler(index: number): void {
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
    this.additionalDetails = this.headerDataForm.get(
      'additionalDetails'
    ) as FormArray;
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
            Object.keys(this.labels).filter(
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
    this.operatorRoundService
      .createAdditionalDetails$({ ...this.changedValues })
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
        this.operatorRoundService
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
    this.operatorRoundService
      .getAdditionalDetails$()
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
    this.operatorRoundService.removeLabel$(documentId).subscribe(() => {
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
    this.operatorRoundService
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

  onCancel() {
    this.dialogRef.close();
    this.router.navigate(['/forms']);
  }

  ngOnDestroy() {
    this.formAiGenService.aiFormLoading$.next(false);
    this.formMetaDataSubscription.unsubscribe();
    this.rdfService.attachmentsMapping$.next([]);
    this.rdfService.pdfMapping$.next([]);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
