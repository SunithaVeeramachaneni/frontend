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
import { forkJoin } from 'rxjs';

import { ValidationError } from 'src/app/interfaces';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { UnitMeasurementService } from '../services';
import {
  CreateUnitListMutation,
  GetUnitMeasumentQuery,
  UpdateUnitListMutation
} from 'src/app/API.service';
import { UnitOfMeasurementDeleteModalComponent } from '../uom-delete-modal/uom-delete-modal.component';
import { MatDialog } from '@angular/material/dialog';

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
    rows: GetUnitMeasumentQuery[];
  } = {
    unitList: null,
    rows: []
  };
  public unitType: string;
  public measurementList: string[];
  errors: ValidationError = {};
  public unitMeasurementForm = new FormGroup({
    units: new FormArray([])
  });
  public units: FormArray;
  public isEditMeasurement = true;
  public isEditForm = false;
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
      this.unitType = this.unitEditData?.unitList?.name ?? '';
      const units = this.unitMeasurementForm.get('units') as FormArray;
      this.unitEditData?.rows?.forEach(() => this.addNewUmo());
      this.unitEditData?.rows?.forEach((row, idx) => {
        units?.at(idx)?.patchValue({
          description: row?.description ?? '',
          symbol: row?.symbol ?? '',
          id: row?.id,
          version: row?._version
        });
      });
    }
  }

  ngOnInit(): void {
    this.measurementList = this.unitOfMeasurementService.measurementList;
  }

  cancel(): void {
    this.initForm();
    this.unitType = '';
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
    if (this.unitMeasurementForm?.get('units')?.invalid) {
      return;
    }

    if (this.isEditForm) {
      this.unitOfMeasurementService
        .updateUnitList$({
          id: this.unitEditData?.unitList?.id,
          name: this.unitType || this.unitEditData?.unitList?.name,
          _version: this.unitEditData?.unitList?._version
        })
        .subscribe((result: UpdateUnitListMutation) => {
          if (result) {
            this.createUpdateUnitListItems(result, 'edit');
          }
        });
    } else {
      this.unitOfMeasurementService
        .getSingleUnitListByName$(this.unitType)
        .subscribe(({ items }) => {
          if (items?.length > 0) {
            this.createUpdateUnitListItems(items[0], 'create');
          } else {
            this.unitOfMeasurementService
              .CreateUnitList$({
                name: this.unitType
              })
              .subscribe((response: CreateUnitListMutation) => {
                if (response) {
                  this.createUpdateUnitListItems(response, 'create');
                }
              });
          }
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
          .updateUnitList$({
            id: this.unitEditData?.unitList?.id,
            isDeleted: true,
            _version: this.unitEditData?.unitList?._version
          })
          .subscribe((result) => {
            this.createUpdateUnitListItems(result, 'delete');
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

  private createUpdateUnitListItems(
    response: CreateUnitListMutation | UpdateUnitListMutation,
    type: 'create' | 'edit' | 'delete'
  ) {
    const units = this.unitMeasurementForm?.get('units')?.value;
    const unitObservables = [];
    units?.forEach(
      (element: {
        id: string | number;
        description: string;
        symbol: string;
        version?: number | null;
      }) => {
        if (type === 'delete' && element?.id) {
          unitObservables.push(
            this.unitOfMeasurementService.updateUnitMeasurement$({
              id: element?.id.toString(),
              isDeleted: true,
              _version: element?.version
            })
          );
        }
        if (type === 'edit') {
          if (element?.id) {
            unitObservables.push(
              this.unitOfMeasurementService.updateUnitMeasurement$({
                id: element?.id.toString(),
                description: element?.description ?? '',
                searchTerm: `${element?.description?.toLowerCase() ?? ''} ${
                  response?.name?.toLowerCase() ?? ''
                }`,
                symbol: element?.symbol ?? '',
                _version: element?.version
              })
            );
          } else {
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
          }
        }
        if (type === 'create') {
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
        }
      }
    );
    forkJoin(unitObservables).subscribe(() => {
      this.unitMeasurementForm.reset();
      this.units = null;
      this.unitType = '';
      this.unitEditData = null;
      this.slideInOut.emit('out');
    });
  }
}
