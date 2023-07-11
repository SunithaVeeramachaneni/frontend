/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  takeUntil,
  tap
} from 'rxjs/operators';
import { State } from 'src/app/forms/state/builder/builder-state.selectors';
import { SectionEvent, Section } from 'src/app/interfaces';
import { BuilderConfigurationActions } from '../../state/actions';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent implements OnInit, OnDestroy {
  @ViewChild('sectionName') sectionName: ElementRef;
  @Input() isTemplate: boolean;
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
  @Input() set sectionId(sectionId: string) {
    this._sectionId = sectionId;
  }
  get sectionId() {
    return this._sectionId;
  }

  @Input() set sectionQuestionsCount(count: number) {
    this._sectionQuestionsCount = count;
  }
  get sectionQuestionsCount() {
    return this._sectionQuestionsCount;
  }

  @Input() set section(section: Section) {
    if (section) {
      if (!isEqual(this.section, section)) {
        this._section = section;
        this.sectionForm.patchValue(section, {
          emitEvent: false
        });
      }
    }
  }
  get section() {
    return this._section;
  }

  @Input() selectedNodeId: any;

  @Output() sectionEvent: EventEmitter<SectionEvent> =
    new EventEmitter<SectionEvent>();
  sectionForm: FormGroup = this.fb.group({
    id: '',
    name: {
      value: '',
      disabled: true
    },
    position: '',
    isOpen: true
  });
  private _pageIndex: number;
  private _sectionIndex: number;
  private _sectionId: string;
  private _section: Section;
  private _sectionQuestionsCount: number;
  private onDestroy$ = new Subject();

  constructor(private fb: FormBuilder, private store: Store<State>) {}

  ngOnInit() {
    this.sectionForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        pairwise(),
        tap(([previous, current]) => {
          const { isOpen, ...prev } = previous;
          const { isOpen: currIsOpen, ...curr } = current;
          if (!isEqual(prev, curr)) {
            this.sectionEvent.emit({
              section: this.sectionForm.getRawValue(),
              sectionIndex: this.sectionIndex,
              pageIndex: this.pageIndex,
              type: 'update'
            });
          }
        })
      )
      .subscribe();
  }

  addSection() {
    this.sectionEvent.emit({
      pageIndex: this.pageIndex,
      sectionIndex: this.sectionIndex + 1,
      type: 'add'
    });
  }

  toggleIsOpenState = () => {
    this.sectionForm
      .get('isOpen')
      .setValue(!this.sectionForm.get('isOpen').value);
    this.store.dispatch(
      BuilderConfigurationActions.updateSectionState({
        sectionId: this.sectionId,
        pageIndex: this.pageIndex,
        isOpen: this.sectionForm.get('isOpen').value,
        subFormId: this.selectedNodeId
      })
    );
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
