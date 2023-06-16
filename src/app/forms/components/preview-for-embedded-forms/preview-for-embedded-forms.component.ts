import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  State,
  getSubFormPages
} from 'src/app/forms/state/builder/builder-state.selectors';
import { fieldTypesMock } from '../response-type/response-types.mock';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';

@Component({
  selector: 'app-preview-for-embedded-forms',
  templateUrl: './preview-for-embedded-forms.component.html',
  styleUrls: ['./preview-for-embedded-forms.component.scss']
})
export class PreviewForEmbeddedFormsComponent implements OnInit, OnChanges {
  @Input() subFormId: any;
  @Input() moduleType: string;
  @Input()
  pageIndex = 1;
  previewFormData$: Observable<any>;
  previewFormData = [];
  isSectionOpenState = true;
  //fieldTypes: any;

  constructor(private imageUtils: ImageUtils, private store: Store<State>) {}

  ngOnChanges() {
    let pageData;
    this.previewFormData$ = this.store
      .select(getSubFormPages(this.subFormId))
      .pipe(
        map((previewFormData) => {
          let sectionData;
          if (previewFormData) {
            console.log(previewFormData);
            pageData = previewFormData.map((page) => {
              sectionData = page.sections.map((section) => {
                const questionsArray = [];
                page.questions.forEach((question) => {
                  if (section.id === question.sectionId) {
                    questionsArray.push(question);
                  }
                });
                return { ...section, questions: questionsArray };
              });
              return { ...page, sections: sectionData };
            });
          }
          return pageData;
        })
      );

    this.previewFormData$.subscribe(console.log);
  }

  ngOnInit(): void {
    //this.fieldTypes = fieldTypesMock.fieldTypes;
  }

  toggleSectionOpenState = () => {
    this.isSectionOpenState = !this.isSectionOpenState;
  };

  getImageSrc(base64) {
    return this.imageUtils.getImageSrc(base64);
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }
}
