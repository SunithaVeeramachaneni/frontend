import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { BehaviorSubject, Observable, Subject, combineLatest, of } from 'rxjs';
import { slideInOut } from 'src/app/animations';
import {
  RoundDetail,
  RoundPlan,
  RoundPlanDetail,
  TableEvent
} from 'src/app/interfaces';
import { RaceDynamicFormService } from '../services/rdf.service';
import { FormControl } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { graphQLDefaultLimit } from 'src/app/app.constants';
import { MatTableDataSource } from '@angular/material/table';
import { GetFormList } from 'src/app/interfaces/master-data-management/forms';
@Component({
  selector: 'app-affected-form-template-slider',
  templateUrl: './affected-form-template-slider.component.html',
  styleUrls: ['./affected-form-template-slider.component.scss'],
  animations: [slideInOut]
})
export class AffectedFormTemplateSliderComponent implements OnInit, OnChanges {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Input() selectedForm: any | RoundPlan | RoundPlanDetail | RoundDetail = null;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  formLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ghostLoading = new Array(19).fill(0).map((_, i) => i);
  nextToken = '';
  fetchType = 'load';
  skip = 0;
  limit = graphQLDefaultLimit;
  searchForm: FormControl;
  dataSource: MatTableDataSource<any>;
  forms$: Observable<any>;
  columns: Column[] = [
    {
      id: 'name',
      displayName: 'Form Name',
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
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: 'description',
      subtitleStyle: {
        'font-size': '80%',
        color: 'darkgray',
        display: 'block',
        'white-space': 'wrap',
        'max-width': '350px',
        'overflow-wrap': 'anywhere'
      },
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'plant',
      displayName: 'Plant',
      type: 'string',
      controlType: 'string',
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
      titleStyle: {},
      subtitleStyle: {},
      hasPreTextImage: false,
      hasPostTextImage: false
    },
    {
      id: 'formStatus',
      displayName: 'Status',
      type: 'string',
      controlType: 'string',
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
    }
  ];
  configOptions: ConfigOptions = {
    tableID: 'affectedFormsTable',
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
    tableHeight: '400px',
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
  private onDestroy$ = new Subject();
  constructor(private raceDynamicFormService: RaceDynamicFormService) {}
  ngOnChanges(_: SimpleChanges) {
    this.getDisplayedForms();
  }
  ngOnInit(): void {
    this.raceDynamicFormService.fetchForms$.next({ data: 'load' });
    this.raceDynamicFormService.fetchForms$.next({} as TableEvent);
    this.searchForm = new FormControl('');
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((value: string) => {
          this.raceDynamicFormService.fetchForms$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));
    this.configOptions.allColumns = this.columns;
    this.getDisplayedForms();
  }
  ngOnDestroy(): void {
    this.selectedForm = null;
  }

  getDisplayedForms(): void {
    this.isLoading$.next(true);
    const formsOnLoadSearch$ = this.raceDynamicFormService.fetchForms$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
        this.nextToken = '';
        return this.getForms();
      })
    );

    const onScrollForms$ = this.raceDynamicFormService.fetchForms$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getForms();
        } else {
          return of([] as GetFormList[]);
        }
      })
    );

    const initial = {
      columns: this.columns,
      data: []
    };
    this.forms$ = combineLatest([formsOnLoadSearch$, onScrollForms$]).pipe(
      map(([rows, scrollData]) => {
        if (this.skip === 0) {
          this.configOptions = {
            ...this.configOptions,
            tableHeight: 'calc(100vh - 330px)'
          };
          initial.data = rows;
        } else {
          initial.data = initial.data.concat(scrollData);
        }
        this.skip = initial.data?.length;
        this.dataSource = new MatTableDataSource(initial.data);
        return initial;
      })
    );
  }

  getForms() {
    return this.raceDynamicFormService
      .getAffectedFormList$({
        templateID: this.selectedForm.id,
        nextToken: this.nextToken,
        limit: this.limit,
        searchTerm: this.searchForm.value,
        fetchType: this.fetchType
      })
      .pipe(
        mergeMap(({ count, rows, next }) => {
          this.nextToken = next;
          this.formLoaded$.next(true);
          this.isLoading$.next(false);
          return of(rows);
        }),
        catchError(() => {
          this.formLoaded$.next(true);
          this.isLoading$.next(false);
          return of([]);
        })
      );
  }

  cancelForm() {
    this.slideInOut.emit('in');
    this.selectedForm = null;
    this.onDestroy$;
  }
}
