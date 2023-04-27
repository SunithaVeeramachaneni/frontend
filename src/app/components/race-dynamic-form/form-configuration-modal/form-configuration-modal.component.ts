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
  FormBuilder,
  FormControl,
  FormGroup,
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
@Component({
  selector: 'app-form-configuration-modal',
  templateUrl: './form-configuration-modal.component.html',
  styleUrls: ['./form-configuration-modal.component.scss']
})
export class FormConfigurationModalComponent implements OnInit {
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
  allPlantsData = [];

  selectedOption: string;
  headerDataForm: FormGroup;
  errors: ValidationError = {};
  readonly formConfigurationStatus = formConfigurationStatus;
  options: any = [];

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
      plantId: ['', Validators.required]
    });
    this.getAllPlantsData();
  }

  getAllPlantsData() {
    this.plantService.fetchAllPlants$().subscribe((plants) => {
      this.allPlantsData = plants.items || [];
    });

    if (this.data) {
      this.headerDataForm.patchValue({
        name: this.data.name,
        description: this.data.description
      });
      this.headerDataForm.markAsDirty();
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
            this.router.navigate(['/forms/create'], {
              state: { selectedTemplate: this.data }
            });
          });
      } else {
        this.router.navigate(['/forms/create']);
      }
      this.dialogRef.close();
    }
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

  sendFileToS3(file, params): void {
    const { originalValue, isImage, index } = params;
    console.log('sendFile to S3', file);
    this.rdfService.uploadToS3$(file).subscribe((event) => {
      const value: FormUploadFile = {
        name: file.name,
        size: file.size
        // objectKey: event.message.objectKey,
        // objectURL: event.message.objectURL
      };
      // if (isImage) {
      //   originalValue.images[index] = value;
      // } else {
      //   originalValue.pdf = value;
      // }
    });
  }

  formplanFileUploadHandler = (event: Event) => {
    let base64: string;
    console.log('event:', event.target);
    const { files } = event.target as HTMLInputElement;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = () => {
      base64 = reader.result as string;
      const image = base64.split(',')[1];
      const value = {
        name: files[0].name,
        size: (files[0].size / 1024).toFixed(2),
        base64: image,
        pdf: false,
        isImage: true,
        index: 0
      };
      console.log('value:', value);
      this.headerDataForm.get('value').setValue(value);
    };

    const target = event.target as HTMLInputElement;
    const allowedFileTypes: string[] = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf'
    ];

    const files1 = Array.from(target.files);
    const originalValue = this.headerDataForm.get('value');
    let imageIndex = 0;
    for (const file of files1) {
      if (allowedFileTypes.indexOf(file.type) === -1) {
        this.toast.show({
          text: 'Invalid file type, only JPG/JPEG/PNG/PDF accepted.',
          type: 'warning'
        });
        return;
      }
      // console.log('value:', value);
      // console.log(file + 'file');
      // console.log(originalValue + ':originalvalue');
      const isImage = true;
      this.sendFileToS3(file, {
        originalValue,
        isImage,
        imageIndex
      });
      // if (file.type === 'application/pdf') {
      //   if (originalValue.pdf === null) {
      //     this.sendFileToS3(file, {
      //       originalValue,
      //       isImage: false
      //     });
      //   }
      // } else {
      //   const index = originalValue.images.findIndex(
      //     (imageFile) => imageFile === null
      //   );
      //   if (index !== -1) {
      //     this.sendFileToS3(file, {
      //       originalValue,
      //       isImage: true,
      //       index
      //     });
      //   }
      // }
      imageIndex++;
    }
    // console.log(originalValue);

    // instructionsFileDeleteHandler(index: number): {
    //   const originalValue = this.headerDataForm.get('value').value;
    //   if (index < 3) {
    //     this.roundplanconfiguarationservice.deleteFromS3(
    //       originalValue.images[index].objectKey
    //     );
    //     originalValue.images[index] = null;
    //     originalValue.images = this.imagesArrayRemoveNullGaps(
    //       originalValue.images
    //     );
    //   } else {
    //     this.roundplanconfiguarationservice.deleteFromS3(
    //       originalValue.pdf.objectKey
    //     );
    //     originalValue.pdf = null;
    //   }
    //   // this.headerDataForm.get('value').setValue(originalValue);
    //   // this.instructionsUpdateValue();
    // }

    // imagesArrayRemoveNullGaps(images) {
    //   const nonNullImages = images.filter((image) => image !== null);
    //   return nonNullImages.concat(Array(3 - nonNullImages.length).fill(null));
    // }
  };
}
