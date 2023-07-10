/* eslint-disable no-underscore-dangle */
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  OnDestroy
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
import { ShiftService } from '../../shifts/services/shift.service';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ShiftOverlapModalComponent } from '../shift-overlap-modal/shift-overlap-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-plant',
  templateUrl: './add-edit-plant.component.html',
  styleUrls: ['./add-edit-plant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditPlantComponent implements OnInit, OnDestroy {
  @ViewChild('countryInputSearch', { static: false })
  countryInputSearch: ElementRef;
  @ViewChild('stateInputSearch', { static: false })
  stateInputSearch: ElementRef;
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() createdPlantData: EventEmitter<any> = new EventEmitter();
  @Input() set plantEditData(data) {
    this.plantsEditData = data;
    this.selectedShiftsDetails = [];
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

      this.selectedShiftIDs = this.plantEditData?.shifts?.map(
        (shift) => shift.id
      );
      this.selectedShiftIDs?.forEach((id) => {
        const index = this.allShiftsMaster.findIndex((sm) => sm.id === id);
        if (index > -1) {
          this.selectedShiftsDetails.push(this.allShiftsMaster[index]);
        }
      });

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
        timeZone: this.plantEditData?.timeZone,
        shifts: this.selectedShiftIDs
      };

      this.plantForm?.patchValue(plantdata);
      this.plantForm?.get('plantId').disable();
    }
  }
  get plantEditData() {
    return this.plantsEditData;
  }
  plantMapSubscription: Subscription;
  countrySearch: any;
  selectedCountry: any;
  countryAllStates: any = [];
  countryAllTimeZones: any = [];
  states: any = [];
  timeZones: any = [];
  noState = false;
  plantMasterData = {};
  allCountries = [];
  countryData = [];
  selectedShiftIDs: any[];
  selectedShiftsDetails = [];
  allShiftsMaster: any[];
  errors: ValidationError = {};
  plantStatus;
  plantTitle;
  plantButton;
  plantImage = '';
  plantForm: FormGroup;
  parentInformation;
  allParentsData;

  activeShifts$: Observable<any>;
  private plantsEditData;
  constructor(
    private fb: FormBuilder,
    private plantService: PlantService,
    private shiftService: ShiftService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.plantMapSubscription = this.plantService.plantMasterData$.subscribe(
      (res) => {
        this.plantMasterData = res;
        this.allCountries = Object.values(this.plantMasterData);
        this.countryData = this.allCountries;
      }
    );
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
      shifts: new FormControl('', []),
      label: '',
      field: ''
    });
    this.plantForm.get('state').disable();
    this.plantForm.get('timeZone').disable();
    this.plantForm.get('country').valueChanges.subscribe((countryCode) => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.plantForm.patchValue({ state: null, timeZone: null });
      if (countryCode) {
        this.selectedCountry = this.plantMasterData[countryCode];
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

    this.activeShifts$ = this.shiftService
      .getShiftsList$(
        {
          next: '',
          limit: 100000,
          searchKey: '',
          fetchType: 'load'
        },
        { isActive: 'true' }
      )
      .pipe(
        map(({ rows }) => {
          this.allShiftsMaster = rows;
          return rows;
        }),
        catchError(() => of([]))
      );
  }

  shiftSelectionChanged(event) {
    this.selectedShiftIDs = event.value;
    this.selectedShiftsDetails = [];
    this.selectedShiftIDs?.forEach((id) => {
      const index = this.allShiftsMaster.findIndex((sm) => sm.id === id);
      if (index > -1) {
        this.selectedShiftsDetails.push(this.allShiftsMaster[index]);
      }
    });
    this.plantForm?.patchValue({ shifts: this.selectedShiftIDs });
  }

  create() {
    const selectedShifts = [];
    if (
      this.plantForm.get('shifts').value !== null &&
      this.plantForm.get('shifts').value !== ''
    ) {
      const selectedShiftIdsTemp = this.plantForm.get('shifts').value;
      const selectedShiftDetailsTemp = [];
      selectedShiftIdsTemp.forEach((sid) => {
        const index = this.allShiftsMaster.findIndex((sm) => sm.id === sid);
        if (index > -1) {
          selectedShiftDetailsTemp.push(this.allShiftsMaster[index]);
        }
      });
      selectedShiftDetailsTemp.forEach((e) => {
        selectedShifts.push({ start: e.startTime, end: e.endTime });
      });
    }
    const isOverlapping = this.isOverlapping(selectedShifts);
    if (isOverlapping) {
      this.dialog.open(ShiftOverlapModalComponent);
    } else {
      if (this.plantStatus === 'add') {
        this.plantForm.get('image').setValue('');
        const { id, ...payload } = this.plantForm.value;
        const selectedShiftDetailsTemp = [];
        payload?.shifts?.forEach((sid) => {
          const index = this.allShiftsMaster.findIndex((sm) => sm.id === sid);
          if (index > -1) {
            selectedShiftDetailsTemp.push(this.allShiftsMaster[index]);
          }
        });
        const shiftsStr = JSON.stringify(selectedShiftDetailsTemp);
        this.plantService
          .createPlant$({ ...payload, shifts: shiftsStr })
          .subscribe((res) => {
            this.createdPlantData.emit({
              status: this.plantStatus,
              data: res
            });
            this.plantForm.reset();
            this.slideInOut.emit('out');
            this.plantForm.get('state').disable();
            this.plantForm.get('timeZone').disable();
            this.clearSearchInputs();
            this.noState = false;
          });
      } else if (this.plantStatus === 'edit') {
        const payload = this.plantForm.getRawValue();
        const selectedShiftDetailsTemp = [];
        payload?.shifts.forEach((sid) => {
          const index = this.allShiftsMaster.findIndex((sm) => sm.id === sid);
          if (index > -1) {
            selectedShiftDetailsTemp.push(this.allShiftsMaster[index]);
          }
        });
        const shiftsStr = JSON.stringify(selectedShiftDetailsTemp);

        this.plantService
          .updatePlant$({
            ...payload,
            shifts: shiftsStr,
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
            this.clearSearchInputs();
            this.noState = false;
          });
      }
    }
  }
  cancel() {
    this.plantForm.reset();
    this.slideInOut.emit('out');
    this.plantForm.get('state').disable();
    this.plantForm.get('timeZone').disable();
    this.clearSearchInputs();
    this.noState = false;
  }

  onKeyCountry(event: any) {
    const value = event.target.value || '';
    if (value) {
      this.countryData = this.searchCountry(value);
    } else {
      this.countryData = Object.values(this.plantMasterData);
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
    return Object.values(this.plantMasterData).filter(
      (country: any) =>
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
    this.countryData = Object.values(this.plantMasterData);
  }
  onStateClosed() {
    this.states = this.countryAllStates;
  }

  clearSearchInputs() {
    this.countryInputSearch.nativeElement.value = '';
    this.stateInputSearch.nativeElement.value = '';
  }

  overlapping = (a, b) => {
    const getMinutes = (s) => {
      const p = s.split(':').map(Number);
      return p[0] * 60 + p[1];
    };
    return (
      getMinutes(a.end) > getMinutes(b.start) &&
      getMinutes(b.end) > getMinutes(a.start)
    );
  };

  isOverlapping = (arr) => {
    const filteredShifts = [];
    arr.forEach((e) => {
      if (e.start > e.end) {
        const TS1 = {
          start: e.start,
          end: '24:00'
        };
        const TS2 = {
          start: '01:00',
          end: e.end
        };
        filteredShifts.push(TS1);
        filteredShifts.push(TS2);
      } else {
        filteredShifts.push(e);
      }
    });
    for (let i = 0; i < filteredShifts.length - 1; i++) {
      for (let j = i + 1; j < filteredShifts.length; j++) {
        if (this.overlapping(filteredShifts[i], filteredShifts[j])) {
          return true;
        }
      }
    }
    return false;
  };
  ngOnDestroy() {
    this.plantMapSubscription.unsubscribe();
  }
}
