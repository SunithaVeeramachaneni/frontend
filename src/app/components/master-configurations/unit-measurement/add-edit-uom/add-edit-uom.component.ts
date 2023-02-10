/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { OnChanges, SimpleChanges } from '@angular/core';
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
import { forkJoin } from 'rxjs';

import { ValidationError } from 'src/app/interfaces';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { UnitMeasurementService } from '../services';
import {
  CreateUnitListMutation,
  GetUnitMeasumentQuery
} from 'src/app/API.service';

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
    unitType: string;
    rows: GetUnitMeasumentQuery[];
  } = {
    unitType: null,
    rows: []
  };
  public unitOfMeasurement: string;
  public measurementList: any[];
  errors: ValidationError = {};
  public unitMeasurementForm: FormGroup;
  public units: FormArray;
  public isEditMeasurement:boolean=true;

  constructor(
    private formBuilder: FormBuilder,
    private readonly unitOfMeasurementService: UnitMeasurementService
  ) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.unitEditData?.rows?.length > 0) {
      this.initForm();
      this.unitOfMeasurement = this.unitEditData?.unitType ?? '';
      const units = this.unitMeasurementForm.get('units') as FormArray;
      this.unitEditData?.rows?.forEach(() => this.addNewUmo());
      this.unitEditData?.rows?.forEach((row, idx) => {
        units?.at(idx)?.patchValue({
          description: row?.description ?? '',
          symbol: row?.symbol ?? ''
        });
      });
    }
  }

  ngOnInit(): void {
    this.measurementList = this.unitOfMeasurementService.measurementList;
  }

  cancel() {
    this.initForm();
    this.unitOfMeasurement = '';
    this.slideInOut.emit('out');
  }

  onSave() {
    (<FormArray>this.unitMeasurementForm?.get('units'))?.controls?.forEach(
      (group: any) => {
        (<any>Object)
          .values(group.controls)
          ?.forEach((control: FormControl) => {
            control?.markAsTouched();
          });
      }
    );
    if (this.unitMeasurementForm.get('units').invalid) {
      return;
    }
    this.unitOfMeasurementService
      .getSingleUnitListByName$(this.unitOfMeasurement)
      .subscribe(({ items }) => {
        if (items?.length > 0) {
          this.createUnitListItems(items[0]);
        } else {
          this.unitOfMeasurementService
            .CreateUnitList$({
              name: this.unitOfMeasurement
            })
            .subscribe((response) => {
              this.createUnitListItems(response);
            });
        }
      });
  }

  onMeasurementChange = ($event) => {
    this.initForm();
    this.addNewUmo();
  };

  initForm() {
    this.unitMeasurementForm = new FormGroup({
      units: new FormArray([])
    });
  }

  createUnit(): FormGroup {
    return this.formBuilder.group({
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
    if (!this.unitOfMeasurement) {
      return;
    }
    this.units = this.unitMeasurementForm.get('units') as FormArray;
    this.units.push(this.createUnit());
  }

  processValidationErrors(index: number, controlName: string): boolean {
    const touched: boolean = (<FormArray>this.unitMeasurementForm?.get('units'))
      .at(index)
      .get(controlName).touched;
    const errors: ValidationErrors = (<FormArray>(
      this.unitMeasurementForm?.get('units')
    ))
      .at(index)
      .get(controlName)?.errors;
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

  private createUnitListItems(response: CreateUnitListMutation) {
    const units = this.unitMeasurementForm?.get('units')?.value;
    const unitObservables = [];
    units?.forEach((element) => {
      unitObservables.push(
        this.unitOfMeasurementService.createUnitOfMeasurement$({
          unitlistID: response?.id,
          description: element?.description ?? '',
          searchTerm: `${element?.description?.toLowerCase() ?? ''} ${
            response?.name?.toLowerCase() ?? ''
          }`,
          symbol: element?.symbol ?? ''
        })
      );
    });
    forkJoin(unitObservables).subscribe(() => {
      this.unitMeasurementForm.reset();
      this.unitOfMeasurement = '';
      this.slideInOut.emit('out');
    });
  }

  editMeasurement = () => {
  this.isEditMeasurement = false;
  }

  deleteMeasurement = () => {
    console.log("delete measurement")
  }

  getSize(value) {
    if (value && value === value.toUpperCase()) {
      return value.length;
    }
    return value.length - 1;
  }
}
