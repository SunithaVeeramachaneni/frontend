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
import { ValidationError } from 'src/app/interfaces';
import { ToastService } from 'src/app/shared/toast';
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
    }
  }
  get locationEditData() {
    return this.locEditData;
  }
  errors: ValidationError = {};
  locationForm: FormGroup;

  locationStatus;
  locationTitle;
  locationImage = '';
  locationButton;

  parentInformation = [
    { name: 'parent 1' },
    { name: 'parent 2' },
    { name: 'parent 3' },
    { name: 'parent 4' },
    { name: 'parent 5' },
    { name: 'parent 6' },
    { name: 'parent 7' },
    { name: 'parent 8' },
    { name: 'parent 9' },
    { name: 'parent 10' },
    { name: 'ABC' },
    { name: 'ABCDEF' }
  ];
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
    this.allParentsData = this.parentInformation;
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
    console.log(value);
    this.allParentsData = this.search(value);
  }

  search(value: string) {
    const filter = value.toLowerCase();
    return this.parentInformation.filter((parent) =>
      parent.name.toLowerCase().startsWith(filter)
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
