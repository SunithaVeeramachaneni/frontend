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

  constructor(
    public dialogRef: MatDialogRef<FullScreenFormCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private store: Store<State>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.totalSteps = this.steps.length;

    this.store.select(getFormDetails).subscribe((formDetails) => {
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
        pages,
        formExists: Object.keys(formMetadata).length === 0 ? false : true
      };
    });
  }

  goBack(): void {
    if (this.currentStep === 0) {
      this.router.navigate(['/forms']);
      this.dialogRef.close(this.formData.formMetadata);
    } else if (this.currentStep > 0) {
      this.gotoPreviousStep();
    } else if (this.currentStep === this.totalSteps - 1) {
      this.router.navigate(['/forms']);
      this.dialogRef.close();
    }
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
    this.store.dispatch(BuilderConfigurationActions.resetFormConfiguration());
    this.store.dispatch(UnitOfMeasurementActions.resetUnitOfMeasurementList());
    this.store.dispatch(QuickResponseActions.resetQuickResponses());
    this.store.dispatch(GlobalResponseActions.resetGlobalResponses());
  }
}
