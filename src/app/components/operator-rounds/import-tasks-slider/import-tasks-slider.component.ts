import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() selectedFormName;
  @Input() selectedFormData;
  @Input() selectedFormNode;
  @Input() currentFormData;

  hierarcyInput$: Observable<any>;

  @Output() cancelSliderEvent: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private store: Store<State>,
    private operatorRoundsService: OperatorRoundsService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.hierarcyInput$ = of(this.selectedFormNode);
  }
  // cancel() {
  //   this.cancelSliderEvent.emit(false);
  // }
  // hierarchyEventHandler(event: any) {
  //   const { hierarchy } = event;
  //   if (!hierarchy || !hierarchy.length) {
  //     this.operatorRoundsService.setSelectedNode(null);
  //     this.formService.setSelectedHierarchyList([]);
  //   } else {
  //     this.operatorRoundsService.setSelectedNode(hierarchy[0]);
  //     this.formService.setSelectedHierarchyList(hierarchy);
  //   }
  // }
}
