import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Step } from 'src/app/interfaces/stepper';
import { State, getFormDetails } from 'src/app/forms/state';
import { Store } from '@ngrx/store';
import {
  BuilderConfigurationActions,
  GlobalResponseActions,
  QuickResponseActions,
  UnitOfMeasurementActions
} from 'src/app/forms/state/actions';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormModalComponent implements OnInit, OnDestroy {
  steps: Step[] = [
    { title: 'Form Details', content: '' },
    { title: 'Add Questions', content: '' },
    { title: 'PDF Setup', content: '' }
  ];

  totalSteps: number;
  currentStep = 0;
  formData;
  authoredFormDetailSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<FormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private store: Store<State>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.totalSteps = this.steps.length;
    const {
      formData: { isCreateAI }
    } = this.data;

    if (isCreateAI) {
      this.steps[0].title = 'Generate using AI';
      this.steps[1].title = 'Review Questions';
    }

    this.authoredFormDetailSubscription = this.store
      .select(getFormDetails)
      .subscribe((formDetails) => {
        const { formMetadata, formListDynamoDBVersion, pages } = formDetails;
        const { formType } = formMetadata;
        if (formType === 'Embedded') {
          this.steps = [
            { title: 'Form Details', content: '' },
            { title: 'Add Questions', content: '' }
          ];
        }
        this.formData = {
          formListDynamoDBVersion,
          formMetadata,
          formExists: Object.keys(formMetadata).length === 0 ? false : true
        };
      });
  }

  goBack(): void {
    if (this.currentStep === 0) {
      this.router.navigate(['/forms']);
      this.dialogRef.close({ data: this.formData.formMetadata, type: 'add' });
    } else if (this.currentStep > 0) {
      this.gotoPreviousStep();
    }
  }

  publishedEventHandler(): void {
    this.dialogRef.close({ data: this.formData.formMetadata, typ: 'publish' });
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

  ngOnDestroy(): void {
    if (this.authoredFormDetailSubscription) {
      this.authoredFormDetailSubscription.unsubscribe();
    }
    this.store.dispatch(BuilderConfigurationActions.resetFormConfiguration());
    this.store.dispatch(UnitOfMeasurementActions.resetUnitOfMeasurementList());
    this.store.dispatch(QuickResponseActions.resetQuickResponses());
    this.store.dispatch(GlobalResponseActions.resetGlobalResponses());
  }
}
