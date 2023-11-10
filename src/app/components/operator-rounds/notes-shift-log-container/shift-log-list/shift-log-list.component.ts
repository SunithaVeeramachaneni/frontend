import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDetails } from 'src/app/interfaces';
import { UsersService } from 'src/app/components/user-management/services/users.service';
import { slideInOut } from 'src/app/animations';
import { OperatorRoundsService } from '../../services/operator-rounds.service';
import { ShrService } from '../../services/shr.service';
import { ToastService } from 'src/app/shared/toast';

@Component({
  selector: 'app-shift-log-list',
  templateUrl: './shift-log-list.component.html',
  styleUrls: ['./shift-log-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class ShiftLogListComponent implements OnInit {
  @Input() logs: any[];
  @Input() selectedRow: any;
  @Input() shrId: string;

  menuState = 'out';
  selectedLog: any;
  dataSource: MatTableDataSource<any>;
  users$: Observable<UserDetails[]>;
  ghostLoading = new Array(5).fill(0).map((v, i) => i);
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  columns: Column[] = [
    {
      id: 'title',
      displayName: 'Title',
      type: 'string',
      controlType: 'string',
      order: 1,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {
        'font-weight': '500',
        'font-size': '100%',
        color: '#000000',
        'overflow-wrap': 'anywhere'
      },
      hasSubtitle: false,
      showMenuOptions: false,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'description',
      displayName: 'Log',
      type: 'string',
      controlType: 'string',
      order: 2,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {
        'font-weight': '500',
        'font-size': '100%',
        color: '#000000',
        'overflow-wrap': 'anywhere'
      },
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: 'nodeId',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray',
        'overflow-wrap': 'anywhere'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'raisedBy',
      displayName: 'Raised By',
      type: 'string',
      controlType: 'string',
      order: 3,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {
        'font-weight': '500',
        'font-size': '100%',
        color: '#000000',
        'overflow-wrap': 'anywhere'
      },
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: true,
      hasPostTextImage: false
    }
  ];

  configOptions: ConfigOptions = {
    tableID: 'notesListTable',
    rowsExpandable: false,
    enableRowsSelection: false,
    enablePagination: false,
    displayFilterPanel: false,
    displayActionsColumn: true,
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
        'background-color': '#FFCC00',
        color: '#000000'
      },
      published: {
        'background-color': '#2C9E53',
        color: '#FFFFFF'
      }
    }
  };

  constructor(
    private dialog: MatDialog,
    private userService: UsersService,
    private operatorRoundService: OperatorRoundsService,
    private shrService: ShrService,
    private cdfr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.isLoading$.next(true);
    this.configOptions.allColumns = this.columns;
    this.userService.getUsersInfo$().subscribe(() => {
      const data = this.logs.map((log) => ({
        ...log,
        raisedBy: log.raisedBy
          ? this.operatorRoundService.formatUserFullNameDisplay(log.raisedBy) ||
            ''
          : ''
      }));
      this.dataSource = new MatTableDataSource(data);
      this.isLoading$.next(false);
      this.cdfr.markForCheck();
    });
    this.prepareMenuActions();
  }

  prepareMenuActions(): void {
    const menuActions = [];
    if (this.selectedRow.incomingSupervisorId === '') {
      menuActions.push(
        {
          title: 'Edit',
          action: 'edit'
        },
        {
          title: 'Remove',
          action: 'remove'
        }
      );
    }

    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  rowLevelActionHandler({ data, action }): void {
    switch (action) {
      case 'remove':
        this.openDeleteModal(data);
        break;

      case 'edit':
        this.menuState = 'in';
        this.selectedLog = data;
        break;

      default:
    }
  }

  onCloseNoteMenuState(event: any): void {
    this.menuState = event;
  }

  openDeleteModal(data: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
      data
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.isLoading$.next(true);
      if (result) {
        this.shrService
          .deleteSupervisorLogs$(
            data.id,
            { shrId: this.shrId },
            { displayToast: true, failureResponse: {} }
          )
          .subscribe(() => {
            this.logs = this.logs.filter((log) => log.id !== data.id);
            const logsData = this.logs.map((log) => ({
              ...log,
              raisedBy: this.operatorRoundService.formatUserFullNameDisplay(
                log.raisedBy || ''
              )
            }));
            this.dataSource = new MatTableDataSource(logsData);
            this.toastService.show({
              type: 'success',
              text: 'Shift Log deleted successfully'
            });
            this.isLoading$.next(false);
            this.cdfr.detectChanges();
          });
      }
    });
  }

  updateShiftLogs(data: any): void {
    const index = this.logs.findIndex((log) => log.id === data.id);
    this.logs[index] = {
      ...this.logs[index],
      title: data.title,
      description: data.description
    };
    this.selectedLog = null;
    this.cdfr.detectChanges();
    this.dataSource = new MatTableDataSource(this.logs);
  }
}
