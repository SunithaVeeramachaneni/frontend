/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { getSection, getSectionsCount, State } from 'src/app/forms/state';
import { SectionEvent, Section } from 'src/app/interfaces';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent implements OnInit {
  @ViewChild('sectionName') sectionName: ElementRef;
  @Input() set pageIndex(pageIndex: number) {
    this._pageIndex = pageIndex;
  }
  get pageIndex() {
    return this._pageIndex;
  }
  @Input() set sectionIndex(sectionIndex: number) {
    this._sectionIndex = sectionIndex;
  }
  get sectionIndex() {
    return this._sectionIndex;
  }
  @Output() sectionEvent: EventEmitter<SectionEvent> =
    new EventEmitter<SectionEvent>();
  isSectionOpenState = true;
  sectionForm: FormGroup = this.fb.group({
    id: '',
    name: {
      value: '',
      disabled: true
    },
    position: ''
  });
  section$: Observable<Section>;
  sectionsCount$: Observable<number>;
  private _pageIndex: number;
  private _sectionIndex: number;

  constructor(private fb: FormBuilder, private store: Store<State>) {}

  ngOnInit() {
    this.sectionForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.sectionEvent.emit({
            section: this.sectionForm.getRawValue(),
            sectionIndex: this.sectionIndex,
            pageIndex: this.pageIndex,
            type: 'update'
          });
        })
      )
      .subscribe();

    this.section$ = this.store
      .select(getSection(this.pageIndex, this.sectionIndex))
      .pipe(
        tap((section) => {
          this.sectionForm.patchValue(section, {
            emitEvent: false
          });
        })
      );

    this.sectionsCount$ = this.store.select(getSectionsCount(this.pageIndex));
  }

  addSection() {
    this.sectionEvent.emit({
      pageIndex: this.pageIndex,
      sectionIndex: this.sectionIndex + 1,
      type: 'add'
    });
  }

  toggleSectionOpenState = () => {
    this.isSectionOpenState = !this.isSectionOpenState;
  };

  editSection() {
    this.sectionForm.get('name').enable();
    this.sectionName.nativeElement.focus();
  }

  deleteSection() {
    this.sectionEvent.emit({
      pageIndex: this.pageIndex,
      sectionIndex: this.sectionIndex,
      section: this.sectionForm.getRawValue(),
      type: 'delete'
    });
  }

  getSize(value) {
    if (value && value === value.toUpperCase()) {
      return value.length;
    }
    return value.length - 1;
  }
}
