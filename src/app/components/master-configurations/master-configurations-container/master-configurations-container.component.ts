import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { routingUrls } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { MdmTableService } from '../mdm-table/services/mdm-table.service';

@Component({
  selector: 'app-master-configurations-container',
  templateUrl: './master-configurations-container.component.html',
  styleUrls: ['./master-configurations-container.component.scss']
})
export class MasterConfigurationsContainerComponent implements OnInit {
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;

  constructor(
    private commonService: CommonService,
    private headerService: HeaderService,
    private breadcrumbService: BreadcrumbService,
    private cdrf: ChangeDetectorRef,
    private mdmTableService: MdmTableService
  ) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap((currentRouteUrl) => {
        if (currentRouteUrl === routingUrls.masterConfiguration.url) {
          this.headerService.setHeaderTitle(routingUrls.plants.title);
          this.breadcrumbService.set(routingUrls.masterConfiguration.url, {
            skip: true
          });
          this.cdrf.detectChanges();
        } else {
          this.breadcrumbService.set(routingUrls.masterConfiguration.url, {
            skip: false
          });
        }
      })
    );

    // update table item by tableid and item id
    // this.mdmTableService
    //   .updateTableItem$(
    //     '53d4aa3d-131f-4bf8-9cb7-3ef0ca4ce364',
    //     '30de6292-4214-4f7a-8970-f13cd63c1d19',
    //     {
    //       // eslint-disable-next-line @typescript-eslint/naming-convention
    //       WorkCenterTitle: 'Testing 1',
    //       id: '30de6292-4214-4f7a-8970-f13cd63c1d19',
    //       _version: 1
    //     }
    //   )
    //   .subscribe((res) => console.log(res));

    // create item in table by tableid
    // this.mdmTableService
    //   .createTableItem$('37bcf0bd-d3d3-4584-820c-66dca67e8a0a', {
    //     // eslint-disable-next-line @typescript-eslint/naming-convention
    //     WorkCenterID: 'work center test 2',
    //     // eslint-disable-next-line @typescript-eslint/naming-convention
    //     WorkCenterTitle: 'work center test 2'
    //   })
    //   .subscribe((res) => console.log(res));

    // get all tables list
    // this.mdmTableService
    //   .fetchAllTables$()
    //   .subscribe((res) => console.log('Get All Tables: ', res));

    // get mdm table list by table id
    // MDMTable1;
    this.mdmTableService
      .fetchTablesList$('9fb0f1ff-fcef-4f71-a439-d243ccee6c77')
      .subscribe((res) => console.log('Equipment Table List: ', res));
    // MDMTable2
    this.mdmTableService
      .fetchTablesList$('37bcf0bd-d3d3-4584-820c-66dca67e8a0a')
      .subscribe((res) => console.log('Work Center Table List: ', res));
    // get mdm table list item by table id and item id
    // MDMTable 1
    // this.mdmTableService
    //   .getTableItem$(
    //     '53d4aa3d-131f-4bf8-9cb7-3ef0ca4ce364',
    //     '3f2ad76e-686b-429e-abfc-ce0605ff1346'
    //   )
    //   .subscribe((res) => console.log(res));
    // MDMTable 2
    // this.mdmTableService
    //   .getTableItem$(
    //     '56917876-7958-4826-8efa-b27359ec9f59',
    //     'cffb98be-f1cf-4295-b11f-91581177fd51'
    //   )
    //   .subscribe((res) => console.log(res));

    // create new masterdata
    // this.mdmTableService
    //   .createTable$({
    //     tableName: 'Equipment',
    //     columns: [
    //       {
    //         displayName: 'Equipment ID',
    //         columnType: 'ID',
    //         isKeyField: true
    //       },
    //       {
    //         displayName: 'Equipment Title',
    //         columnType: 'String',
    //         isKeyField: false
    //       }
    //     ]
    //   })
    //   .subscribe((res) => console.log(res));

    // get masterdata table definition
    // this.mdmTableService
    //   .getTableDefinition$('53d4aa3d-131f-4bf8-9cb7-3ef0ca4ce364')
    //   .subscribe((res) => console.log(res));
  }
}
