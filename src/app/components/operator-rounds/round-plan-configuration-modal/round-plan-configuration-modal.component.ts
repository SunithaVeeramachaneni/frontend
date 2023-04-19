/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef } from '@angular/material/dialog';
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
  Validators,
  FormArray,
  Form
} from '@angular/forms';
import {
  InstructionsFile,
  ValidationError,
  FormMetadata
} from 'src/app/interfaces';
import { Router } from '@angular/router';
import { LoginService } from '../../login/services/login.service';
import { Store } from '@ngrx/store';
import { State } from 'src/app/forms/state';
import {
  BuilderConfigurationActions,
  RoundPlanConfigurationActions
} from 'src/app/forms/state/actions';
import { formConfigurationStatus } from 'src/app/app.constants';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/shared/toast';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { RoundPlanConfigurationService } from 'src/app/forms/services/round-plan-configuration.service';

@Component({
  selector: 'app-round-plan-configuration-modal',
  templateUrl: './round-plan-configuration-modal.component.html',
  styleUrls: ['./round-plan-configuration-modal.component.scss']
})
export class RoundPlanConfigurationModalComponent implements OnInit {
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
  name: string;
  headerDataForm: FormGroup;
  errors: ValidationError = {};
  readonly formConfigurationStatus = formConfigurationStatus;

  dropDownIsOpen = false;
  modalIsOpen = false;
  attachment: any;
  formMetadata: FormMetadata;
  moduleName: string;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<RoundPlanConfigurationModalComponent>,
    private readonly loginService: LoginService,
    private store: Store<State>,
    private operatorRoundsService: OperatorRoundsService,
    private cdrf: ChangeDetectorRef,
    public dialog: MatDialog,
    private toast: ToastService,

    private roundplanconfiguarationservice: RoundPlanConfigurationService
  ) {
    this.operatorRoundsService.getDataSetsByType$('tags').subscribe((tags) => {
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
    return (control: AbstractControl): { [key: string]: any } | null => {
      console.log('text:', control.value);
      const textWithoutBulletPoints = control.value
        .replace('<p>', '')
        .replace('</p>', '')
        .replace('<ul>', '')
        .replace('</ul>', '')
        .replace('<li>', '')
        .replace('</li>', '')
        .replace('<ol>', '')
        .replace('</ol>', '');
      if (textWithoutBulletPoints.length > maxLength) {
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
          Validators.maxLength(100)
        ]
      ],
      description: [''],
      isPublic: [false],
      isArchived: [false],
      formStatus: [formConfigurationStatus.draft],
      formType: [formConfigurationStatus.standalone],
      tags: [this.tags],

      notes_attachment: ['', [this.maxLengthWithoutBulletPoints(250)]]
    });
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
      // this.operatorRoundsService.createTags$(dataSet).subscribe((response) => {
      //   // do nothing
      // });
    }

    if (this.headerDataForm.valid) {
      const userName = this.loginService.getLoggedInUserName();
      this.store.dispatch(
        BuilderConfigurationActions.addFormMetadata({
          formMetadata: {
            ...this.headerDataForm.value,
            moduleName: 'rdf'
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
            author: userName,
            formLogo: 'assets/img/svg/rounds-icon.svg'
          }
        })
      );
      this.router.navigate(['/operator-rounds/create']);
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
    this.roundplanconfiguarationservice
      .uploadToS3$(`${this.moduleName}/${this.formMetadata?.id}`, file)
      .subscribe((event) => {
        const value: InstructionsFile = {
          name: file.name,
          size: file.size,
          objectKey: event.message.objectKey,
          objectURL: event.message.objectURL
        };
        if (isImage) {
          originalValue.images[index] = value;
        } else {
          originalValue.pdf = value;
        }
      });
  }

  roundplanFileUploadHandler = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const allowedFileTypes: string[] = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf'
    ];

    Array.from(target.files).forEach((file) => {
      const originalValue = this.headerDataForm.get('value').value;
      if (allowedFileTypes.indexOf(file.type) === -1) {
        this.toast.show({
          text: 'Invalid file type, only JPG/JPEG/PNG/PDF accepted.',
          type: 'warning'
        });
        return;
      }

      if (file.type === 'application/pdf') {
        if (originalValue.pdf === null) {
          this.sendFileToS3(file, {
            originalValue,
            isImage: false
          });
        }
      } else {
        const index = originalValue.images.findIndex((image) => image === null);
        if (index !== -1) {
          this.sendFileToS3(file, {
            originalValue,
            isImage: true,
            index
          });
        }
      }
      console.log(originalValue);
      console.log(' original value ');
    });
  };

  instructionsFileDeleteHandler(index: number) {
    const originalValue = this.headerDataForm.get('value').value;
    if (index < 3) {
      this.roundplanconfiguarationservice.deleteFromS3(
        originalValue.images[index].objectKey
      );
      originalValue.images[index] = null;
      originalValue.images = this.imagesArrayRemoveNullGaps(
        originalValue.images
      );
    } else {
      this.roundplanconfiguarationservice.deleteFromS3(
        originalValue.pdf.objectKey
      );
      originalValue.pdf = null;
    }
    // this.headerDataForm.get('value').setValue(originalValue);
    // this.instructionsUpdateValue();
  }

  imagesArrayRemoveNullGaps(images) {
    const nonNullImages = images.filter((image) => image !== null);
    return nonNullImages.concat(Array(3 - nonNullImages.length).fill(null));
  }
}
