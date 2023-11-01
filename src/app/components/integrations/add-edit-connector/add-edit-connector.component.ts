import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormArray,
  Validators
} from '@angular/forms';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { IntegrationsService } from '../services/integrations.service';
import { ErrorInfo } from 'src/app/interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { permissions } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import { LoginService } from '../../login/services/login.service';

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

  hidePasswordODBC = true;
  hidePasswordSMTP = true;

  isTestConnectionInProgress = false;
  isSaveInProgress = false;

  isConnectionTested = false;
  isConnectionSuccessful = false;
  dialectTypes: any[] = [
    {
      value: '',
      type: 'Select'
    },
    { value: 'mssql', type: 'MSSQL' },
    { value: 'mysql', type: 'MySQL' }
  ];
  readonly permissions = permissions;

  connectionForm = this.fb.group({
    connector: new FormControl('', [
      Validators.required,
      WhiteSpaceValidator.whiteSpace,
      WhiteSpaceValidator.trimWhiteSpace
    ]),
    connectorAlias: new FormControl('', [
      Validators.required,
      WhiteSpaceValidator.whiteSpace,
      WhiteSpaceValidator.trimWhiteSpace
    ]),
    connectorMeta: this.fb.group({}),
    description: new FormControl(''),
    icon: new FormControl('')
  });
  superAdminEnable = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditConnectorComponent>,
    private loginService: LoginService,
    private fb: FormBuilder,
    private cdrf: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private integrationsService: IntegrationsService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const userInfo = this.loginService.getLoggedInUserInfo();
    if (userInfo.roles[0].name === 'Super Admin') {
      this.superAdminEnable = true;
    }
    if (this.data.mode === 'edit') {
      const connector = this.data?.connector;
      this.connectionForm.patchValue({
        connector: connector.connectorId,
        connectorAlias: connector.connectorName,
        icon: connector.icon,
        description: connector.description
      });
      this.connectionForm.removeControl('connectorMeta');
      const connectorMetaFormGroup = this.getConnectorMetaFormGroup(
        connector.connectorId
      );
      connectorMetaFormGroup.patchValue({ ...connector.connectorMeta });
      this.connectionForm.setControl('connectorMeta', connectorMetaFormGroup);
      this.cdrf.detectChanges();
    } else if (this.data.mode === 'view') {
      const connector = this.data?.connector;
      this.connectionForm.patchValue({
        connector: connector.connectorId,
        connectorAlias: connector.connectorName,
        icon: connector.icon,
        description: connector.description
      });
      this.connectionForm.removeControl('connectorMeta');
      const connectorMetaFormGroup = this.getConnectorMetaFormGroup(
        connector.connectorId
      );
      connectorMetaFormGroup.patchValue({ ...connector.connectorMeta });
      this.connectionForm.setControl('connectorMeta', connectorMetaFormGroup);
      this.connectionForm.disable();
      this.cdrf.detectChanges();
    }
  }

  connectorChanged(event): void {
    this.isConnectionTested = false;
    this.isConnectionSuccessful = false;
    const connectorId = event.value;
    const connector = this.connectorOptions.find((c) => c.id === connectorId);
    this.connectionForm.patchValue({
      icon: connector.icon,
      description: connector.description
    });
    this.connectionForm.removeControl('connectorMeta');
    const connectorMetaFormGroup = this.getConnectorMetaFormGroup(connectorId);
    this.connectionForm.setControl('connectorMeta', connectorMetaFormGroup);
    this.cdrf.detectChanges();
  }

  getConnectorMetaFormGroup(connectorId) {
    switch (connectorId) {
      case 'odbc':
        return this.fb.group({
          hostname: new FormControl('', [
            Validators.required,
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]),
          username: new FormControl('', [
            Validators.required,
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]),
          password: new FormControl('', [
            Validators.required,
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]),
          database: new FormControl('', [
            Validators.required,
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]),
          port: new FormControl('', [Validators.required]),
          dialect: new FormControl('', [
            Validators.required,
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ])
        });
      case 'email':
        return this.fb.group({
          hostname: new FormControl('', [
            Validators.required,
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]),
          port: new FormControl('', [Validators.required]),
          username: new FormControl('', [
            Validators.required,
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ]),
          password: new FormControl('', [
            Validators.required,
            WhiteSpaceValidator.whiteSpace,
            WhiteSpaceValidator.trimWhiteSpace
          ])
        });
      case 'rest':
        break;
    }
  }

  testConnection() {
    this.isTestConnectionInProgress = true;
    const info: ErrorInfo = {
      displayToast: false,
      failureResponse: 'throwError'
    };
    this.integrationsService
      .testConnection$(this.connectionForm.value, info)
      .subscribe(
        (resp: any) => {
          if (resp.connectionSuccessful) {
            this.isConnectionTested = true;
            this.isConnectionSuccessful = true;
          } else {
            this.isConnectionTested = true;
            this.isConnectionSuccessful = false;
          }
          this.isTestConnectionInProgress = false;
          this.cdrf.detectChanges();
        },
        (err) => {
          this.toast.show({
            text: 'Error occured while testing connection',
            type: 'warning'
          });
        }
      );
  }

  saveConnection() {
    this.isSaveInProgress = true;
    const info: ErrorInfo = {
      displayToast: false,
      failureResponse: 'throwError'
    };
    if (this.data.mode === 'create') {
      this.integrationsService
        .createConnection$(this.connectionForm.value, info)
        .subscribe(
          (resp: any) => {
            this.dialogRef.close(resp);
            this.isSaveInProgress = false;
            this.toast.show({
              text: 'Connection Created successfully',
              type: 'success'
            });
          },
          (err) => {
            this.isSaveInProgress = false;
            this.toast.show({
              text: 'Error occured while creating connection',
              type: 'warning'
            });
          }
        );
    } else if (this.data.mode === 'edit') {
      const connectorId = this.data.connector.id;
      this.integrationsService
        .updateConnection$(connectorId, this.connectionForm.value, info)
        .subscribe(
          (resp: any) => {
            this.dialogRef.close({
              ...this.connectionForm.value,
              id: connectorId,
              connectorName: this.connectionForm.value.connectorAlias,
              connectorId: this.connectionForm.value.connector
            });
            this.isSaveInProgress = false;
            this.toast.show({
              text: 'Connection updated successfully',
              type: 'success'
            });
          },
          (err) => {
            this.isSaveInProgress = false;
            this.toast.show({
              text: 'Error occured while updating connection',
              type: 'warning'
            });
          }
        );
    }
  }

  close(): void {}
}
