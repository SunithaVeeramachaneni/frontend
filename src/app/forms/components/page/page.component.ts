/* eslint-disable no-underscore-dangle */
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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

  constructor(private fb: FormBuilder, private store: Store<State>) {}

  ngOnInit() {
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

  deletePage() {
    this.pageEvent.emit({ pageIndex: this.pageIndex, type: 'delete' });
  }
}
