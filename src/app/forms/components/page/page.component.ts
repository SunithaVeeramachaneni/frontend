/* eslint-disable no-underscore-dangle */
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  takeUntil,
  tap
} from 'rxjs/operators';
import { State } from 'src/app/forms/state/builder/builder-state.selectors';
import { PageEvent, Page } from 'src/app/interfaces';
import { BuilderConfigurationActions } from '../../state/actions';
import { isEqual } from 'lodash-es';
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageComponent implements OnInit, OnDestroy {
  @ViewChild('pageName') pageName: ElementRef;
  @Input() selectedNodeId: any;
  @Input() isEmbeddedForm: boolean;

  @Input() set pageIndex(pageIndex: number) {
    this._pageIndex = pageIndex;
  }
  get pageIndex() {
    return this._pageIndex;
  }

  @Input() set page(page: Page) {
    console.log('before inside page...');
    if (page) {
      if (!isEqual(this.page, page)) {
        this._page = page;
        console.log('inside page...');
        this.pageForm.patchValue(page, {
          emitEvent: false
        });
      }
    }
  }
  get page() {
    return this._page;
  }

  @Input() set pageQuestionsCount(count: number) {
    this._pageQuestionsCount = count;
  }
  get pageQuestionsCount() {
    return this._pageQuestionsCount;
  }

  @Output() pageEvent: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  pageForm: FormGroup = this.fb.group({
    name: {
      value: '',
      disabled: true
    },
    position: '',
    isOpen: true
  });
  private _pageIndex: number;
  private _page: Page;
  private _pageQuestionsCount: number;
  private onDestroy$ = new Subject();

  constructor(private fb: FormBuilder, private store: Store<State>) {}

  ngOnInit() {
    this.pageForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        pairwise(),
        tap(([previous, current]) => {
          const { isOpen, ...prev } = previous;
          const { isOpen: currIsOpen, ...curr } = current;
          console.log('before inside page changes...');
          if (prev !== curr) {
            console.log('inside page changes...');
            this.pageEvent.emit({
              page: this.pageForm.getRawValue(),
              pageIndex: this.pageIndex,
              type: 'update'
            });
          }
        })
      )
      .subscribe();
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
