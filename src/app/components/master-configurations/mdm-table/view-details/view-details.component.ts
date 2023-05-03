import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { slideInOut } from 'src/app/animations';
import { MdmTableService } from '../services/mdm-table.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { routingUrls } from 'src/app/app.constants';
import { HeaderService } from 'src/app/shared/services/header.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [slideInOut]
})
export class ViewDetailsComponent implements OnInit {
  filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  // openAssetsDetailedView = 'out';
  assetsAddOrEditOpenState = 'out';
  assetsEditData;
  isPopoverOpen = false;
  tableHeader;

  mdmTableItems$: Observable<any>;
  allMdmTableItems$: Observable<any>;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  columns: Column[] = [];

  configOptions: ConfigOptions = {
    tableID: '',
    rowsExpandable: false,
    enableRowsSelection: false,
    enablePagination: false,
    displayFilterPanel: false,
    displayActionsColumn: false,
    rowLevelActions: {
      menuActions: []
    },
    groupByColumns: [],
    pageSizeOptions: [10, 25, 50, 75, 100],
    allColumns: [],
    tableHeight: 'calc(100vh - 150px)',
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957'],
    conditionalStyles: {
      draft: {
        'background-color': '#FEF3C7',
        color: '#92400E'
      },
      published: {
        'background-color': '#D1FAE5',
        color: '#065f46'
      }
    }
  };

  dataSource: MatTableDataSource<any>;

  constructor(
    private route: ActivatedRoute,
    private mdmTableService: MdmTableService,
    private headerService: HeaderService
  ) {}
  ngOnInit(): void {
    this.headerService.setHeaderTitle(routingUrls.masterConfiguration.title);
    this.route.params.subscribe((routeParams) => {
      const tableUID = routeParams.tableUID;
      this.configOptions.tableID = tableUID;
      this.mdmTableService.mdmTables$.subscribe((mdmTables) => {
        for (const mdmTable of mdmTables) {
          if (mdmTable.tableUID === tableUID) {
            this.mdmTableService
              .getTableDefinition$(mdmTable.id)
              .subscribe((res) => {
                this.tableHeader = res;
                this.columns = [];
                for (const column of this.tableHeader.columns) {
                  this.columns.push({
                    id: column.name,
                    displayName: column.displayName,
                    type: column.columnType,
                    controlType: column.columnType,
                    order: this.columns.length + 1,
                    hasSubtitle: false,
                    showMenuOptions: false,
                    subtitleColumn: '',
                    searchable: false,
                    sortable: true,
                    hideable: false,
                    visible: true,
                    movable: false,
                    stickable: false,
                    sticky: false,
                    groupable: true,
                    titleStyle: {
                      display: 'block',
                      'min-width': '250px',
                      width: `${100 / this.tableHeader.columns.length}vw`
                    },
                    subtitleStyle: {
                      display: 'block',
                      'min-width': '250px',
                      width: `${100 / this.tableHeader.columns.length}vw`
                    },
                    hasPreTextImage: false,
                    hasPostTextImage: false
                  });
                }
                this.configOptions = {
                  ...this.configOptions,
                  allColumns: this.columns,
                  tableHeight: 'calc(100vh - 140px)'
                };
                console.log('Config Options: ', this.configOptions);
                this.dataSource = new MatTableDataSource([]);
              });
            this.allMdmTableItems$ = this.mdmTableService.fetchTablesList$(
              mdmTable.id
            );
            this.allMdmTableItems$.subscribe((res) => {
              console.log('Table Items: ', res);
              this.dataSource = new MatTableDataSource(res.items);
            });
            break;
          }
        }
      });
    });
  }
  onCloseAssetsAddOrEditOpenState(event) {
    this.assetsAddOrEditOpenState = event;
  }
  // onCloseAssetsDetailedView(event) {
  //   this.openAssetsDetailedView = event.status;
  //   if (event.data !== '') {
  //     this.assetsEditData = event.data;
  //     this.assetsAddOrEditOpenState = 'in';
  //   }
  // }
  // rowLevelActionHandler = ({ data, action }): void => {
  //   switch (action) {
  //     case 'edit':
  //       this.assetsEditData = { ...data };
  //       this.assetsAddOrEditOpenState = 'in';
  //       break;
  //     case 'delete':
  //       this.deleteAsset(data);
  //       break;
  //     default:
  //   }
  // };
  // deleteAsset(asset: any): void {
  //   const deleteData = {
  //     id: asset.id,
  //     _version: asset._version
  //   };
  // }
  addManually() {
    console.log(this.assetsAddOrEditOpenState);
    this.assetsAddOrEditOpenState = 'in';
    this.assetsEditData = null;
    console.log(this.assetsAddOrEditOpenState);
  }
}
