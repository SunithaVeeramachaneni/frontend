import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Inject,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormArray } from '@angular/forms';
import { IntegrationsService } from '../services/integrations.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCalendar } from '@angular/material/datepicker';
import { ErrorInfo } from 'src/app/interfaces';
import { dataEntities, integrationPoints } from 'src/app/app.constants';
import { permissions } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';

@Component({
  selector: 'app-add-edit-integration',
  templateUrl: './add-edit-integration.component.html',
  styleUrls: ['./add-edit-integration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditIntegrationComponent implements OnInit {
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;

  integrationPoints = [];
  isSaveInProgress = false;

  integrationConfigForm = this.fb.group({
    integrationPointId: new FormControl(''),
    syncType: new FormControl('realtime'),
    scheduleType: 'byFrequency',
    repeatTime: '',
    dataMapping: this.fb.array([])
  });
  readonly permissions = permissions;

  constructor(
    public dialogRef: MatDialogRef<AddEditIntegrationComponent>,
    private fb: FormBuilder,
    private cdrf: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private integrationsService: IntegrationsService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.integrationPoints = integrationPoints;
    if (this.data.mode === 'edit') {
      this.integrationConfigForm.patchValue({
        ...this.data?.integration
      });
      this.selectIntegrationPoint({
        value: this.data?.integration?.integrationPointId
      });
    }
  }

  selectIntegrationPoint(event): void {
    if (event) {
      const mappings = dataEntities[event.value];
      const formArrayCtrl = this.fb.array([]);
      mappings?.forEach((mapping) => {
        formArrayCtrl.push(
          this.fb.group({
            attributeName: mapping.attributeName,
            attributeId: mapping.attributeId,
            sourceKey: mapping.attributeId,
            targetKey: mapping.attributeId
          })
        );
      });
      this.integrationConfigForm.setControl('dataMapping', formArrayCtrl);
      this.cdrf.detectChanges();
    }
  }

  getDataEntityMapping() {
    return (this.integrationConfigForm.get('dataMapping') as FormArray)
      .controls;
  }

  saveIntegration() {
    this.isSaveInProgress = true;
    const info: ErrorInfo = {
      displayToast: false,
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
            this.toast.show({
              text: 'Integration created successfully',
              type: 'success'
            });
          },
          (err) => {
            this.isSaveInProgress = false;
            this.toast.show({
              text: 'Error occured while creating integration',
              type: 'warning'
            });
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
            this.toast.show({
              text: 'Integration updated successfully',
              type: 'success'
            });
          },
          (err) => {
            this.isSaveInProgress = false;
            this.toast.show({
              text: 'Error occured while updating integration',
              type: 'warning'
            });
          }
        );
    }
  }
}
