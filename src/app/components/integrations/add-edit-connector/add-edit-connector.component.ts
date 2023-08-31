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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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

  constructor(
    private fb: FormBuilder,
    private cdrf: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private integrationsService: IntegrationsService
  ) {}

  ngOnInit(): void {}

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
      displayToast: true,
      failureResponse: 'throwError'
    };
    this.integrationsService
      .testConnection$(this.connectionForm.value, info)
      .subscribe((resp: any) => {
        if (resp.connectionSuccessful) {
          this.isConnectionTested = true;
          this.isConnectionSuccessful = true;
        } else {
          this.isConnectionTested = true;
          this.isConnectionSuccessful = false;
        }
        this.isTestConnectionInProgress = false;
        console.log(resp);
      });
  }

  saveConnection() {
    this.isSaveInProgress = true;
    console.log(this.connectionForm.value);
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    this.integrationsService
      .createConnection$(this.connectionForm.value, info)
      .subscribe(
        (resp: any) => {
          console.log(resp);
          this.isSaveInProgress = false;
        },
        (err) => {
          this.isSaveInProgress = false;
        }
      );
  }

  isTestConnectionDisabled(): boolean {
    let isDisabled = true;
    const currentVal = { ...this.connectionForm.value };
    const isConnectorValid =
      currentVal.connector && currentVal.connector.length ? true : false;
    isDisabled = isDisabled && isConnectorValid;
    const isConnectorAliasValid =
      currentVal.connectorAlias && currentVal.connectorAlias.length
        ? true
        : false;
    isDisabled = isDisabled && isConnectorAliasValid;

    if (Object.keys(currentVal.connectorMeta).length) {
      const properties = Object.keys(currentVal.connectorMeta);
      properties.forEach((prop) => {
        const propValue = currentVal.connectorMeta[prop]?.toString();
        const isPropValid = propValue && propValue.length;
        isDisabled = isDisabled && isPropValid;
      });
    }
    return !isDisabled;
  }

  close(): void {}
}
