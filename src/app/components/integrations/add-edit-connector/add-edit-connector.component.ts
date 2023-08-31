import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormControl, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-edit-connector',
  templateUrl: './add-edit-connector.component.html',
  styleUrls: ['./add-edit-connector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditConnectorComponent implements OnInit {
  connectorOptions: any[] = [
    {
      id: 'odbc',
      name: 'ODBC Connector',
      description:
        'Connects with ODBC Compliant databases like MySql, Oracle, MSSQL, etc..',
      icon: 'icon-odbc',
      isActive: true,
      image: '/assets/Images/connectors/ODBC.png'
    },
    {
      id: 'email',
      name: 'Alerts/Notifications',
      description: 'Sends out Alerts and Notifications for subscribed changes',
      icon: 'icon-email',
      isActive: true,
      image: '/assets/Images/connectors/email.png'
    }
  ];

  isSubmitInprogress = false;

  connectionForm = this.fb.group({
    connector: new FormControl(''),
    connectorAlias: new FormControl(''),
    connectorMeta: this.fb.group({})
  });

  constructor(private fb: FormBuilder, private cdrf: ChangeDetectorRef) {}

  ngOnInit(): void {}

  connectorChanged(event): void {
    const connectorId = event.value;
    this.connectionForm.removeControl('connectorMeta');
    const connectorMetaFormGroup = this.getConnectorMetaFormGroup(connectorId);
    this.connectionForm.setControl('connectorMeta', connectorMetaFormGroup);
    this.cdrf.detectChanges();
  }

  getConnectorMetaFormGroup(connectorId) {
    switch (connectorId) {
      case 'odbc':
        return this.fb.group({
          hostname: new FormControl(''),
          username: new FormControl(''),
          password: new FormControl(''),
          database: new FormControl(''),
          port: new FormControl(''),
          dialect: new FormControl('')
        });
      case 'email':
        return this.fb.group({
          hostname: new FormControl(''),
          port: new FormControl(''),
          username: new FormControl(''),
          password: new FormControl('')
        });
      case 'rest':
        break;
    }
  }

  saveConnection() {
    this.isSubmitInprogress = true;
    console.log(this.connectionForm.value);
    // const { tenantId } = this.tenantService.getTenantInfo();
    // this.tenantService
    //   .createIntegration$(this.integrationConfigForm.value)
    //   .subscribe(
    //     (response) => {
    //       this.isSubmitInprogress = false;
    //       this.cdrf.markForCheck();
    //       // this.toast.show({
    //       //   text: 'Connection configured successfully',
    //       //   type: 'success'
    //       // });
    //       this.dialogRef.close({
    //         data: null,
    //         type: 'close'
    //       });
    //       const dialogRef = this.dialog.open(SuccessModalComponent, {
    //         disableClose: true,
    //         width: '354px',
    //         height: '275px',
    //         backdropClass: 'schedule-success-modal',
    //         data: {}
    //       });
    //     },
    //     (error) => {
    //       this.isSubmitInprogress = false;
    //       this.cdrf.markForCheck();
    //       this.toast.show({
    //         text: 'Error occured while configuring connection',
    //         type: 'warning'
    //       });
    //     }
    //   );
    //
  }

  close(): void {}
}
