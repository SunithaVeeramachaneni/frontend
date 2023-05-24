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
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
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
import {
  DEFAULT_TEMPLATE_PAGES,
  formConfigurationStatus
} from 'src/app/app.constants';
import { RaceDynamicFormService } from '../services/rdf.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { DuplicateNameValidator } from 'src/app/shared/validators/duplicate-name-validator';
import { TenantService } from '../../tenant-management/services/tenant.service';
import { FormConfigurationService } from 'src/app/forms/services/form-configuration.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { SlideshowComponent } from 'src/app/shared/components/slideshow/slideshow.component';

@Component({
  selector: 'app-template-configuration-modal',
  templateUrl: './template-configuration-modal.component.html',
  styleUrls: ['./template-configuration-modal.component.scss']
})
export class TemplateConfigurationModalComponent implements OnInit {
  @ViewChild('tagsInput', { static: false })
  tagsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
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

  headerDataForm: FormGroup;
  errors: ValidationError = {};
  readonly formConfigurationStatus = formConfigurationStatus;
  filteredMediaType: any;
  s3BaseUrl: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<TemplateConfigurationModalComponent>,
    private readonly loginService: LoginService,
    private rdfService: RaceDynamicFormService,
    private cdrf: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    private data: any,
    private tenantService: TenantService,
    private formConfigurationService: FormConfigurationService,
    public dialog: MatDialog,
    private toast: ToastService
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
          WhiteSpaceValidator.trimWhiteSpace,
          DuplicateNameValidator.duplicateNameValidator(
            this.data.map((item) => item.name)
          )
        ]
      ],
      description: [''],
      isPublic: [false],
      isArchived: [false],
      formStatus: [formConfigurationStatus.draft],
      formType: [formConfigurationStatus.standalone],
      tags: [this.tags],
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

  remove(tag: string): void {
    this.allTags.push(tag);
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
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
    const imageKeys = Array.isArray(images)
      ? images.map((image) => image.objectKey?.substring(7))
      : [];

    const newAttachments = [...(imageKeys ?? []), ...pdfKeys];

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
      this.rdfService.createTags$(dataSet).subscribe();
    }

    if (this.headerDataForm.valid) {
      const userEmail = this.loginService.getLoggedInEmail();
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
      this.rdfService
        .createTemplate$({
          ...this.headerDataForm.value,
          author: userEmail,
          formLogo: 'assets/rdf-forms-icons/formlogo.svg'
        })
        .subscribe((template) => {
          this.rdfService
            .createAuthoredTemplateDetail$(template.id, {
              formStatus: formConfigurationStatus.draft,
              pages: DEFAULT_TEMPLATE_PAGES,
              counter: 1
            })
            .subscribe(() => {
              this.router
                .navigate(['/forms/templates/edit', template.id], {
                  state: { allTemplates: this.data }
                })
                .then(() => this.dialogRef.close());
            });
        });
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
