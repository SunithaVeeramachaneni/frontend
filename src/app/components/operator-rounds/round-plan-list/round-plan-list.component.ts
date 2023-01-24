import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  mergeMap,
  map,
  switchMap,
  tap,
  catchError
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { MatTableDataSource } from '@angular/material/table';

import {
  CellClickActionEvent,
  Count,
  TableEvent,
  FormTableUpdate
} from 'src/app/interfaces';
import { defaultLimit, formConfigurationStatus } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';
import {
  GetFormListQuery,
  UpdateRoundPlanListMutation
} from 'src/app/API.service';
import { Router } from '@angular/router';
import { omit } from 'lodash-es';
import { Store } from '@ngrx/store';
import { OPRState } from 'src/app/forms/state';
import {
  FormConfigurationActions,
  RoundPlanConfigurationActions
} from 'src/app/forms/state/actions';
import {
  generateCopyNumber,
  generateCopyRegex
} from '../../race-dynamic-form/utils/utils';
import { OperatorRoundsService } from '../services/operator-rounds.service';

@Component({
  selector: 'app-round-plan-list',
  templateUrl: './round-plan-list.component.html',
  styleUrls: ['./round-plan-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translate3d(0,0,0)'
        })
      ),
      state(
        'out',
        style({
          transform: 'translate3d(100%, 0, 0)'
        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class RoundPlanListComponent implements OnInit {
  public menuState = 'out';
  submissionSlider = 'out';

  columns: Column[] = [
    {
      id: 'name',
      displayName: 'Plan Name',
      type: 'string',
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
        color: '#000000'
      },
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: 'description',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'formStatus',
      displayName: 'Status',
      type: 'string',
      order: 2,
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
        textTransform: 'capitalize',
        fontWeight: 500,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: '10px',
        width: '80px',
        height: '24px',
        background: '#FEF3C7',
        color: '#92400E',
        borderRadius: '12px'
      },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false,
      hasConditionalStyles: true
    },
    {
      id: 'lastPublishedBy',
      displayName: 'Last Published By',
      type: 'number',
      order: 3,
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
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'publishedDate',
      displayName: 'Last Published',
      type: 'timeAgo',
      order: 4,
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
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'author',
      displayName: 'Owner',
      type: 'number',
      isMultiValued: true,
      order: 5,
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
      groupable: false,
      titleStyle: { color: '' },
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    }
  ];

  configOptions: ConfigOptions = {
    tableID: 'formsTable',
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
  forms$: Observable<any>;
  formsCount$: Observable<Count>;
  addEditCopyForm$: BehaviorSubject<FormTableUpdate> =
    new BehaviorSubject<FormTableUpdate>({
      action: null,
      form: {} as any
    });
  formCountUpdate$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  skip = 0;
  limit = defaultLimit;
  searchForm: FormControl;
  addCopyFormCount = false;
  isPopoverOpen = false;
  formsListCount$: Observable<number>;
  filterIcon = 'assets/maintenance-icons/filterIcon.svg';
  closeIcon = 'assets/img/svg/cancel-icon.svg';
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
  nextToken = '';
  selectedForm: GetFormListQuery = null;
  fetchType = 'load';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  constructor(
    private readonly toast: ToastService,
    private readonly operatorRoundsService: OperatorRoundsService,
    private router: Router,
    private readonly store: Store<OPRState>
  ) {}

  ngOnInit(): void {
    this.operatorRoundsService.fetchForms$.next({ data: 'load' });
    this.operatorRoundsService.fetchForms$.next({} as TableEvent);
    this.searchForm = new FormControl('');

    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.operatorRoundsService.fetchForms$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
    this.formsListCount$ = this.operatorRoundsService.getFormsListCount$();
    this.getDisplayedForms();

    this.formsCount$ = combineLatest([
      this.formsCount$,
      this.formCountUpdate$
    ]).pipe(
      map(([count, update]) => {
        if (this.addCopyFormCount) {
          count.count += update;
          this.addCopyFormCount = false;
        }
        return count;
      })
    );
    this.configOptions.allColumns = this.columns;
    this.prepareMenuActions();
  }

  cellClickActionHandler = (event: CellClickActionEvent): void => {
    const { columnId, row } = event;
    switch (columnId) {
      case 'name':
      case 'description':
      case 'author':
      case 'formStatus':
      case 'lastPublishedBy':
      case 'publishedDate':
      case 'responses':
        this.showFormDetail(row);
        break;
      default:
    }
  };

  onCopyFormMetaData(form: GetFormListQuery): void {
    if (!form.id) {
      return;
    }
    combineLatest([
      this.operatorRoundsService.fetchAllFormListNames$(),
      this.operatorRoundsService.getAuthoredFormDetailByFormId$(form.id)
    ])
      .pipe(
        map(([formNames, authoredFormDetail]) => ({
          formNames,
          authoredFormDetail
        }))
      )
      .subscribe(({ formNames, authoredFormDetail }) => {
        const createdForm = this.generateCopyFormName(form, formNames);
        if (createdForm?.newName) {
          this.operatorRoundsService
            .createForm$({
              ...omit(form, ['id', 'preTextImage']),
              name: createdForm.newName,
              formStatus: formConfigurationStatus.draft,
              isPublic: false
            })
            .subscribe((newRecord) => {
              if (!newRecord) {
                return;
              }
              if (authoredFormDetail?.length > 0) {
                for (const obj of authoredFormDetail) {
                  if (obj) {
                    this.operatorRoundsService.createAuthoredFormDetail$({
                      formStatus: obj?.formStatus,
                      formDetailPublishStatus: 'Draft',
                      formListId: newRecord?.id,
                      pages: JSON.parse(obj?.pages) ?? '',
                      counter: obj?.counter,
                      authoredFormDetailVersion: 1
                    });
                  }
                }
              }
              this.addEditCopyForm$.next({
                action: 'copy',
                form: {
                  ...newRecord,
                  name: createdForm.newName,
                  preTextImage: (form as any)?.preTextImage,
                  oldId: form.id
                } as any
              });
              this.formsListCount$ =
                this.operatorRoundsService.getFormsListCount$();
            });
        }
      });
  }

  getDisplayedForms(): void {
    const formsOnLoadSearch$ = this.operatorRoundsService.fetchForms$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
        return this.getForms();
      })
    );

    const onScrollForms$ = this.operatorRoundsService.fetchForms$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getForms();
        } else {
          return of([] as GetFormListQuery[]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: []
    };
    this.forms$ = combineLatest([
      formsOnLoadSearch$,
      this.addEditCopyForm$,
      onScrollForms$
    ]).pipe(
      map(([rows, form, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(80vh - 105px)'
          };
          initial.data = rows;
        } else {
          if (form.action === 'copy') {
            const obj = { ...form.form } as any;
            const oldIdx = initial?.data?.findIndex(
              (d) => d?.id === obj?.oldId
            );
            const newIdx = oldIdx !== -1 ? oldIdx : 0;
            initial.data.splice(newIdx, 0, obj);
            form.action = 'add';
            this.toast.show({
              text: 'Form copied successfully!',
              type: 'success'
            });
          }
          if (form.action === 'delete') {
            initial.data = initial.data.filter((d) => d.id !== form.form.id);
            this.toast.show({
              text: 'Form archive successfully!',
              type: 'success'
            });
          } else {
            initial.data = initial.data.concat(scrollData);
          }
        }

        this.skip = initial.data.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getForms() {
    return this.operatorRoundsService
      .getFormsList$({
        nextToken: this.nextToken,
        limit: this.limit,
        searchKey: this.searchForm.value,
        fetchType: this.fetchType
      })
      .pipe(
        mergeMap(({ count, rows, nextToken }) => {
          this.formsCount$ = of({ count });
          this.nextToken = nextToken;
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.formsCount$ = of({ count: 0 });
          this.isLoading$.next(false);
          return of([]);
        })
      );
  }

  openArchiveModal(form: any): void {
    this.operatorRoundsService
      .updateForm$({
        formMetadata: {
          id: form?.id,
          isArchived: true
        },
        // eslint-disable-next-line no-underscore-dangle
        formListDynamoDBVersion: form._version
      })
      .subscribe((updatedForm: any) => {
        this.addEditCopyForm$.next({
          action: 'delete',
          form: updatedForm
        });
        this.formsListCount$ = this.operatorRoundsService.getFormsListCount$();
      });
  }

  rowLevelActionHandler = ({ data, action }): void => {
    switch (action) {
      case 'copy':
        this.onCopyFormMetaData(data);
        break;

      case 'edit':
        this.router.navigate(['/operator-rounds/edit', data.id]);
        break;

      case 'archive':
        this.openArchiveModal(data);
        break;
      default:
    }
  };

  handleTableEvent = (event): void => {
    this.operatorRoundsService.fetchForms$.next(event);
  };

  configOptionsChangeHandler = (event): void => {
    // console.log('event', event);
  };

  prepareMenuActions(): void {
    const menuActions = [
      {
        title: 'Edit',
        action: 'edit'
      },
      {
        title: 'Copy',
        action: 'copy'
      }
      /* {
        title: 'Archive',
        action: 'archive'
      },
      {
        title: 'Upload to Public Library',
        action: 'upload'
      } */
    ];
    this.configOptions.rowLevelActions.menuActions = menuActions;
    this.configOptions.displayActionsColumn = menuActions.length ? true : false;
    this.configOptions = { ...this.configOptions };
  }

  onCloseViewDetail() {
    this.selectedForm = null;
    this.menuState = 'out';
    this.store.dispatch(RoundPlanConfigurationActions.resetPages());
  }
  roundPlanDetailActionHandler(event) {
    this.store.dispatch(RoundPlanConfigurationActions.resetPages());
    this.router.navigate([`/operator-rounds/edit/${this.selectedForm.id}`]);
  }

  private generateCopyFormName(form: GetFormListQuery, rows: any[]) {
    if (rows?.length > 0) {
      const listCopyNumbers: number[] = [];
      const regex: RegExp = generateCopyRegex(form?.name);
      rows?.forEach((row) => {
        const matchObject = row?.name?.match(regex);
        if (matchObject) {
          listCopyNumbers.push(parseInt(matchObject[1], 10));
        }
      });
      const newIndex: number = generateCopyNumber(listCopyNumbers);
      const newName = `${form?.name} Copy(${newIndex})`;
      return {
        newName
      };
    }
    return null;
  }

  private showFormDetail(row: GetFormListQuery): void {
    this.store.dispatch(RoundPlanConfigurationActions.resetPages());
    this.selectedForm = row;
    this.menuState = 'in';
  }
}
