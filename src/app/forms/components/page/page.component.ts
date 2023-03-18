/* eslint-disable no-underscore-dangle */
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  tap
} from 'rxjs/operators';
import {
  getPage,
  getPagesCount,
  getTaskCountByPage,
  State
} from 'src/app/forms/state/builder/builder-state.selectors';
import { PageEvent, Page } from 'src/app/interfaces';
import { BuilderConfigurationActions } from '../../state/actions';
// import { FormConfigurationActions } from '../../state/actions';
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageComponent implements OnInit {
  @ViewChild('pageName') pageName: ElementRef;
  @Input() selectedNodeId: any;

  @Input() set pageIndex(pageIndex: number) {
    this._pageIndex = pageIndex;
  }
  get pageIndex() {
    return this._pageIndex;
  }

  @Output() pageEvent: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  pageForm: FormGroup = this.fb.group({
    name: '',
    position: '',
    isOpen: true
  });
  page$: Observable<Page>;
  pagesCount$: Observable<number>;
  pageTasksCount$: Observable<number>;
  private _pageIndex: number;
  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.pageForm
      .get('name')
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        pairwise(),
        tap(([previous, current]) => {
          if (previous !== current) {
            this.pageEvent.emit({
              page: this.pageForm.getRawValue(),
              pageIndex: this.pageIndex,
              type: 'update'
            });
            this.cdrf.markForCheck();
          }
        })
      )
      .subscribe();

    this.page$ = this.store
      .select(getPage(this.pageIndex, this.selectedNodeId))
      .pipe(
        tap((page) => {
          this.pageForm.patchValue(page, {
            emitEvent: false
          });
        })
      );

    this.pagesCount$ = this.store.select(getPagesCount(this.selectedNodeId));
    this.pageTasksCount$ = this.store.select(
      getTaskCountByPage(this.pageIndex, this.selectedNodeId)
    );
  }

  addPage() {
    this.pageEvent.emit({ pageIndex: this.pageIndex + 1, type: 'add' });
  }

  toggleIsOpenState = () => {
    this.pageForm.get('isOpen').setValue(!this.pageForm.get('isOpen').value);
    this.store.dispatch(
      BuilderConfigurationActions.updatePageState({
        pageIndex: this.pageIndex,
        isOpen: this.pageForm.get('isOpen').value,
        subFormId: this.selectedNodeId
      })
    );
  };
  editPage() {
    this.pageForm.get('name').enable();
    this.pageName.nativeElement.focus();
  }
  deletePage() {
    this.pageEvent.emit({ pageIndex: this.pageIndex, type: 'delete' });
  }
  getSize(value) {
    if (value && value === value.toUpperCase()) {
      return value.length;
    }
    return value.length - 1;
  }
}
