import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormControl, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntegrationsComponent implements OnInit {
  connectors: any[] = [
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
    },
    {
      id: 'webhook',
      name: 'Webhooks',
      description: 'Webhooks post data to desired HTTP POST Endpoint',
      icon: 'icon-webhooks',
      isActive: true,
      image: '/assets/Images/connectors/webhook.png'
    }
    // {
    //   id: 'rest',
    //   name: 'App-to-App Connect',
    //   description: 'Connects with RESTful APIs',
    //   icon: 'icon-rest-api',
    //   isActive: false,
    //   image: '/assets/Images/connectors/restapi.svg'
    // }
    // {
    //   id: 'ftp',
    //   name: 'FTP/SFTP Connector',
    //   description: 'Connects with FTP/SFTP',
    //   icon: 'icon-ftp',
    //   image: '/assets/Images/connectors/ftp.png',
    //   isActive: true
    // },
    // {
    //   id: 'sap',
    //   name: 'SAP Connector',
    //   description: 'Connects with SAP ERP',
    //   icon: 'icon-sap',
    //   isActive: true,
    //   image: '/assets/Images/connectors/sap.png'
    // },
    // {
    //   id: 'maximo',
    //   name: 'IBM Maximo',
    //   description: 'Connects with IBM Maximo',
    //   icon: 'icon-maximo',
    //   isActive: false,
    //   image: '/assets/Images/connectors/maximo.png'
    // },

    // {
    //   id: 'cloud-storage',
    //   name: 'Cloud Storage Services',
    //   description:
    //     'Connects with Cloud Storage Services like AWS S3, Google Drive, DropBox, etc..',
    //   icon: 'icon-cloud-storage',
    //   isActive: false,
    //   image: '/assets/Images/connectors/cloudstore.png'
    // }
  ];
  integrationPoints: any[] = [
    {
      name: 'Round Submission',
      id: 'round-submission'
    },
    {
      name: 'Round Schedule',
      id: 'round-schedule'
    },
    {
      name: 'Create AdHoc Round',
      id: 'create-adhoc-round'
    },
    {
      name: 'Update Round',
      id: 'update-round'
    },
    {
      name: 'Schedule Inspection',
      id: 'schedule-inspection'
    },
    {
      name: 'Publish Round Plan',
      id: 'publish-round-plan'
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

  isSubmitInprogress = false;

  integrationConfigForm = this.fb.group({
    integrationPoint: new FormControl(''),
    integrationType: new FormControl('outbound'),
    synchronization: new FormControl('real-time'),
    cronExpression: new FormControl(''),
    connector: new FormControl('odbc'),
    connectorMeta: this.fb.group({}),
    dataMapping: this.fb.array([])
  });

  constructor(private fb: FormBuilder, private cdrf: ChangeDetectorRef) {}

  ngOnInit(): void {}

  selectIntegrationPoint(event): void {
    if (event) {
      const mappings = this.dataEntities[event.value];
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

  connectorChanged(connectorId: string): void {
    this.integrationConfigForm.removeControl('connectorMeta');
    const connectorMetaFormGroup = this.getConnectorMetaFormGroup(connectorId);
    this.integrationConfigForm.setControl(
      'connectorMeta',
      connectorMetaFormGroup
    );
    this.integrationConfigForm.patchValue({
      connector: connectorId
    });
    this.cdrf.detectChanges();
  }

  getConnectorName(connectorId) {
    return this.connectors.find((c) => c.id === connectorId);
  }
  getIntegrationPoint(ipID) {
    return this.integrationPoints.find((ip) => ip.id === ipID);
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
      case 'rest':
        break;
      case 'sap':
        break;
      case 'ip21':
        break;
      case 'osi-pi':
        break;
      case 'ge-apm':
        break;
      case 'ftp':
        break;
      case 'email':
        return this.fb.group({
          hostname: new FormControl(''),
          port: new FormControl(''),
          username: new FormControl(''),
          password: new FormControl('')
        });
        break;
      case 'cloud-storage':
        break;
      case 'honeywell-forge':
        break;
    }
  }

  getDataEntityMapping() {
    return (this.integrationConfigForm.get('dataMapping') as FormArray)
      .controls;
  }

  configureAndConnect() {
    this.isSubmitInprogress = true;
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
