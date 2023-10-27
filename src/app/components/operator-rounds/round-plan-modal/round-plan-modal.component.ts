import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getFormDetails } from 'src/app/forms/state';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import { Step } from 'src/app/interfaces/stepper';
import { State } from 'src/app/state/app.state';

@Component({
  selector: 'app-round-plan-modal',
  templateUrl: './round-plan-modal.component.html',
  styleUrls: ['./round-plan-modal.component.scss']
})
export class RoundPlanModalComponent implements OnInit, OnDestroy {
  steps: Step[] = [
    { title: 'Plan Details', content: '' },
    { title: 'Route and Tasks', content: '' },
    { title: 'PDF Setup', content: '' }
  ];

  totalSteps: number;
  currentStep = 0;
  roundData;
  authoredRoundPlanDetailSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<RoundPlanModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private store: Store<State>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.totalSteps = this.steps.length;

    this.store.dispatch(
      BuilderConfigurationActions.updateModuleName({
        moduleName: 'OPERATOR_ROUNDS'
      })
    );

    this.authoredRoundPlanDetailSubscription = this.store
      .select(getFormDetails)
      .subscribe((formDetails) => {
        const { formMetadata, formListDynamoDBVersion } = formDetails;
        this.roundData = {
          formListDynamoDBVersion,
          formMetadata,
          roundExists: Object.keys(formMetadata).length === 0 ? false : true
        };
      });
  }

  goBack(): void {
    this.router.navigate(['/operator-rounds']);
    this.dialogRef.close(this.roundData.formMetadata);
  }

  publishedEventHandler(): void {
    this.dialogRef.close(this.roundData.formMetadata);
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
    if (this.authoredRoundPlanDetailSubscription) {
      this.authoredRoundPlanDetailSubscription.unsubscribe();
    }
    this.store.dispatch(BuilderConfigurationActions.resetFormConfiguration());
  }
}
