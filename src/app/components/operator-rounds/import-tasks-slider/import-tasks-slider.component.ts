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
  // @Input() selectedFormName$;
  // @Input() selectedFormData$;
  // @Input() selectedFormNode$;
  // @Input() currentFormData$;

  hierarcyInput$: Observable<any>;
  selectedFormName;
  selectedFormData;
  formId;
  subForms;

  @Output() cancelSliderEvent: EventEmitter<boolean> = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<ImportTasksSliderComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private store: Store<State>,
    private operatorRoundsService: OperatorRoundsService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.hierarcyInput$ = of(this.data.selectedFormNode);
    let subFormIds = [];
    this.data.selectedFormNode.forEach((item) => {
      subFormIds.push(item.id);
    });
    this.selectedFormName = this.data.selectedFormName;
    this.selectedFormData = JSON.stringify(this.data.selectedFormData);

    // this.selectedFormNode = this.data.selectedFormNode;
    // console.log(this.selectedFormData);
    // this.selectedFormName = this.data.selectedFormName;
  }
  useForm() {}
  cancel() {
    this.cancelSliderEvent.emit(false);
  }
  // hierarchyEventHandler(event: any) {
  //   const { hierarchy } = event;
  //   this.store.dispatch(
  //     HierarchyActions.updateSelectedHierarchyList({
  //       selectedHierarchy: hierarchy || []
  //     })
  //   );
  //   if (!hierarchy || !hierarchy.length) {
  //     this.operatorRoundsService.setSelectedNode(null);
  //     this.formService.setSelectedHierarchyList([]);
  //   } else {
  //     this.operatorRoundsService.setSelectedNode(hierarchy[0]);
  //     this.formService.setSelectedHierarchyList(hierarchy);
  //   }
  // }
}
