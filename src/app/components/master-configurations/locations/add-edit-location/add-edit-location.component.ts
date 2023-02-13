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
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { ValidationError } from 'src/app/interfaces';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-add-edit-location',
  templateUrl: './add-edit-location.component.html',
  styleUrls: ['./add-edit-location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditLocationComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() createdLocationData: EventEmitter<any> = new EventEmitter();
  @Input() set locationEditData(data) {
    this.locEditData = data;
    if (this.locEditData === undefined) {
      this.locationStatus = 'add';
      this.locationTitle = 'Create Location';
      this.locationButton = 'Create';
    } else {
      this.locationStatus = 'edit';
      this.locationTitle = 'Edit Location';
      this.locationButton = 'Update';
      this.locationImage = this.locEditData.image;
      const locdata = {
        id: this.locEditData.id,
        image: this.locEditData.image,
        name: this.locEditData.name,
        locationId: this.locEditData.locationId,
        model: this.locEditData.model,
        description: this.locEditData.description,
        parentId: this.locEditData.parentId
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
  allParentsData;
  private locEditData;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.locationForm = this.fb.group({
      id: '',
      image: '',
      name: new FormControl('', [Validators.required]),
      locationId: new FormControl('', [Validators.required]),
      model: '',
      description: '',
      parentId: ''
    });
    this.getAllLocations();
  }

  getAllLocations() {
    this.locationService.fetchAllLocations$().then((allLocations) => {
      this.parentInformation = allLocations.items.filter(
        (loc) => loc.id !== this.locEditData?.id && loc._deleted !== true
      );
      this.allParentsData = this.parentInformation;
    });
  }

  create() {
    if (this.locationStatus === 'add') {
      this.locationForm
        .get('image')
        .setValue('assets/master-configurations/default-location.png');
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
      const updateData = {
        data: this.locationForm.value,
        version: this.locEditData._version
      };
      this.locationService.updateLocation$(updateData).subscribe((res) => {
        this.createdLocationData.emit({
          status: this.locationStatus,
          data: res
        });
        this.locationForm.reset();
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
    this.locationForm.reset();
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
