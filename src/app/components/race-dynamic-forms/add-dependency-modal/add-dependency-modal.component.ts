import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const { globalDataset, selectedQuestion, questions } = this.data;
    this.globalDataset = globalDataset;
    const {
      responseType: selectedQuestionResponseType,
      location,
      latitudeColumn,
      longitudeColumn,
      radius,
      pins
    } = selectedQuestion.value;
    this.selectedResponseType = selectedQuestionResponseType;
    this.selectedResponseTypes = [this.selectedResponseType];
    this.dependencyForm = this.fb.group({
      location: false,
      latitudeColumn: '',
      longitudeColumn: '',
      radius: '',
      pins: 0,
      questions: this.fb.array([
        this.initQuestion(null, '', this.selectedResponseType)
      ])
    });

    const filteredQuestions = questions.filter((question) => {
      if (
        question.fieldType === 'DD' &&
        question.value.globalDataset &&
        question.value.parentDependencyQuestionId === selectedQuestion.id
      ) {
        return question;
      }
    });

    if (location) {
      this.dependencyForm.patchValue({
        location,
        latitudeColumn,
        longitudeColumn,
        radius,
        pins
      });
    }

    if (filteredQuestions.length) {
      this.depForm.removeAt(0);
    }

    filteredQuestions.forEach((question) => {
      const {
        value: { name, responseType, dependentResponseType }
      } = question;
      console.log(name);
      this.depForm.push(
        this.initQuestion(name, responseType, dependentResponseType)
      );
    });
  }

  get depForm() {
    return this.dependencyForm.get('questions') as FormArray;
  }

  getDependencyQuestions(form) {
    return form.controls.questions.controls;
  }

  addQuestion() {
    const control = this.dependencyForm.get('questions') as FormArray;
    control.push(this.initQuestion());
  }

  initQuestion = (name = '', responseType = '', dependentResponseType = '') =>
    this.fb.group({
      name,
      responseType: [responseType, [Validators.required]],
      dependentResponseType: [dependentResponseType, [Validators.required]]
    });

  onResponseTyepChange(event: any, index: number) {
    const { value } = event.target as HTMLInputElement;
    this.selectedResponseTypes[index + 1] = value;
  }

  saveDependencies() {
    this.dialogRef.close(this.dependencyForm.value);
  }
}
