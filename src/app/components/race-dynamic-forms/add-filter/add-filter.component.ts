import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-filter',
  templateUrl: './add-filter.component.html',
  styleUrls: ['./add-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFilterComponent implements OnInit {
  selectedResponseTypes: string[];
  selectedResponseType: string;
  globalDataset: any;
  filterForm: FormGroup;
  public dependencyData;
  @Input() set filteredData(data) {
    this.dependencyData = data;
    console.log(this.dependencyData);
  }
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const { globalDataset, selectedQuestion, questions } = this.dependencyData;
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
    this.filterForm = this.fb.group({
      location: false,
      latitudeColumn: '',
      longitudeColumn: '',
      radius: '',
      pins: 0,
      dependsOn: ''
    });

    // const filteredQuestions = questions.filter((question) => {
    //   if (
    //     question.fieldType === 'DD' &&
    //     question.value.globalDataset &&
    //     question.value.parentDependencyQuestionId === selectedQuestion.id
    //   ) {
    //     return question;
    //   }
    // });

    if (location) {
      this.filterForm.patchValue({
        location,
        latitudeColumn,
        longitudeColumn,
        radius,
        pins
      });
    }

    // if (filteredQuestions.length) {
    //   this.depForm.removeAt(0);
    // }

    // filteredQuestions.forEach((question) => {
    //   const {
    //     value: { name, responseType, dependentResponseType }
    //   } = question;
    //   console.log(name);
    //   this.depForm.push(
    //     this.initQuestion(name, responseType, dependentResponseType)
    //   );
    // });
  }

  dependsOn(event: any) {
    const { value } = event.target as HTMLInputElement;
    this.selectedResponseTypes[0] = value;
  }
}
