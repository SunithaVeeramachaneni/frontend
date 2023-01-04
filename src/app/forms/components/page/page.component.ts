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
import { getPage, State } from 'src/app/forms/state';
import { AddPageEvent, Page } from 'src/app/interfaces';
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageComponent implements OnInit {
  @Input() set pageIndex(pageIndex: number) {
    this._pageIndex = pageIndex;
  }
  get pageIndex() {
    return this._pageIndex;
  }

  @Output() addPageEvent: EventEmitter<AddPageEvent> =
    new EventEmitter<AddPageEvent>();

  isPageOpenState = true;
  pageForm: FormGroup = this.fb.group({
    name: '',
    position: ''
  });
  page$: Observable<Page>;
  private _pageIndex: number;

  constructor(private fb: FormBuilder, private store: Store<State>) {}

  ngOnInit() {
    this.page$ = this.store.select(getPage(this.pageIndex)).pipe(
      tap((page) => {
        this.pageForm.patchValue(page, {
          emitEvent: false
        });
      })
    );
  }

  addPage(position: number) {
    this.addPageEvent.emit({ pageIndex: position });
  }

  togglePageOpenState = () => {
    this.isPageOpenState = !this.isPageOpenState;
  };

  deletePage() {
    //delete
  }
}
