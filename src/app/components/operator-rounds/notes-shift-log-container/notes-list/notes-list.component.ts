import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { slideInOut } from 'src/app/animations';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { UsersService } from 'src/app/components/user-management/services/users.service';
import { OperatorRoundsService } from '../../services/operator-rounds.service';
import { ShrService } from '../../services/shr.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut]
})
export class NotesListComponent implements OnInit {
  @Input() notes: any[];
  @Input() shrId: string;

  menuState = 'out';
  selectedNote: any;
  dataSource: MatTableDataSource<any>;

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
      id: 'node',
      displayName: 'Location / Asset',
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
      id: 'task',
      displayName: 'Task',
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
    },
    {
      id: 'raisedBy',
      displayName: 'Raised By',
      type: 'string',
      controlType: 'string',
      order: 4,
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
    private shrService: ShrService
  ) {}

  ngOnInit(): void {
    this.configOptions.allColumns = this.columns;
    this.userService.getUsersInfo$().subscribe(() => {
      const data =
        this.notes.map((note) => {
          const { id, flatHierarchy, formData, assignedTo } = note;

          const { nodeId, name: nodeName, type } = JSON.parse(flatHierarchy)[0];
          let noteTitle = '';
          let task = '';
          let questionId = '';

          const jsonData = JSON.parse(formData);
          jsonData.FORMS.forEach((form) => {
            form.PAGES.forEach((page) => {
              page.SECTIONS.forEach((section) => {
                section.FIELDS.forEach((field) => {
                  if (field.NOTES) {
                    questionId = field.UNIQUEKEY;
                    noteTitle = field.NOTES;
                    task = field.FIELDLABEL;
                  }
                });
              });
            });
          });

          return {
            id,
            questionId,
            title: noteTitle,
            node: nodeName,
            nodeId: `${
              type === 'location' ? 'Location ID: ' : 'Asset ID: '
            } ${nodeId}`,
            task,
            raisedBy: this.operatorRoundService.formatUserFullNameDisplay(
              assignedTo || 'ayush.solanki@innovapptive.com'
            )
          };
        }) || [];
      this.dataSource = new MatTableDataSource(data);
    });
    this.prepareMenuActions();
  }

  prepareMenuActions(): void {
    const menuActions = [
      {
        title: 'Edit',
        action: 'edit'
      },
      {
        title: 'Remove',
        action: 'remove'
      }
    ];

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
        this.selectedNote = data;
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
      if (result) {
        console.log(result);
        this.shrService
          .deleteSupervisorLogs$(
            data.id,
            { shrId: this.shrId, questionId: data.questionId },
            { displayToast: true, failureResponse: {} }
          )
          .subscribe(() => {
            this.notes = this.notes.filter((note) => note.id !== data.id);
            const notesData =
              this.notes.map((note) => {
                const { id, flatHierarchy, formData, assignedTo } = note;

                const {
                  nodeId,
                  name: nodeName,
                  type
                } = JSON.parse(flatHierarchy)[0];
                let noteTitle = '';
                let task = '';
                let questionId = '';

                const jsonData = JSON.parse(formData);
                jsonData.FORMS.forEach((form) => {
                  form.PAGES.forEach((page) => {
                    page.SECTIONS.forEach((section) => {
                      section.FIELDS.forEach((field) => {
                        if (field.NOTES) {
                          questionId = field.UNIQUEKEY;
                          noteTitle = field.NOTES;
                          task = field.FIELDLABEL;
                        }
                      });
                    });
                  });
                });

                return {
                  id,
                  questionId,
                  title: noteTitle,
                  node: nodeName,
                  nodeId: `${
                    type === 'location' ? 'Location ID: ' : 'Asset ID: '
                  } ${nodeId}`,
                  task,
                  raisedBy: this.operatorRoundService.formatUserFullNameDisplay(
                    assignedTo || 'ayush.solanki@innovapptive.com'
                  )
                };
              }) || [];
            this.dataSource = new MatTableDataSource(notesData);
          });
      }
    });
  }

  updateNotes(data: any): void {
    console.log(data);
    const index = this.notes.findIndex((note) => note.id === data.id);
    this.notes[index].title = data.title;
    this.selectedNote = null;
  }
}
