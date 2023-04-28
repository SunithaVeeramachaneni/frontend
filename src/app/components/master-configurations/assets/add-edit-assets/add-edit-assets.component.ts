/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
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
import { ValidationError } from 'src/app/interfaces';
import { LocationService } from '../../locations/services/location.service';
import { AssetsService } from '../services/assets.service';
import { PlantService } from '../../plants/services/plant.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';

@Component({
  selector: 'app-add-edit-assets',
  templateUrl: './add-edit-assets.component.html',
  styleUrls: ['./add-edit-assets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditAssetsComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() createdAssetsData: EventEmitter<any> = new EventEmitter();
  allLocations$: Observable<any>;
  private assetEditData = null;
  allLocationsData: any = [];
  allAssetsData: any = [];
  parentType: any = 'location';
  @Input() set assetsEditData(data) {
    this.assetEditData = data || null;
    if (this.assetEditData === null) {
      this.assetStatus = 'add';
      this.assetTitle = 'Create Asset';
      this.assetButton = 'Create';
      this.assetImage = '';
      this.assetForm?.reset();
      this.assetForm?.get('parentType').setValue('location');
    } else {
      this.assetStatus = 'edit';
      this.assetTitle = 'Edit Asset';
      this.assetButton = 'Update';
      this.assetImage = this.assetEditData.image;
      const assetData = {
        id: this.assetEditData?.id,
        image: this.assetEditData?.image,
        name: this.assetEditData?.name,
        assetsId: this.assetEditData?.assetsId,
        model: this.assetEditData?.model,
        description: this.assetEditData?.description,
        parentType:
          this.assetEditData.parentType === 'LOCATION' ? 'location' : 'asset',
        parentId: this.assetEditData?.parentId,
        plantsID: this.assetEditData?.plantsID
      };
      this.parentType = this.assetEditData.parentType?.toLowerCase();
      this.assetForm?.patchValue(assetData);
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
  plantInformation;
  allParentsData;
  allPlantsData;

  constructor(
    private fb: FormBuilder,
    private plantService: PlantService,
    private assetService: AssetsService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.assetForm = this.fb.group({
      image: '',
      name: new FormControl('', [
        Validators.required,
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ]),
      assetsId: new FormControl('', [
        Validators.required,
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ]),
      model: '',
      description: '',
      parentType: 'location',
      parentId: '',
      locationId: '',
      plantsID: new FormControl('', [Validators.required])
    });
    this.getAllLocations();
    this.getAllAssets();
    this.getAllPlants();
    this.assetForm.get('parentType').valueChanges.subscribe((value) => {
      this.parentType = value;
    });
  }

  onSelectPlant(plantId) {
    const parentId = this.assetForm.get('parentId').value;
    const parentType = this.assetForm.get('parentType').value;

    if (parentType === 'location') {
      this.parentInformation = this.allLocationsData;
    } else if (parentType === 'asset') {
      this.parentInformation = this.allAssetsData;
    }

    if (parentId) {
      this.allParentsData = this.parentInformation;
    } else {
      this.allParentsData = this.parentInformation.filter(
        (l) => l.plantsID === plantId
      );
    }
  }

  onChangeParentType(event) {
    const parentType = event.value;
    const plantsID = this.assetForm.get('plantsID').value;

    // select parentData
    if (parentType === 'location') {
      this.parentInformation = this.allLocationsData;
    } else if (parentType === 'asset') {
      this.parentInformation = this.allAssetsData;
    }

    // if plant is selected already
    if (plantsID) {
      this.allParentsData = this.parentInformation.filter(
        (parent) => parent.plantsID === plantsID
      );
    }
  }

  onSelectLocation(parentId) {
    const plantsID = this.assetForm.get('plantsID').value;
    const parentType = this.assetForm.get('parentType').value;

    if (parentType === 'location') {
      this.assetForm.get('locationId').setValue(parentId);
      this.parentInformation = this.allLocationsData;
    } else if (parentType === 'asset') {
      this.parentInformation = this.allAssetsData;
    }
    if (!plantsID) {
      // set plant value if plant field was not selected first
      const parent = this.parentInformation.find((d) => d.id === parentId);
      if (parent.plantsID) {
        this.assetForm.get('plantsID').setValue(parent.plantsID);
      }
    }
  }

  create() {
    if (this.assetStatus === 'add') {
      this.assetForm.get('image').setValue('');
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

  onKeyPlant(event) {
    const value = event.target.value || '';
    if (!value) {
      this.allPlantsData = this.plantInformation;
    } else {
      this.allPlantsData = this.searchPlant(value);
    }
  }

  onKey(event) {
    const value = event.target.value || '';
    if (!value) {
      const plantsID = this.assetForm.get('plantsID').value;
      this.allParentsData = this.parentInformation.filter(
        (l) => l.plantsID === plantsID
      );
    } else {
      this.allParentsData = this.searchParent(value);
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

  searchParent(value: string) {
    const plantsID = this.assetForm.get('plantsID').value;
    const parentType = this.assetForm.get('parentType').value;
    const searchValue = value.toLowerCase();

    if (parentType === 'location') {
      if (plantsID) {
        return this.allParentsData.filter(
          (parent) =>
            (parent.name &&
              parent.name.toLowerCase().indexOf(searchValue) !== -1) ||
            (parent.locationId &&
              parent.locationId.toLowerCase().indexOf(searchValue) !== -1)
        );
      } else {
        return this.parentInformation.filter(
          (parent) =>
            (parent.name &&
              parent.name.toLowerCase().indexOf(searchValue) !== -1) ||
            (parent.locationId &&
              parent.locationId.toLowerCase().indexOf(searchValue) !== -1)
        );
      }
    } else {
      if (plantsID) {
        return this.allParentsData.filter(
          (parent) =>
            (parent.name &&
              parent.name.toLowerCase().indexOf(searchValue) !== -1) ||
            (parent.assetsId &&
              parent.assetsId.toLowerCase().indexOf(searchValue) !== -1)
        );
      } else {
        return this.parentInformation.filter(
          (parent) =>
            (parent.name &&
              parent.name.toLowerCase().indexOf(searchValue) !== -1) ||
            (parent.assetsId &&
              parent.assetsId.toLowerCase().indexOf(searchValue) !== -1)
        );
      }
    }
  }

  cancel() {
    this.slideInOut.emit('out');
    this.assetForm?.get('parentType').setValue('location');
    this.allParentsData = this.allLocationsData;
  }

  getAllLocations() {
    this.locationService.fetchAllLocations$().subscribe((allLocations) => {
      this.allLocationsData = allLocations.items || [];
      this.parentInformation = this.allLocationsData;
      this.allParentsData = this.allLocationsData;
    });
  }

  getAllAssets() {
    this.assetService.fetchAllAssets$().subscribe((allAssets) => {
      if (allAssets.items) {
        this.allAssetsData = allAssets.items.filter(
          (asset) => asset.id !== this.assetEditData?.id && !asset._deleted
        );
        this.parentInformation = this.allAssetsData;
        this.allParentsData = this.allAssetsData;
      } else {
        this.allAssetsData = [];
        this.parentInformation = [];
        this.allParentsData = [];
      }
    });
  }

  getAllPlants() {
    this.plantService.fetchAllPlants$().subscribe((allPlants) => {
      this.allPlantsData = allPlants.items || [];
      this.plantInformation = allPlants.items || [];
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
