import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  State,
  getSubFormPages
} from 'src/app/forms/state/builder/builder-state.selectors';
import { Observable } from 'rxjs';
import { fieldTypesMock } from '../response-type/response-types.mock';
import { map } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit, OnChanges {
  @Input() subFormId: any;
  @Input() moduleType: string;
  @Output() totalPageCount = new EventEmitter();
  @Output() isOpenBottomSheet = new EventEmitter();

  @Input()
  pageIndex = 1;

  isOpen = true;
  fieldTypes: any;
  sliderOptions = {
    value: 0,
    min: 0,
    max: 100,
    increment: 1
  };
  previewFormData$: Observable<any>;
  previewFormData = [];
  sectionsData: any[];
  constructor(private store: Store<State>) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.page && changes.page.currentValue) {
      this.pageIndex = changes.page.currentValue;
    }
    if (
      changes.subFormId &&
      changes.subFormId.currentValue !== changes.subFormId.previousValue
    ) {
      let pageData;
      this.previewFormData$ = this.store
        .select(getSubFormPages(this.subFormId))
        .pipe(
          map((previewFormData) => {
            let sectionData;
            if (previewFormData) {
              pageData = previewFormData.map((page) => {
                sectionData = page.sections.map((section) => {
                  const questionsArray = [];
                  page.questions.forEach((question) => {
                    if (section.id === question.sectionId) {
                      if (question.fieldType === 'INST')
                        questionsArray.push({
                          ...question,
                          pageIndex: this.pageIndex,
                          subFormId: this.subFormId
                        });
                      else questionsArray.push(question);
                    }
                  });
                  return { ...section, questions: questionsArray };
                });
                this.sectionsData = sectionData;
                return { ...page, sections: sectionData };
              });
            }
            if (pageData) this.totalPageCount.emit(pageData.length);
            return pageData;
          })
        );
    }
  }

  ngOnInit(): void {
    this.fieldTypes = fieldTypesMock.fieldTypes;
  }

  toggleSectionOpenState = (sectionIdx: number, pageData): void => {
    const pageSection = pageData.sections[sectionIdx];
    if (pageSection) {
      pageSection.isOpen = !pageSection.isOpen;
    }
  };

  openBottomSheet(isOpenBottomSheet) {
    this.isOpenBottomSheet.emit(isOpenBottomSheet);
  }
}
