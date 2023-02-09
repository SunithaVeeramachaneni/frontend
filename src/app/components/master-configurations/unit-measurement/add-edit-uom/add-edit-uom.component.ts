/* eslint-disable @typescript-eslint/consistent-type-assertions */
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationError } from 'src/app/interfaces';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { UnitMeasurementService } from '../services';
import { CreateUnitListMutation } from 'src/app/API.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-edit-uom',
  templateUrl: './add-edit-uom.component.html',
  styleUrls: ['./add-edit-uom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditUnitOfMeasurementComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() createUnitData: EventEmitter<any> = new EventEmitter();
  @Input() set unitEditData(data) {
    // eslint-disable-next-line no-underscore-dangle
    this._unitEditData = data;
  }
  _unitEditData: any;
  public unitOfMeasurement: string;
  public measurementList: any[];
  errors: ValidationError = {};
  public unitMeasurment: FormGroup;
  public units: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    private readonly unitOfMeasurementService: UnitMeasurementService
  ) {}

  ngOnInit(): void {
    this.measurementList = ['Length', 'Area', 'Volume', 'Temperature'];
    this.initForm();
  }

  cancel() {
    this.initForm();
    this.slideInOut.emit('out');
  }

  onSave() {
    const units = this.unitMeasurment.get('units').value;
    if (
      this.unitMeasurment.invalid ||
      units?.length === 0 ||
      !this.unitOfMeasurement
    ) {
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
    console.log($event);
    this.addNewUmo();
  };
  initForm() {
    this.unitMeasurment = new FormGroup({
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
    this.units = this.unitMeasurment.get('units') as FormArray;
    this.units.push(this.createUnit());
  }

  processValidationErrors(index: any, controlName: string): boolean {
    const touched = (<FormArray>this.unitMeasurment.get('units'))
      .at(index)
      .get(controlName).touched;
    const errors = (<FormArray>this.unitMeasurment.get('units'))
      .at(index)
      .get(controlName).errors;
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
    const units = this.unitMeasurment?.get('units')?.value;
    const unitObservables = [];
    units?.forEach((element) => {
      unitObservables.push(
        this.unitOfMeasurementService.createUnitOfMeasurement$({
          unitlistID: response.id,
          description: element.description,
          searchTerm: `${element?.description?.toLowerCase()} ${response?.name?.toLowerCase()}`,
          symbol: element.symbol
        })
      );
    });
    forkJoin(unitObservables).subscribe(() => {
      this.unitMeasurment.reset();
      this.unitOfMeasurement = '';
      this.slideInOut.emit('out');
    });
  }
}
