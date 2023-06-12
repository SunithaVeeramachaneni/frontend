import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { ValidationError } from 'src/app/interfaces';
import { PlantService } from '../services/plant.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { countriesMasterData } from './countriesMasterData.mock';

@Component({
  selector: 'app-add-edit-plant',
  templateUrl: './add-edit-plant.component.html',
  styleUrls: ['./add-edit-plant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditPlantComponent implements OnInit {
  @ViewChild('countryInputSearch', { static: false })
  countryInputSearch: ElementRef;
  @ViewChild('stateInputSearch', { static: false })
  stateInputSearch: ElementRef;
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() createdPlantData: EventEmitter<any> = new EventEmitter();
  @Input() set plantEditData(data) {
    this.plantsEditData = data;
    if (this.plantsEditData === null) {
      this.plantStatus = 'add';
      this.plantTitle = 'Create Plant';
      this.plantButton = 'Create';
      this.plantImage = '';
      this.plantForm?.reset();
      this.plantForm?.get('plantId').enable();
    } else {
      this.plantStatus = 'edit';
      this.plantTitle = 'Edit Plant';
      this.plantButton = 'Update';
      this.plantImage =
        this.plantEditData && this.plantsEditData.image
          ? this.plantEditData.image
          : '';
      const plantdata = {
        id: this.plantsEditData?.id,
        image: this.plantsEditData?.image,
        name: this.plantsEditData?.name,
        plantId: this.plantsEditData?.plantId,
        country: this.plantsEditData?.country,
        state: this.plantsEditData?.state,
        zipCode: this.plantsEditData?.zipCode,
        label: this.plantEditData?.label,
        field: this.plantEditData?.field,
        timeZone: this.plantEditData?.timeZone
      };
      this.plantForm?.patchValue(plantdata);
      this.plantForm?.get('plantId').disable();
    }
  }
  get plantEditData() {
    return this.plantsEditData;
  }
  countrySearch: any;
  stateDropDownHidden = true;
  timeZoneDropDownHidden = true;
  selectedCountry: any;
  countryAllStates: any = [];
  countryAllTimeZones: any = [];
  states: any = [];
  timeZones: any = [];
  noState = false;
  allCountries = Object.values(countriesMasterData);
  countryData = [];
  errors: ValidationError = {};
  plantStatus;
  plantTitle;
  plantButton;
  plantImage = '';
  plantForm: FormGroup;
  parentInformation;
  allParentsData;
  private plantsEditData;
  constructor(private fb: FormBuilder, private plantService: PlantService) {}

  ngOnInit(): void {
    this.countryData = this.allCountries;
    const regex = '^[A-Za-z0-9 ]*$';
    this.plantForm = this.fb.group({
      id: '',
      image: '',
      name: new FormControl('', [
        Validators.required,
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ]),
      plantId: new FormControl('', [
        Validators.required,
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ]),
      country: new FormControl('', [
        Validators.required,
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ]),
      zipCode: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(6),
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace,
        Validators.pattern(regex)
      ]),
      state: new FormControl('', [
        Validators.required,
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ]),
      timeZone: new FormControl('', [Validators.required]),
      label: '',
      field: ''
    });
    this.plantForm.get('state').disable();
    this.plantForm.get('timeZone').disable();
    this.plantForm
      .get('country')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((countryCode) => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.plantForm.patchValue({ state: null, timeZone: null });
        if (countryCode) {
          this.selectedCountry = countriesMasterData[countryCode];
          if (!this.selectedCountry.states.length) {
            this.plantForm.get('state').disable();
            this.noState = true;
          } else {
            this.plantForm.get('state').enable();
            this.noState = false;
          }
          [this.states, this.countryAllStates] = [
            this.selectedCountry.states,
            this.selectedCountry.states
          ];
          [this.timeZones, this.countryAllTimeZones] = [
            this.selectedCountry.timeZones,
            this.selectedCountry.timeZones
          ];
          this.plantForm.get('timeZone').enable();
        }
      });
  }

  create() {
    if (this.plantStatus === 'add') {
      this.plantForm.get('image').setValue('');
      const { id, ...payload } = this.plantForm.value;
      this.plantService.createPlant$(payload).subscribe((res) => {
        this.createdPlantData.emit({
          status: this.plantStatus,
          data: res
        });
        this.plantForm.reset();
        this.slideInOut.emit('out');
        this.plantForm.get('state').disable();
        this.plantForm.get('timeZone').disable();
        this.clearCountryInput();
        this.clearStateInput();
      });
    } else if (this.plantStatus === 'edit') {
      this.plantService
        .updatePlant$({
          ...this.plantForm.getRawValue(),
          // eslint-disable-next-line no-underscore-dangle
          _version: this.plantsEditData._version,
          id: this.plantsEditData?.id
        })
        .subscribe((res) => {
          this.createdPlantData.emit({
            status: this.plantStatus,
            data: res
          });
          this.plantForm.reset();
          this.slideInOut.emit('out');
          this.plantForm.get('state').disable();
          this.plantForm.get('timeZone').disable();
          this.clearCountryInput();
          this.clearStateInput();
        });
    }
  }
  cancel() {
    this.plantForm.reset();
    this.slideInOut.emit('out');
    this.plantForm.get('state').disable();
    this.plantForm.get('timeZone').disable();
    this.clearCountryInput();
    this.clearStateInput();
    this.noState = false;
  }

  onKeyCountry(event: any) {
    const value = event.target.value || '';
    if (value) {
      this.countryData = this.searchCountry(value);
    } else {
      this.countryData = Object.values(countriesMasterData);
    }
  }

  onKeyState(event: any) {
    const value = event.target.value || '';
    if (value) {
      this.states = this.searchStates(value);
    } else {
      this.states = this.countryAllStates;
    }
  }

  searchCountry(value: string) {
    const searchValue = value.toLowerCase();
    return Object.values(countriesMasterData).filter(
      (country) =>
        (country.countryCode &&
          country.countryCode.toLowerCase().indexOf(searchValue) !== -1) ||
        (country.countryName &&
          country.countryName.toLowerCase().indexOf(searchValue) !== -1)
    );
  }

  searchStates(value: string) {
    const searchValue = value.toLowerCase();
    if (searchValue) {
      return this.countryAllStates.filter(
        (state: any) => state && state.toLowerCase().indexOf(searchValue) !== -1
      );
    }
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.plantForm.get(controlName).touched;
    const errors = this.plantForm.get(controlName).errors;
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

  compareTimeZones(o1: any, o2: any): boolean {
    if (!o1 || !o2) return false;
    return (
      o1.utcOffset === o2.utcOffset &&
      o1.description === o2.description &&
      o1.timeZoneIdentifier === o2.timeZoneIdentifier
    );
  }
  onCountryClosed() {
    this.countryData = Object.values(countriesMasterData);
  }
  onStateClosed() {
    this.states = this.countryAllStates;
  }
  clearCountryInput() {
    const input = this.countryInputSearch.nativeElement;
    input.value = '';
  }
  clearStateInput() {
    const input = this.stateInputSearch.nativeElement;
    input.value = '';
  }
}
