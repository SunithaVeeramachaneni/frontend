/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { FormUploadFile, ValidationError } from 'src/app/interfaces';
import { Router } from '@angular/router';
import { LoginService } from '../../login/services/login.service';
import { Store } from '@ngrx/store';
import { State } from 'src/app/forms/state';
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
import { TenantService } from '../../tenant-management/services/tenant.service';
import { FormConfigurationService } from 'src/app/forms/services/form-configuration.service';

@Component({
  selector: 'app-form-configuration-modal',
  templateUrl: './form-configuration-modal.component.html',
  styleUrls: ['./form-configuration-modal.component.scss']
})
export class FormConfigurationModalComponent implements OnInit {
  @ViewChild('tagsInput', { static: false })
  tagsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) auto: MatAutocompleteTrigger;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];

  allTags: string[] = [];
  originalTags: string[] = [];
  allPlantsData = [];
  plantInformation = [];

  selectedOption: string;
  headerDataForm: FormGroup;
  errors: ValidationError = {};
  readonly formConfigurationStatus = formConfigurationStatus;
  options: any = [];
  filteredMediaType: any;
  s3BaseUrl: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<FormConfigurationModalComponent>,
    private readonly loginService: LoginService,
    private store: Store<State>,
    private rdfService: RaceDynamicFormService,
    private cdrf: ChangeDetectorRef,
    private plantService: PlantService,
    @Inject(MAT_DIALOG_DATA) public data,
    private toast: ToastService,
    public dialog: MatDialog,
    public tenantService: TenantService,
    private formConfigurationService: FormConfigurationService
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
      const textWithoutTags = control.value.replace(htmlTagsRegex, '');
      if (textWithoutTags.length > maxLength) {
        return { maxLength: { value: control.value } };
      }
      return null;
    };
  }

  ngOnInit(): void {
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
      instructions: [
        {
          images: [],
          pdf: []
        }
      ],
      notesAttachment: ['', [this.maxLengthWithoutBulletPoints(250)]]
    });

    const {
      s3Details: { bucket, region }
    } = this.tenantService.getTenantInfo();

    this.s3BaseUrl = `https://${bucket}.s3.${region}.amazonaws.com/`;

    this.getAllPlantsData();
  }

  getAllPlantsData() {
    this.plantService.fetchAllPlants$().subscribe((plants) => {
      this.allPlantsData = plants.items || [];
      this.plantInformation = this.allPlantsData;
    });

    if (this.data) {
      this.headerDataForm.patchValue({
        name: this.data.name,
        description: this.data.description
      });
      this.headerDataForm.markAsDirty();
    }
  }

  onKeyPlant(event) {
    const value = event.target.value || '';
    if (value) {
      this.plantInformation = this.searchPlant(value);
    } else {
      this.plantInformation = this.allPlantsData;
    }
  }

  searchPlant(value: string) {
    const searchValue = value.toLowerCase();
    return this.plantInformation.filter(
      (plant) =>
        (plant.name && plant.name.toLowerCase().indexOf(searchValue) !== -1) ||
        (plant.plantId &&
          plant.plantId.toLowerCase().indexOf(searchValue) !== -1)
    );
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
    const newTags = [];
    const instructions = {
      notes: '',
      attachments: '',
      pdfDocs: ''
    };
    const pdfs = this.headerDataForm.get('instructions').value.pdf;
    const pdfKeys = pdfs.map((pdf) => pdf.objectKey.substring(7));

    const images = this.headerDataForm.get('instructions').value.images;
    const imageKeys = images.map((image) => image.objectKey.substring(7));
    const newAttachments = [...imageKeys, ...pdfKeys];
    const notesAdd = this.headerDataForm.get('notesAttachment').value;
    this.tags.forEach((selectedTag) => {
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
      this.store.dispatch(
        BuilderConfigurationActions.addFormMetadata({
          formMetadata: { ...this.headerDataForm.value, plant: plant.name },
          formDetailPublishStatus: formConfigurationStatus.draft,
          formSaveStatus: formConfigurationStatus.saving
        })
      );
      this.store.dispatch(
        BuilderConfigurationActions.updateCreateOrEditForm({
          createOrEditForm: true
        })
      );
      for (const url of newAttachments) {
        if (
          url.endsWith('.png') ||
          url.endsWith('.jpeg') ||
          url.endsWith('.jpg')
        ) {
          if (instructions.attachments.length > 0) {
            instructions.attachments += ', ';
          }
          instructions.attachments += url;
        } else if (url.endsWith('.pdf')) {
          {
            if (instructions.pdfDocs.length > 0) {
              instructions.pdfDocs += ',';
            }
            instructions.pdfDocs += url;
          }
        }
      }
      instructions.notes += notesAdd;
      this.headerDataForm.get('notesAttachment').setValue(notesAdd);
      this.headerDataForm.get('instructions').setValue(instructions);
      this.store.dispatch(
        BuilderConfigurationActions.createForm({
          formMetadata: {
            ...this.headerDataForm.value,
            pdfTemplateConfiguration: DEFAULT_PDF_BUILDER_CONFIG,
            author: userName,
            formLogo: 'assets/rdf-forms-icons/formlogo.svg'
          }
        })
      );

      if (this.data) {
        this.rdfService
          .updateTemplate$(this.data.id, {
            formsUsageCount: this.data.formsUsageCount + 1
          })
          .subscribe(() => {
            this.router
              .navigate(['/forms/create'], {
                state: { selectedTemplate: this.data }
              })
              .then(() => this.dialogRef.close());
          });
      } else {
        this.router
          .navigate(['/forms/create'])
          .then(() => this.dialogRef.close());
      }
    }
  }
  trackBySelectedattachments(index: number, el: any): string {
    return el.id;
  }

  onCancel(): void {
    this.dialogRef.close();
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

  getS3Url(filePath: string) {
    return `${this.s3BaseUrl}public/${filePath}`;
  }

  sendFileToS3(file, params): void {
    const { originalValue, isImage } = params;
    this.formConfigurationService.uploadToS3$(file).subscribe((event) => {
      const value: FormUploadFile = {
        name: file.name,
        size: file.size,
        objectKey: event
      };
      if (isImage) {
        originalValue.images.push(value);
      } else {
        originalValue.pdf.push(value);
      }

      this.headerDataForm.get('instructions').setValue(originalValue);
    });
  }

  formFileUploadHandler = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files);
    const allowedFileTypes: string[] = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf'
    ];

    const originalValue = this.headerDataForm.get('instructions').value;
    for (const file of files) {
      if (allowedFileTypes.indexOf(file.type) === -1) {
        this.toast.show({
          text: 'Invalid file type, only JPG/JPEG/PNG/PDF accepted.',
          type: 'warning'
        });
        return;
      }
      if (file.type === 'application/pdf') {
        this.sendFileToS3(file, {
          originalValue,
          isImage: false
        });
      } else {
        this.sendFileToS3(file, {
          originalValue,
          isImage: true
        });
      }
    }
  };

  openPreviewDialog() {
    const attachments = this.headerDataForm.get('instructions').value;
    const filteredMediaType1 = [...attachments.images];

    const slideshowImages = [];
    filteredMediaType1.forEach((media) => {
      slideshowImages.push(`${this.s3BaseUrl}${media.objectKey}`);
    });

    if (slideshowImages) {
      this.dialog.open(SlideshowComponent, {
        width: '100%',
        height: '100%',
        panelClass: 'slideshow-container',
        backdropClass: 'slideshow-backdrop',
        data: slideshowImages
      });
    }
  }

  formFileDeleteHandler(index: number): void {
    const attachments = this.headerDataForm.get('instructions').value;
    if (attachments) {
      this.formConfigurationService.deleteFromS3(attachments.images.objectKey);

      attachments.images.splice(index, 1);
      this.headerDataForm.get('instructions').setValue(attachments);
    }
  }

  formPdfDeleteHandler(index: number): void {
    const attachments = this.headerDataForm.get('instructions').value;
    if (attachments) {
      this.formConfigurationService.deleteFromS3(attachments.pdf.objectKey);

      attachments.pdf.splice(index, 1);

      this.headerDataForm.get('instructions').setValue(attachments);
    }
  }
}
