/* eslint-disable no-underscore-dangle */
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
import { LocationService } from '../services/location.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { FormValidationUtil } from 'src/app/shared/utils/formValidationUtil';

@Component({
  selector: 'app-add-edit-location',
  templateUrl: './add-edit-location.component.html',
  styleUrls: ['./add-edit-location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditLocationComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() createdLocationData: EventEmitter<any> = new EventEmitter();
  @Input() allPlants: any[];
  @Input() set allLocations(locations) {
    this._locations = locations.data;
    this.parentInformation = this._locations;
  }

  get allLocations() {
    return this._locations;
  }

  @Input() set locationEditData(data) {
    this.locEditData = data;
    if (!this.locEditData) {
      this.locationStatus = 'add';
      this.locationTitle = 'Create Location';
      this.locationButton = 'Create';
      this.locationImage = '';
      this.locationForm?.reset();
    } else {
      this.locationStatus = 'edit';
      this.locationTitle = 'Edit Location';
      this.locationButton = 'Update';
      this.locationImage =
        this.locEditData && this.locEditData.image
          ? this.locEditData.image
          : '';
      const locdata = {
        id: this.locEditData?.id,
        image: this.locEditData?.image,
        name: this.locEditData?.name,
        locationId: this.locEditData?.locationId,
        model: this.locEditData?.model,
        description: this.locEditData?.description,
        parentId: this.locEditData?.parentId,
        plantsID: this.locEditData?.plantsID
      };
      this.locationForm?.patchValue(locdata);
    }
  }
  get locationEditData() {
    return this.locEditData;
  }

  errors: ValidationError = {};
  locationForm: FormGroup;
  locations$: Observable<any>;
  locationStatus;
  locationTitle;
  locationImage = '';
  locationButton;

  parentInformation;
  plantInformation;
  allParentsData;
  allPlantsData;
  private locEditData;
  private _locations;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private formValidationUtil: FormValidationUtil
  ) {}

  ngOnInit(): void {
    this.locationForm = this.fb.group({
      image: '',
      name: new FormControl('', [
        Validators.required,
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ]),
      locationId: new FormControl('', [
        Validators.required,
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ]),
      model: '',
      description: new FormControl('', [WhiteSpaceValidator.trimWhiteSpace]),
      parentId: '',
      plantsID: new FormControl('', [Validators.required])
    });
    this.parentInformation = this.allLocations;
    this.allParentsData = this.parentInformation;
    this.plantInformation = this.allPlants;
    this.allPlantsData = this.plantInformation;
  }

  onSelectPlant(event) {
    const parentId = this.locationForm.get('parentId').value;

    if (parentId) {
      this.allParentsData = this.parentInformation;
    } else {
      this.allParentsData = this.parentInformation.filter(
        (l) => l.plantsID === event
      );
    }
  }

  onSelectLocation(event) {
    const plantsID = this.locationForm.get('plantsID').value;

    if (plantsID) {
      this.allParentsData = this.parentInformation.filter(
        (l) => l.plantsID === plantsID
      );
    } else {
      // set plant value if plant field was not selected first
      this.allParentsData = this.parentInformation;
      const location = this.allParentsData.find((d) => d.id === event);
      if (location.plantsID) {
        this.locationForm.get('plantsID').setValue(location.plantsID);
      }
    }
  }

  create() {
    if (this.locationStatus === 'add') {
      this.locationForm.get('image').setValue('');
      this.locationService
        .createLocation$(this.locationForm.value)
        .subscribe((res) => {
          this.createdLocationData.emit({
            status: this.locationStatus,
            data: res
          });
          this.locationForm.reset();
          this.slideInOut.emit('out');
        });
    } else if (this.locationStatus === 'edit') {
      this.locationService
        .updateLocation$({
          ...this.locationForm.value,
          _version: this.locEditData._version,
          id: this.locEditData?.id
        })
        .subscribe((res) => {
          this.createdLocationData.emit({
            status: this.locationStatus,
            data: res
          });
          this.locationForm.reset();
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
      const plantsID = this.locationForm.get('plantsID').value;
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
    const plantsID = this.locationForm.get('plantsID').value;

    const searchValue = value.toLowerCase();
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
  }

  cancel() {
    this.locationForm.reset();
    this.slideInOut.emit('out');
    this.allParentsData = this.parentInformation;
  }

  processValidationErrors(controlName: string): boolean {
    return this.formValidationUtil.processValidationErrors(
      controlName,
      this.locationForm,
      this.errors
    );
  }
}
