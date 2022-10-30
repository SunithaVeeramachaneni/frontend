import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-dependency-modal',
  templateUrl: './add-dependency-modal.component.html',
  styleUrls: ['./add-dependency-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDependencyModalComponent implements OnInit {
  isChecked = false;
  globalDataset: any;
  selectedResponseType: string;
  selectedResponseTypes: string[];

  dependencyForm: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<AddDependencyModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: AddDependencyModalComponent,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const { globalDataset, selectedResponseType } = this.data;
    this.globalDataset = globalDataset;
    this.selectedResponseType = selectedResponseType;
    this.selectedResponseTypes = [this.selectedResponseType];
    this.dependencyForm = this.fb.group({
      location: false,
      globalDataset: true,
      latitudeColumn: '',
      longitudeColumn: '',
      radius: '',
      pins: 0,
      questions: this.fb.array([this.initQuestion()])
    });
  }

  getDependencyQuestions(form) {
    return form.controls.questions.controls;
  }

  addQuestion() {
    const control = this.dependencyForm.get('questions') as FormArray;
    control.push(this.initQuestion());
  }

  initQuestion = (
    name = '',
    responseType = '',
    dependentResponseType = '',
    fieldType = 'DD',
    position = '',
    required = false,
    multi = false
  ) =>
    this.fb.group({
      name,
      responseType: [responseType],
      dependentResponseType: [dependentResponseType],
      fieldType,
      position,
      required,
      multi
    });

  selectDependency(responseType: string) {
    return this.selectedResponseTypes.includes(responseType);
  }

  saveDependencies() {
    this.dialogRef.close();
  }
}
