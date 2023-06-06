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
import { ValidationError } from 'src/app/interfaces';
import { PlantService } from '../services/plant.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { ShiftService } from '../../shifts/services/shift.service';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit-plant',
  templateUrl: './add-edit-plant.component.html',
  styleUrls: ['./add-edit-plant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditPlantComponent implements OnInit {
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
        field: this.plantEditData?.field
      };
      this.plantForm?.patchValue(plantdata);
      this.plantForm?.get('plantId').disable();
    }
  }
  get plantEditData() {
    return this.plantsEditData;
  }
  errors: ValidationError = {};
  plantStatus;
  plantTitle;
  plantButton;
  plantImage = '';
  plantForm: FormGroup;
  parentInformation;
  allParentsData;
  activeShiftsMaster = [
    {
      name: 'Shift A',
      startTime: '10:00 AM',
      endTime: '12:00PM'
    },
    {
      name: 'Shift B',
      startTime: '12:00 PM',
      endTime: '2:00PM'
    },
    {
      name: 'Shift C',
      startTime: '2:00 PM',
      endTime: '4:00PM'
    }
  ];
  activeShifts$: Observable<any>;
  private plantsEditData;
  constructor(
    private fb: FormBuilder,
    private plantService: PlantService,
    private shiftService: ShiftService
  ) {}

  ngOnInit(): void {
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
      shifts: new FormControl('', []),
      label: '',
      field: ''
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
        mergeMap(({ count, rows, next }) => of(rows)),
        catchError(() => of([]))
      );
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
      });
    } else if (this.plantStatus === 'edit') {
      this.plantService
        .updatePlant$({
          ...this.plantForm.getRawValue(),
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
        });
    }
  }
  cancel() {
    this.plantForm.reset();
    this.slideInOut.emit('out');
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
}
