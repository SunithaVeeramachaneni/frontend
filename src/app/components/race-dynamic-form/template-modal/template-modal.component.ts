import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { State, getFormDetails } from 'src/app/forms/state';
import {
  BuilderConfigurationActions,
  GlobalResponseActions,
  QuickResponseActions,
  UnitOfMeasurementActions
} from 'src/app/forms/state/actions';
import { Step } from 'src/app/interfaces/stepper';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-template-modal',
  templateUrl: './template-modal.component.html',
  styleUrls: ['./template-modal.component.scss']
})
export class TemplateModalComponent implements OnInit, OnDestroy {
  steps: Step[] = [
    { title: 'Template Details', content: '' },
    { title: 'Add Questions', content: '' }
  ];
  totalSteps: number;
  currentStep = 0;
  authoredFormDetailSubscription: Subscription;
  templateData: any;

  constructor(
    public dialogRef: MatDialogRef<TemplateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.totalSteps = this.steps.length;

    this.route.data.subscribe((data) => {
      if (data.form && Object.keys(data.form).length) {
        data.form.pages.forEach((page) => {
          let questionInstructionMediaMap = [];
          page.questions.forEach((question) => {
            questionInstructionMediaMap.push({
              questionId: question.id,
              instructionsMedia: {}
            });
          });
          page.questionInstructionMediaMap = questionInstructionMediaMap;
        });
        this.store.dispatch(
          BuilderConfigurationActions.updateFormConfiguration({
            formConfiguration: data.form
          })
        );

        data.form.pages.forEach((page, index) => {
          if (index === 0) {
            this.store.dispatch(
              BuilderConfigurationActions.updatePageState({
                pageIndex: index,
                isOpen: false,
                subFormId: null
              })
            );
            this.store.dispatch(
              BuilderConfigurationActions.updatePageState({
                pageIndex: index,
                isOpen: true,
                subFormId: null
              })
            );
          } else {
            this.store.dispatch(
              BuilderConfigurationActions.updatePageState({
                pageIndex: index,
                isOpen: false,
                subFormId: null
              })
            );
          }
        });
      }
    });

    this.authoredFormDetailSubscription = this.store
      .select(getFormDetails)
      .subscribe((templateDetails) => {
        const { formMetadata, formListDynamoDBVersion } = templateDetails;
        this.templateData = {
          formListDynamoDBVersion,
          formMetadata,
          templateExists: Object.keys(formMetadata).length === 0 ? false : true
        };
      });
  }

  goBack(): void {
    this.commonService.setCurrentRouteUrl('/forms/templates');
    this.router.navigate(['/forms/templates']);
    this.dialogRef.close();
  }

  onGotoStep(step): void {
    this.currentStep = step;
  }

  gotoNextStep(): void {
    this.currentStep++;
  }

  gotoPreviousStep(): void {
    this.currentStep--;
  }

  markReadyEventHandler(): void {
    this.commonService.setCurrentRouteUrl('/forms/templates');
    this.router.navigate(['/forms/templates']);
    if (Object.keys(this.dialogRef).length) this.dialogRef.close();
  }

  ngOnDestroy() {
    this.authoredFormDetailSubscription.unsubscribe();
    this.store.dispatch(BuilderConfigurationActions.resetFormConfiguration());
    this.store.dispatch(UnitOfMeasurementActions.resetUnitOfMeasurementList());
    this.store.dispatch(QuickResponseActions.resetQuickResponses());
    this.store.dispatch(GlobalResponseActions.resetGlobalResponses());
  }
}
