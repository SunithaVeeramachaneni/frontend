import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ResponseSetService } from 'src/app/components/master-configurations/response-set/services/response-set.service';
import { ValidationError } from 'src/app/interfaces';

@Component({
  selector: 'app-master-data-slider',
  templateUrl: './master-data-slider.component.html',
  styleUrls: ['./master-data-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterDataSliderComponent implements OnInit {
  @Input() selectedLabel: string;
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() selectedMasterData: EventEmitter<any> = new EventEmitter();

  labels = [];
  fields = {};
  dependentFields = {};
  masterDataForm: FormGroup;
  errors: ValidationError = {};

  constructor(
    private fb: FormBuilder,
    private responseSetService: ResponseSetService
  ) {}

  ngOnInit(): void {
    this.masterDataForm = this.fb.group({
      label: new FormControl('', [Validators.required]),
      primaryField: new FormControl('', [Validators.required]),
      secondaryField: new FormControl(''),
      dependentFields: new FormControl([])
    });
    this.responseSetService.fetchMasterDataResponses().subscribe((data) => {
      this.labels = Object.keys(data);
      this.fields = Object.fromEntries(
        Object.entries(data).map(([k, v]: [any, any]) => [k, v.fields])
      );
      this.dependentFields = Object.fromEntries(
        Object.entries(data).map(([k, v]: [any, any]) => [k, v.dependentFields])
      );
      this.masterDataForm.patchValue({
        label: this.selectedLabel
      });
    });
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.masterDataForm.get(controlName).touched;
    const errors = this.masterDataForm.get(controlName).errors;
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

  cancel(): void {
    this.slideInOut.emit('out');
  }

  save(): void {
    this.selectedMasterData.emit({
      ...this.masterDataForm.value,
      dependentFields: this.masterDataForm
        .get('dependentFields')
        .value?.toString()
    });
    this.masterDataForm.reset();
    this.slideInOut.emit('out');
  }
}
