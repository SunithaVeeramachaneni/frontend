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
  Validators
} from '@angular/forms';
import { ValidationError, FormMetadata } from 'src/app/interfaces';
import { Router } from '@angular/router';
import { LoginService } from '../../login/services/login.service';
import { Store } from '@ngrx/store';
import { State } from 'src/app/forms/state';
import {
  BuilderConfigurationActions,
  RoundPlanConfigurationActions
} from 'src/app/forms/state/actions';
import {
  DEFAULT_PDF_BUILDER_CONFIG,
  formConfigurationStatus
} from 'src/app/app.constants';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/shared/toast';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { RoundPlanConfigurationService } from 'src/app/forms/services/round-plan-configuration.service';
import { RoundPlanFile } from 'src/app/interfaces/master-data-management/round-plan';
import { SlideshowComponent } from 'src/app/shared/components/slideshow/slideshow.component';
import { TenantService } from '../../tenant-management/services/tenant.service';

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

  allPlantsData = [];
  plantInformation = [];

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
  options: any = [];
  selectedOption: string;
  filteredMediaType: any;
  s3BaseUrl: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<RoundPlanConfigurationModalComponent>,
    private readonly loginService: LoginService,
    private store: Store<State>,
    private operatorRoundsService: OperatorRoundsService,
    private plantService: PlantService,
    private cdrf: ChangeDetectorRef,
    public dialog: MatDialog,
    private toast: ToastService,
    private tenantService: TenantService,
    private roundPlanConfigurationService: RoundPlanConfigurationService
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

  getAllPlantsData() {
    this.plantService.fetchAllPlants$().subscribe((plants) => {
      this.allPlantsData = plants.items || [];
      this.plantInformation = this.allPlantsData;
    });
  }

  // maxLengthWithoutBulletPoints(maxLength: number): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const textWithoutBulletPoints = control.value
  //       .replace('<p>', '')
  //       .replace('</p>', '')
  //       .replace('<ul>', '')
  //       .replace('</ul>', '')
  //       .replace('<li>', '')
  //       .replace('</li>', '')
  //       .replace('<ol>', '')
  //       .replace('</ol>', '');
  //     if (textWithoutBulletPoints.length > maxLength) {
  //       return { maxLength: { value: control.value } };
  //     }
  //     return null;
  //   };
  // }

  // maxLengthWithoutBulletPoints(maxLength: number): ValidatorFn {
  //   const htmlTagsRegex = /<[^>]+>/g;
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const textWithoutTags = control.value.replace(htmlTagsRegex, '');
  //     if (textWithoutTags.length > maxLength) {
  //       return { maxLength: { value: control.value } };
  //     }
  //     return null;
  //   };
  // }

  maxLengthWithoutBulletPoints(maxLength: number): ValidatorFn {
    const htmlTagsRegex = /<[^>]+>/g;
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (typeof value === 'string') {
        const textWithoutTags = value.replace(htmlTagsRegex, '');
        if (textWithoutTags.length > maxLength) {
          return { maxLength: { value } };
        }
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

    const plant = this.allPlantsData.find(
      (p) => p.id === this.headerDataForm.get('plantId').value
    );

    if (this.headerDataForm.valid) {
      const userName = this.loginService.getLoggedInUserName();
      this.store.dispatch(
        BuilderConfigurationActions.addFormMetadata({
          formMetadata: {
            ...this.headerDataForm.value,
            plant: plant.name,
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

      const pdfs = this.headerDataForm.get('instructions').value.pdf;
      const pdfKeys = pdfs.map((pdf) => pdf.objectKey.substring(7));

      const images = this.headerDataForm.get('instructions').value.images;
      const imageKeys = images.map((image) => image.objectKey.substring(7));
      const newAttachments = [...imageKeys, ...pdfKeys];
      const notesAdd = this.headerDataForm.get('notesAttachment').value;
      // const myObject = {
      //   pdfKeys: [],
      //   imageKeys: []
      // };
      // for (const url of newAttachments) {
      //   if (
      //     url.endsWith('.png') ||
      //     url.endsWith('.jpeg') ||
      //     url.endsWith('.jpg')
      //   ) {
      //     myObject.imageKeys.push(url);
      //   } else if (url.endsWith('.pdf')) {
      //     myObject.pdfKeys.push(url);
      //   }
      // }

      // console.log('myobjectdata', myObject);

      // this.headerDataForm.get('attachments').setValue(myObject);

      const instructions = {
        notes: '',
        attachments: '',
        pdfDocs: ''
      };
      console.log(typeof instructions);
      // for (const url of newAttachments) {
      //   if (
      //     url.endsWith('.png') ||
      //     url.endsWith('.jpeg') ||
      //     url.endsWith('.jpg')
      //   ) {
      //     instructions.attachments += url;
      //   } else if (url.endsWith('.pdf')) {
      //     instructions.pdfDocs += url;
      //   }
      // }

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
      console.log('instructions', instructions);
      this.headerDataForm.get('notesAttachment').setValue(notesAdd);
      console.log('instruction notes', instructions.notes);
      this.headerDataForm.get('instructions').setValue(instructions);

      console.log('this.headerdataform', this.headerDataForm.value);

      // extractKeys(objects, extension): string[]{
      //   return objects
      //     .map((object) => object.objectKey.substring(7))
      //     .filter((key) => key.endsWith(extension));
      // }

      // const attachments = this.headerDataForm.get('attachments').value;
      // const pdfs = attachments?.pdf || [];
      // const images = attachments?.images || [];

      // const pdfKeys = extractKeys(pdfs, '.pdf');
      // const imageKeys = extractKeys(images, '.png');

      // const myObject = {
      //   pdfKeys: pdfKeys,
      //   imageKeys: imageKeys
      // };

      console.log('attachmentsofform', this.headerDataForm.value);
      this.store.dispatch(
        RoundPlanConfigurationActions.createRoundPlan({
          formMetadata: {
            ...this.headerDataForm.value,
            pdfTemplateConfiguration: DEFAULT_PDF_BUILDER_CONFIG,
            author: userName,
            formLogo: 'assets/img/svg/round-plans-icon.svg'
          }
        })
      );
      console.log('instructions', instructions);
      console.log('data', this.headerDataForm.value);

      this.router.navigate(['/operator-rounds/create']);
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
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

    this.roundPlanConfigurationService.uploadToS3$(file).subscribe((event) => {
      const value: RoundPlanFile = {
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
      console.log(originalValue, 'originalvalue');
    });
  }

  roundplanFileUploadHandler = (event: Event) => {
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

    console.log('slideshowimage', slideshowImages);
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

  roundPlanFileDeleteHandler(index: number): void {
    const attachments = this.headerDataForm.get('instructions').value;
    console.log(attachments);
    if (attachments) {
      this.roundPlanConfigurationService.deleteFromS3(
        attachments.images.objectKey
      );

      attachments.images.splice(index, 1);
      // } else {
      //   console.log('Hi');
      //   this.roundPlanConfigurationService.deleteFromS3(
      //     attachments.pdf.objectKey
      //   );

      //   attachments.pdf.splice(index, 1);
      // }
      // console.log('new-attachments', attachments);
      this.headerDataForm.get('instructions').setValue(attachments);
    }
  }

  roundPlanPdfDeleteHandler(index: number): void {
    const attachments = this.headerDataForm.get('instructions').value;
    if (attachments) {
      this.roundPlanConfigurationService.deleteFromS3(
        attachments.pdf.objectKey
      );

      attachments.pdf.splice(index, 1);

      console.log('new-attachments', attachments);
      this.headerDataForm.get('instructions').setValue(attachments);
    }
  }
  // roundPlanFileDeleteHandler(event): void {
  //   const attachments = this.headerDataForm.get('attachments').value;
  //   const { type } = attachments;

  //   const index = attachments.images.findIndex(() => index);
  //   console.log(index);

  //   console.log('Deleting images', attachments);

  //   if (type === 'image') {
  //     const objectKey = attachments.images[index].objectKey;
  //     this.roundPlanConfigurationService.deleteFromS3(objectKey);

  //     attachments.images.splice(index, 1);
  //   }

  //   if (type === 'pdf') {
  //     const objectKey = attachments.pdf[index].objectKey;
  //     this.roundPlanConfigurationService.deleteFromS3(objectKey);

  //     attachments.pdf.splice(index, 1);
  //   }

  //   this.headerDataForm.get('attachments').setValue(attachments);
  // }

  // roundPlanFileDeleteHandler(index: number): void {
  //   const attachments = this.headerDataForm.get('attachments').value;
  //   if (attachments.image) {
  //     this.roundPlanConfigurationService.deleteFromS3(
  //       attachments.images[index].objectKey
  //     );
  //     attachments.images[index] = null;
  //     attachments.images = this.imagesArrayRemoveNullGaps(attachments.images);
  //   } else {
  //     this.roundPlanConfigurationService.deleteFromS3(
  //       attachments.pdf[index].objectKey
  //     );
  //     attachments.pdf = null;
  //   }
  //   this.headerDataForm.get('attachments').setValue(attachments);
  // }

  // imagesArrayRemoveNullGaps(images: Array<any>): Array<any> {
  //   const nonNullImages = images.filter((image) => image !== null);
  //   return nonNullImages.concat(new Array(nonNullImages.length).fill(null));
  // }
}
