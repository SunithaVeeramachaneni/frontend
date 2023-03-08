import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import { ListLocationsQuery } from 'src/app/API.service';
import { ValidationError } from 'src/app/interfaces';
import { LocationService } from '../../locations/services/location.service';
import { AssetsService } from '../services/assets.service';

@Component({
  selector: 'app-add-edit-assets',
  templateUrl: './add-edit-assets.component.html',
  styleUrls: ['./add-edit-assets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditAssetsComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() createdAssetsData: EventEmitter<any> = new EventEmitter();
  allLocations$: Observable<ListLocationsQuery>;
  private assetEditData = null;
  @Input() set assetsEditData(data) {
    this.assetEditData = data || null;
    if (this.assetEditData === null) {
      this.assetStatus = 'add';
      this.assetTitle = 'Create Asset';
      this.assetButton = 'Create';
      this.assetForm?.get('parentType').setValue('location');
    } else {
      this.assetStatus = 'edit';
      this.assetTitle = 'Edit Asset';
      this.assetButton = 'Update';
      this.assetImage = this.assetEditData.image;
      const assdata = {
        id: this.assetEditData.id,
        image: this.assetEditData.image,
        name: this.assetEditData.name,
        assetsId: this.assetEditData.assetsId,
        model: this.assetEditData.model,
        description: this.assetEditData.description,
        parentType: this.assetEditData.parentType,
        parentId: this.assetEditData.parentId
      };
      this.assetForm.patchValue(assdata);
    }
    if (
      this.assetEditData === null ||
      this.assetEditData.parentType === 'location'
    ) {
      this.getAllLocations();
    } else if (this.assetEditData.parentType === 'asset') {
      this.getAllAssets();
    }
  }
  get assetsEditData() {
    return this.assetEditData;
  }
  errors: ValidationError = {};
  assetForm: FormGroup;

  assetStatus;
  assetTitle;
  assetImage = '';
  assetButton;

  locations$;
  assets$;
  parentInformation;
  allParentsData;

  constructor(
    private fb: FormBuilder,
    private assetService: AssetsService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.assetForm = this.fb.group({
      image: '',
      name: new FormControl('', [Validators.required]),
      assetsId: new FormControl('', [Validators.required]),
      model: '',
      description: '',
      parentType: 'location',
      parentId: ''
    });

    this.assetForm.get('parentType').valueChanges.subscribe((value) => {
      this.assetForm.get('parentId').setValue('');
      if (value === 'location') {
        this.getAllLocations();
      } else if (value === 'asset') {
        this.getAllAssets();
      }
    });
  }

  create() {
    if (this.assetStatus === 'add') {
      this.assetForm
        .get('image')
        .setValue('assets/master-configurations/default-asset.png');
      this.assetService.createAssets$(this.assetForm.value).subscribe((res) => {
        this.createdAssetsData.emit({
          status: this.assetStatus,
          data: res
        });
        this.assetForm.reset();
        this.assetForm?.get('parentType').setValue('location');
        this.slideInOut.emit('out');
      });
    } else if (this.assetStatus === 'edit') {
      this.assetService
        .updateAssets$({
          ...this.assetForm.value,
          _version: this.assetEditData._version,
          id: this.assetEditData?.id
        })
        .subscribe((res) => {
          this.createdAssetsData.emit({
            status: this.assetStatus,
            data: res
          });
          this.assetForm.reset();
          this.assetForm?.get('parentType').setValue('location');
          this.slideInOut.emit('out');
        });
    }
  }

  onKey(event) {
    const value = event.target.value || '';
    this.allParentsData = this.search(value);
  }

  search(value: string) {
    const searchValue = value.toLowerCase();
    return this.parentInformation.filter((parent) =>
      parent.name.toLowerCase().startsWith(searchValue)
    );
  }

  cancel() {
    this.slideInOut.emit('out');
    this.assetForm.reset();
    this.assetForm?.get('parentType').setValue('location');
  }

  getAllLocations() {
    this.locationService.fetchAllLocations$().subscribe((allLocations) => {
      this.parentInformation = allLocations.items;
      this.allParentsData = this.parentInformation;
    });
  }

  getAllAssets() {
    this.assetService.fetchAllAssets$().subscribe((allAssets) => {
      this.parentInformation = allAssets.items.filter(
        (asset) => asset.id !== this.assetEditData?.id && !asset._deleted
      );
      this.allParentsData = this.parentInformation;
    });
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.assetForm.get(controlName).touched;
    const errors = this.assetForm.get(controlName).errors;
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
}
