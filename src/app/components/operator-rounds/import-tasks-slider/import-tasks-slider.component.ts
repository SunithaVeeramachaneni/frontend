import {
  Component,
  OnInit,
  Input,
  Inject,
  Output,
  EventEmitter
} from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  getFormMetadata,
  getFormDetails,
  getCreateOrEditForm,
  getFormSaveStatus,
  getFormPublishStatus,
  getIsFormCreated,
  getQuestionCounter,
  State
} from 'src/app/forms/state/builder/builder-state.selectors';
import { formConfigurationStatus } from 'src/app/app.constants';
import {
  BuilderConfigurationActions,
  HierarchyActions,
  RoundPlanConfigurationActions
} from 'src/app/forms/state/actions';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { FormService } from 'src/app/forms/services/form.service';
@Component({
  selector: 'app-import-tasks-slider',
  templateUrl: './import-tasks-slider.component.html',
  styleUrls: ['./import-tasks-slider.component.scss']
})
export class ImportTasksSliderComponent implements OnInit {
  hierarcyInput$: Observable<any>;
  selectedFormName;
  selectedFormData;
  formId;
  subForms;

  @Output() cancelSliderEvent: EventEmitter<boolean> = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<ImportTasksSliderComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.hierarcyInput$ = of(this.data.selectedFormNode);
    this.selectedFormName = this.data.selectedFormName;
    this.selectedFormData = JSON.stringify(this.data.selectedFormData);
  }
  useForm() {}
  cancel() {
    this.cancelSliderEvent.emit(false);
  }
}
