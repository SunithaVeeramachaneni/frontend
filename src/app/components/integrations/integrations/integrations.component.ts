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
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { IntegrationsService } from '../services/integrations.service';
import { Confirmation, ErrorInfo } from 'src/app/interfaces';
import { ConfirmationModalDialogComponent } from '../confirmation-modal/confirmation-modal.component';
import { permissions } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntegrationsComponent implements OnInit {
  isSubmitInprogress = false;
  selectedConnector: any;

  connectors$: Observable<any[]>;
  connectorsInitial$: Observable<any>;
  createUpdateDeleteConnector$ = new BehaviorSubject<any>({
    type: 'create',
    connector: {} as any
  });
  readonly permissions = permissions;

  constructor(
    private fb: FormBuilder,
    private cdrf: ChangeDetectorRef,
    private dialog: MatDialog,
    private integrationsService: IntegrationsService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    this.connectorsInitial$ = of({ data: [] as any[] });

    this.connectorsInitial$ = this.integrationsService
      .getConnectors$(info)
      .pipe(
        mergeMap((connectors) => of({ data: connectors })),
        catchError(() => of({ data: [] }))
      );

    this.connectors$ = combineLatest([
      this.connectorsInitial$,
      this.createUpdateDeleteConnector$
    ]).pipe(
      map(([initial, connectorAction]) => {
        const { type, connector } = connectorAction;
        if (Object.keys(connector).length) {
          if (type === 'create') {
            initial.data = initial.data.concat([connector]);
          } else if (type === 'update') {
            const index = initial.data.findIndex((c) => c.id === connector.id);
            if (index > -1) {
              initial.data[index] = connector;
            }
          } else if (type === 'delete') {
            const index = initial.data.findIndex((c) => c.id === connector);
            if (index > -1) {
              initial.data.splice(index, 1);
            }
          }
        }
        this.selectedConnector = initial.data[0];
        return initial.data;
      }),
      tap((connectors) => {
        //
      })
    );
  }

  addConnection() {
    const dialogRef = this.dialog.open(AddEditConnectorComponent, {
      disableClose: true,
      width: '600px',
      height: '600px',
      data: { mode: 'create' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.createUpdateDeleteConnector$.next({
        type: 'create',
        connector: result
      });
    });
  }

  viewConnection(connector) {
    const dialogRef = this.dialog.open(AddEditConnectorComponent, {
      disableClose: true,
      width: '600px',
      height: '600px',
      data: { mode: 'view', connector }
    });
    dialogRef.afterClosed().subscribe((result) => {
      // Do Nothing
    });
  }

  updateConnection(connector) {
    const dialogRef = this.dialog.open(AddEditConnectorComponent, {
      disableClose: true,
      width: '600px',
      height: '600px',
      data: { mode: 'edit', connector }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.createUpdateDeleteConnector$.next({
        type: 'update',
        connector: result
      });
    });
  }

  deleteConnection(id) {
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    const confirmDialog = this.dialog.open(ConfirmationModalDialogComponent, {
      disableClose: true,
      width: '400px',
      height: '150px',
      data: {
        heading: 'Are you sure want to delete the connection?',
        message:
          'Deleting the connection will also delete all associated integrations.'
      }
    });
    confirmDialog.afterClosed().subscribe((resp: Confirmation) => {
      if (resp.confirm === 'yes') {
        this.integrationsService.deleteConnection$(id, info).subscribe(
          (result: any) => {
            this.createUpdateDeleteConnector$.next({
              type: 'delete',
              connector: id
            });
            this.toast.show({
              text: 'Connection deleted successfully',
              type: 'success'
            });
          },
          (err) => {
            this.toast.show({
              text: 'Error occured while deleting connection',
              type: 'success'
            });
          }
        );
      }
    });
  }

  connectorChanged(connector: any): void {
    this.selectedConnector = connector;
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

  close(): void {}
}
