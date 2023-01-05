/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { getSection, State } from 'src/app/forms/state';
import {
  AddSectionEvent,
  Section,
  UpdateSectionEvent
} from 'src/app/interfaces';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent implements OnInit {
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
  @Output() addSectionEvent: EventEmitter<AddSectionEvent> =
    new EventEmitter<AddSectionEvent>();
  @Output() updateSectionEvent: EventEmitter<UpdateSectionEvent> =
    new EventEmitter<UpdateSectionEvent>();
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
  private _pageIndex: number;
  private _sectionIndex: number;

  constructor(private fb: FormBuilder, private store: Store<State>) {}

  ngOnInit() {
    this.sectionForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.updateSectionEvent.emit({
          section: this.sectionForm.getRawValue(),
          pageIndex: this.pageIndex
        });
      });

    this.section$ = this.store
      .select(getSection(this.pageIndex, this.sectionIndex))
      .pipe(
        tap((section) => {
          this.sectionForm.patchValue(section, {
            emitEvent: false
          });
        })
      );
  }

  addSection(position: number) {
    this.addSectionEvent.emit({
      pageIndex: this.pageIndex,
      sectionIndex: position
    });
  }

  toggleSectionOpenState = () => {
    this.isSectionOpenState = !this.isSectionOpenState;
  };

  editSection() {
    this.sectionForm.get('name').enable();
  }

  deleteSection() {}

  getSize(value) {
    if (value && value === value.toUpperCase()) {
      return value.length;
    }
    return value.length - 1;
  }
}
