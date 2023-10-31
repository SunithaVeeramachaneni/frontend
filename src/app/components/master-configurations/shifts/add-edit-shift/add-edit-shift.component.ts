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
import { ShiftService } from '../services/shift.service';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { TenantService } from 'src/app/components/tenant-management/services/tenant.service';

@Component({
  selector: 'app-add-edit-shift',
  templateUrl: './add-edit-shift.component.html',
  styleUrls: ['./add-edit-shift.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditShiftComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() createdShiftData: EventEmitter<any> = new EventEmitter();
  @Output() shiftModeUpdated: EventEmitter<any> = new EventEmitter();

  @Input() set shiftMode(mode) {
    this.mode = mode;
    if (mode === 'VIEW') {
      this.shiftTitle = 'Shift Details';
      this.shiftForm?.disable();
    } else if (mode === 'CREATE') {
      this.shiftForm?.reset();
      this.shiftTitle = 'Create Shift';
      this.shiftButton = 'Create';
      this.shiftForm?.enable();
    } else if (mode === 'EDIT') {
      this.shiftTitle = 'Edit Shift';
      this.shiftButton = 'Update';
      this.shiftForm?.enable();
    }
  }
  get shiftMode() {
    return this.mode;
  }
  @Input() set shiftEditData(data) {
    this.shiftsEditData = data;
    if (this.shiftsEditData === null) {
      this.shiftStatus = 'add';
      this.shiftForm?.reset();
    } else {
      this.shiftForm?.reset();
      this.shiftStatus = 'edit';
      const shiftData = {
        id: this.shiftsEditData?.id,
        name: this.shiftsEditData?.name,
        startTime: this.shiftsEditData?.startTime,
        endTime: this.shiftsEditData?.endTime,
        isActive: this.shiftsEditData?.isActive
      };
      this.shiftForm?.patchValue(shiftData);
    }
  }
  get shiftEditData() {
    return this.shiftsEditData;
  }

  checked = false;
  disabled = false;

  isCreateUpdateInprogress = false;

  errors: ValidationError = {};
  shiftStatus;
  shiftTitle;
  shiftButton;
  shiftForm: FormGroup;
  shiftInformation;
  allParentsData;

  private shiftsEditData;
  private mode;

  constructor(
    private fb: FormBuilder,
    private shiftService: ShiftService,
    private tenantService: TenantService
  ) {}
  getValidators(tenantInfo): any[] {
    const validators = [Validators.required, WhiteSpaceValidator.whiteSpace];
    if (tenantInfo.trimWhiteSpace) {
      validators.push(WhiteSpaceValidator.trimWhiteSpace);
    }
    return validators;
  }

  ngOnInit(): void {
    const tenantInfo = this.tenantService.getTenantInfo();
    const validators = this.getValidators(tenantInfo);
    this.shiftForm = this.fb.group({
      id: '',
      name: new FormControl('', [...validators, Validators.maxLength(25)]),
      startTime: new FormControl('', [...validators]),
      endTime: new FormControl('', [...validators]),
      isActive: new FormControl('', [])
    });
  }

  create() {
    if (this.shiftStatus === 'add') {
      this.isCreateUpdateInprogress = true;
      const { id, ...payload } = this.shiftForm.value;
      this.shiftService.createShift$(payload).subscribe((res) => {
        this.isCreateUpdateInprogress = false;
        this.createdShiftData.emit({
          status: this.shiftStatus,
          data: {
            ...payload,
            startAndEndTime: `${payload?.startTime} - ${payload?.endTime}`
          }
        });
        this.slideInOut.emit('out');
        this.shiftForm?.reset();
      });
    } else if (this.shiftStatus === 'edit') {
      this.isCreateUpdateInprogress = true;
      this.shiftService
        .updateShift$({
          ...this.shiftForm.getRawValue(),
          _version: this.shiftsEditData._version,
          id: this.shiftsEditData?.id
        })
        .subscribe((res) => {
          this.isCreateUpdateInprogress = false;
          this.createdShiftData.emit({
            status: this.shiftStatus,
            data: {
              ...this.shiftForm.getRawValue(),
              _version: this.shiftsEditData._version,
              id: this.shiftsEditData?.id,
              startAndEndTime: `${this.shiftsEditData?.startTime} - ${this.shiftsEditData?.endTime}`
            }
          });
          this.slideInOut.emit('out');
        });
    }
  }
  cancel() {
    this.slideInOut.emit('out');
  }
  goToEditMode() {
    this.shiftModeUpdated.emit({ mode: 'EDIT', data: this.shiftEditData });
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.shiftForm.get(controlName).touched;
    const errors = this.shiftForm.get(controlName).errors;
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
