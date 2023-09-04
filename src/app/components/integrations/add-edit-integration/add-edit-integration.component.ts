import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Inject,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { IntegrationsService } from '../services/integrations.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCalendar } from '@angular/material/datepicker';
import { ErrorInfo } from 'src/app/interfaces';

@Component({
  selector: 'app-add-edit-integration',
  templateUrl: './add-edit-integration.component.html',
  styleUrls: ['./add-edit-integration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditIntegrationComponent implements OnInit {
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;

  integrationPoints: any[] = [
    {
      name: 'Round Submission',
      id: 'round-submission'
    }
  ];

  dataEntities = {
    'round-submission': [
      {
        attributeName: 'Tag Number',
        attributeId: 'tagNumber'
      },
      {
        attributeName: 'Round ID',
        attributeId: 'roundId'
      },
      {
        attributeName: 'Round Name',
        attributeId: 'roundName'
      },
      {
        attributeName: 'Question',
        attributeId: 'question'
      },
      {
        attributeName: 'Reading',
        attributeId: 'uomReading'
      },
      {
        attributeName: 'Unit of Measurement',
        attributeId: 'unit'
      },
      {
        attributeName: 'Date and Timestamp',
        attributeId: 'dateAndTime'
      },
      {
        attributeName: 'User',
        attributeId: 'userId'
      },
      {
        attributeName: 'Plant',
        attributeId: 'plantId'
      },
      {
        attributeName: 'Location',
        attributeId: 'locationId'
      },
      {
        attributeName: 'Asset',
        attributeId: 'assetId'
      }
    ]
  };
  isSaveInProgress = false;

  integrationConfigForm = this.fb.group({
    integrationPointId: new FormControl(''),
    syncType: new FormControl('realtime'),
    scheduleType: 'byFrequency',
    repeatTime: ''
  });

  constructor(
    public dialogRef: MatDialogRef<AddEditIntegrationComponent>,
    private fb: FormBuilder,
    private cdrf: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private integrationsService: IntegrationsService
  ) {}

  ngOnInit(): void {
    if (this.data.mode === 'edit') {
      this.integrationConfigForm.patchValue({
        ...this.data?.integration
      });
    }
  }

  saveIntegration() {
    this.isSaveInProgress = true;
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    const { connectorId } = this.data;

    if (this.data.mode === 'create') {
      this.integrationsService
        .createIntegration$(connectorId, this.integrationConfigForm.value, info)
        .subscribe(
          (resp: any) => {
            this.dialogRef.close(resp);
            this.isSaveInProgress = false;
          },
          (err) => {
            this.isSaveInProgress = false;
          }
        );
    } else if (this.data.mode === 'edit') {
      const integrationId = this.data.integration?.id;
      this.integrationsService
        .updateIntegration$(
          connectorId,
          integrationId,
          this.integrationConfigForm.value,
          info
        )
        .subscribe(
          (resp: any) => {
            this.dialogRef.close({
              ...this.integrationConfigForm.value,
              id: integrationId
            });
            this.isSaveInProgress = false;
          },
          (err) => {
            this.isSaveInProgress = false;
          }
        );
    }
  }
}
