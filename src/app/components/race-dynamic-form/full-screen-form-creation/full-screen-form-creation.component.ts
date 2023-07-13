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
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-full-screen-form-creation',
  templateUrl: './full-screen-form-creation.component.html',
  styleUrls: ['./full-screen-form-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullScreenFormCreationComponent implements OnInit, OnDestroy {
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
    public dialogRef: MatDialogRef<FullScreenFormCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.totalSteps = this.steps.length;

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

  goToListAfterPublish(): void {
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
