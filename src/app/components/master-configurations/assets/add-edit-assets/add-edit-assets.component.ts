import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { ValidationError } from 'src/app/interfaces';
import { LocationService } from '../../locations/services/location.service';
import { AssetsService } from '../services/assets.service';

@Component({
  selector: 'app-add-edit-assets',
  templateUrl: './add-edit-assets.component.html',
  styleUrls: ['./add-edit-assets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditAssetsComponent implements OnInit, OnChanges {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() createdAssetsData: EventEmitter<any> = new EventEmitter();
  @Input() set assetsEditData(data) {
    this.assEditData = data;
    if (this.assEditData === undefined) {
      this.assetStatus = 'add';
      this.assetTitle = 'Create Asset';
      this.assetButton = 'Create';
    } else {
      this.assetStatus = 'edit';
      this.assetTitle = 'Edit Asset';
      this.assetButton = 'Update';
      this.assetImage = this.assEditData.image;
      const assdata = {
        id: this.assEditData.id,
        image: this.assEditData.image,
        name: this.assEditData.name,
        assetsId: this.assEditData.assetsId,
        model: this.assEditData.model,
        description: this.assEditData.description,
        parentType: this.assEditData.parentType,
        parentId: this.assEditData.parentId
      };
      this.assetForm.patchValue(assdata);
    }
    if (
      this.assEditData === undefined ||
      this.assEditData.parentType === 'location'
    ) {
      this.getAllLocations();
    } else if (this.assEditData.parentType === 'asset') {
      this.getAllAssets();
    }
  }
  get assetsEditData() {
    return this.assEditData;
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
  private assEditData;

  constructor(
    private fb: FormBuilder,
    private assetService: AssetsService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.assetForm = this.fb.group({
      id: '',
      image: '',
      name: new FormControl('', [Validators.required]),
      assetsId: new FormControl('', [Validators.required]),
      model: '',
      description: '',
      parentType: 'location',
      parentId: ''
    });
  }

  ngOnChanges() {
    if (this.assetForm?.get('parentType').value === 'location') {
      this.getAllLocations();
    } else if (this.assetForm?.get('parentType').value === 'asset') {
      this.getAllAssets();
    }
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
        this.slideInOut.emit('out');
      });
    } else if (this.assetStatus === 'edit') {
      const updateData = {
        data: this.assetForm.value,
        version: this.assEditData._version
      };
      console.log(updateData);
      this.assetService.updateAssets$(updateData).subscribe((res) => {
        console.log(res);
        this.createdAssetsData.emit({
          status: this.assetStatus,
          data: res
        });
        this.assetForm.reset();
        this.slideInOut.emit('out');
      });
    }
  }

  onKey(value) {
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
  }

  getAllLocations() {
    this.locationService.fetchAllLocations$().then((allLocations) => {
      console.log(allLocations);
      this.parentInformation = allLocations.items;
      this.allParentsData = this.parentInformation;
    });
  }

  getAllAssets() {
    this.assetService.fetchAllAssets$().then((allAssets) => {
      console.log(allAssets);
      this.parentInformation = allAssets.items;
      this.allParentsData = this.parentInformation;
      console.log(this.parentInformation);
      console.log(this.allParentsData);
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
