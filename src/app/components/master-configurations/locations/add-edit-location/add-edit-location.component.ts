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
import { PlantService } from '../../plants/services/plant.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';

@Component({
  selector: 'app-add-edit-location',
  templateUrl: './add-edit-location.component.html',
  styleUrls: ['./add-edit-location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditLocationComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() createdLocationData: EventEmitter<any> = new EventEmitter();
  allLocations$: Observable<any>;
  @Input() set locationEditData(data) {
    this.locEditData = data;
    if (!this.locEditData) {
      this.locationStatus = 'add';
      this.locationTitle = 'Create Location';
      this.locationButton = 'Create';
      this.locationImage = '';
    } else {
      this.locationStatus = 'edit';
      this.locationTitle = 'Edit Location';
      this.locationButton = 'Update';
      this.locationImage =
        this.locEditData && this.locEditData.image
          ? this.locEditData.image
          : '';
      const locdata = {
        id: this.locEditData.id,
        image: this.locEditData.image,
        name: this.locEditData.name,
        locationId: this.locEditData.locationId,
        model: this.locEditData.model,
        description: this.locEditData.description,
        parentId: this.locEditData.parentId,
        plantsID: this.locEditData.plantsID
      };
      this.locationForm.patchValue(locdata);
      this.getAllLocations();
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

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private plantService: PlantService
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
      description: '',
      parentId: '',
      plantsID: new FormControl('', [Validators.required])
    });
    this.getAllLocations();
    this.getAllPlants();
  }

  getAllLocations() {
    this.locationService.fetchAllLocations$().subscribe((allLocations) => {
      this.parentInformation = allLocations.items.filter(
        (location) => location.id !== this.locEditData?.id
      );
      this.allParentsData = this.parentInformation;
    });
  }

  getAllPlants() {
    this.plantService.fetchAllPlants$().subscribe((allPlants) => {
      this.allPlantsData = allPlants.items || [];
      this.plantInformation = allPlants.items || [];
    });
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
    this.allPlantsData = this.searchPlant(value);
  }

  onKey(event) {
    const value = event.target.value || '';
    this.allParentsData = this.searchParent(value);
  }

  searchPlant(value: string) {
    const searchValue = value.toLowerCase();
    return this.plantInformation.filter(
      (plant) =>
        plant.name && plant.name.toLowerCase().indexOf(searchValue) !== -1
    );
  }

  searchParent(value: string) {
    const searchValue = value.toLowerCase();
    return this.parentInformation.filter(
      (parent) =>
        (parent.name &&
          parent.name.toLowerCase().indexOf(searchValue) !== -1) ||
        (parent.locationId &&
          parent.locationId.toLowerCase().indexOf(searchValue) !== -1)
    );
  }

  cancel() {
    this.slideInOut.emit('out');
    this.allParentsData = this.parentInformation;
    this.resetForm();
  }

  resetForm() {
    if (!this.locEditData) {
      this.locationStatus = 'add';
      this.locationTitle = 'Create Location';
      this.locationButton = 'Create';
      this.locationImage = '';
    } else {
      this.locationStatus = 'edit';
      this.locationTitle = 'Edit Location';
      this.locationButton = 'Update';
      this.locationImage =
        this.locEditData && this.locEditData.image
          ? this.locEditData.image
          : '';
      const locdata = {
        id: this.locEditData.id,
        image: this.locEditData.image,
        name: this.locEditData.name,
        locationId: this.locEditData.locationId,
        model: this.locEditData.model,
        description: this.locEditData.description,
        parentId: this.locEditData.parentId
      };
    }
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.locationForm.get(controlName).touched;
    const errors = this.locationForm.get(controlName).errors;
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
