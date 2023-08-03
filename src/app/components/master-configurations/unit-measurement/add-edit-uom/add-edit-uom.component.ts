/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { OnChanges } from '@angular/core';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ValidationError, UnitOfMeasurement } from 'src/app/interfaces';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { UnitMeasurementService } from '../services';
import { UnitOfMeasurementDeleteModalComponent } from '../uom-delete-modal/uom-delete-modal.component';

@Component({
  selector: 'app-add-edit-uom',
  templateUrl: './add-edit-uom.component.html',
  styleUrls: ['./add-edit-uom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditUnitOfMeasurementComponent implements OnInit, OnChanges {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() createUnitData: EventEmitter<any> = new EventEmitter();
  @Input() unitEditData: {
    unitList: any;
    rows: UnitOfMeasurement[];
  } = {
    unitList: null,
    rows: []
  };
  public unitType = '';
  public newUnitType = '';
  public measurementList: any[] = [];
  errors: ValidationError = {};
  public unitMeasurementForm = new FormGroup({
    units: new FormArray([])
  });
  public units: FormArray;
  public isEditMeasurement = true;
  public isEditForm = false;
  public isSubmittedForm = false;
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly unitOfMeasurementService: UnitMeasurementService,
    public readonly dialog: MatDialog
  ) {}

  ngOnChanges(): void {
    this.isEditForm = !!this.unitEditData;
    if (this.unitEditData?.rows?.length > 0) {
      this.initForm();
      this.unitType = '';
      this.unitType = this.unitEditData?.unitList?.name || '';
      const units = this.unitMeasurementForm.get('units') as FormArray;
      this.unitEditData?.rows?.forEach(() => this.addNewUmo());
      this.unitEditData?.rows?.forEach((row, idx) => {
        units?.at(idx)?.patchValue({
          description: row?.description || '',
          symbol: row?.symbol || '',
          id: row?.id,
          version: row?._version
        });
      });
    }
  }

  ngOnInit(): void {
    this.unitOfMeasurementService.getUnitTypes().subscribe();
    this.unitOfMeasurementService.unitTypes$.subscribe(
      (units) => (this.measurementList = units)
    );
  }

  cancel(): void {
    this.unitMeasurementForm = new FormGroup({
      units: new FormArray([])
    });
    this.unitType = '';
    this.newUnitType = '';
    this.isSubmittedForm = false;
    this.unitMeasurementForm.reset();
    this.slideInOut.emit('out');
  }

  onSave(): void {
    (<FormArray>this.unitMeasurementForm?.get('units'))?.controls?.forEach(
      (group: FormGroup) => {
        (<any>Object)
          .values(group?.controls)
          ?.forEach((control: FormControl) => {
            control?.markAsTouched();
          });
      }
    );
    this.isSubmittedForm = true;
    const isAddNewUnit = this.unitType === 'addNew';
    if (
      this.unitMeasurementForm?.get('units')?.invalid ||
      this.unitMeasurementForm?.get('units')?.value?.length === 0 ||
      (isAddNewUnit && this.newUnitType === '')
    ) {
      return;
    }
    const unitType = isAddNewUnit ? this.newUnitType : this.unitType;
    if (this.isEditForm) {
      this.unitOfMeasurementService
        .updateUnitType$(this.unitEditData?.unitList?.id, {
          unitType,
          units: this.unitMeasurementForm?.get('units')?.value
        })
        .subscribe((response) => {
          if (Object.keys(response).length) {
            this.resetFormState();
            this.createUnitData.emit({
              status: 'edit'
            });
          }
        });
    } else {
      this.unitOfMeasurementService
        .createUnitType$({
          unitType,
          units: this.unitMeasurementForm?.get('units')?.value
        })
        .subscribe(() => {
          this.resetFormState();
          this.createUnitData.emit({
            status: 'create'
          });
        });
    }
  }

  onMeasurementChange = ($event): void => {
    this.initForm();
    this.addNewUmo();
  };

  initForm(): void {
    this.unitMeasurementForm = new FormGroup({
      units: new FormArray([])
    });
  }

  createUnit(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      version: [null],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(48),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ],
      symbol: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(48),
          WhiteSpaceValidator.whiteSpace,
          WhiteSpaceValidator.trimWhiteSpace
        ]
      ]
    });
  }

  addNewUmo(): void {
    if (!this.unitType) {
      return;
    }
    this.units = this.unitMeasurementForm.get('units') as FormArray;
    this.units.push(this.createUnit());
  }

  processValidationErrors(index: number, controlName: string): boolean {
    const touched: boolean = (<FormArray>this.unitMeasurementForm?.get('units'))
      .at(index)
      .get(controlName)?.touched;
    const errors: ValidationErrors = (<FormArray>(
      this.unitMeasurementForm?.get('units')
    ))
      .at(index)
      .get(controlName)?.errors;
    this.errors[controlName] = null;
    if (touched && errors) {
      Object.keys(errors)?.forEach((messageKey) => {
        this.errors[controlName] = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return !touched || this.errors[controlName] === null ? false : true;
  }

  deleteUnitAndUOM(): void {
    if (!this.isEditForm) {
      return;
    }
    const deleteReportRef = this.dialog.open(
      UnitOfMeasurementDeleteModalComponent,
      {
        data: this.unitEditData
      }
    );

    deleteReportRef.afterClosed().subscribe((res) => {
      if (res === 'delete') {
        this.unitOfMeasurementService
          .deleteUnitType$(this.unitEditData?.unitList?.id)
          .subscribe((response) => {
            if (Object.keys(response).length) {
              this.resetFormState();
              this.createUnitData.emit({
                status: 'delete'
              });
            }
          });
      }
    });
  }

  editMeasurement(): void {
    this.isEditMeasurement = false;
  }

  getSize(value) {
    if (value && value === value?.toUpperCase()) {
      return value?.length;
    }
    return value?.length - 1;
  }

  get unitMeasurementFormControl() {
    return (this.unitMeasurementForm?.get('units') as any)?.controls;
  }

  get isFormValid(): boolean {
    const isAddNewUnit = this.unitType === 'addNew';
    const unitType = isAddNewUnit ? this.newUnitType : this.unitType;
    return (
      !unitType ||
      this.unitMeasurementForm?.invalid ||
      (!isAddNewUnit && this.unitMeasurementForm.pristine)
    );
  }

  private resetFormState() {
    this.unitMeasurementForm.reset();
    this.units = null;
    this.unitType = '';
    this.unitEditData = null;
    this.isSubmittedForm = false;
  }
}
