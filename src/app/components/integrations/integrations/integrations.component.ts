import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormControl, FormBuilder, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddEditConnectorComponent } from '../add-edit-connector/add-edit-connector.component';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntegrationsComponent implements OnInit {
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

  connectors$: Observable<any[]>;
  connectorsInitial$: Observable<any>;
  createUpdateDeleteConnector$ = new BehaviorSubject<any>({
    type: 'create',
    connector: {} as any
  });

  constructor(
    private fb: FormBuilder,
    private cdrf: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.connectorsInitial$ = of({ data: [] as any[] });
    this.connectors$ = combineLatest([
      this.connectorsInitial$,
      this.createUpdateDeleteConnector$
    ]).pipe(
      map(([initial, dashboardAction]) => {
        const { type, dashboard } = dashboardAction;
        return initial.data;
      }),
      tap((connectors) => {
        //
      })
    );
  }
  addConnector() {
    const dialogRef = this.dialog.open(AddEditConnectorComponent, {
      disableClose: true,
      width: '600px',
      height: '600px',
      data: {}
    });
    dialogRef.afterClosed().subscribe((result) => {
      //
    });
  }

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

  getDataEntityMapping() {
    return (this.integrationConfigForm.get('dataMapping') as FormArray)
      .controls;
  }

  close(): void {}
}
