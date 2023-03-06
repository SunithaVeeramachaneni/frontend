import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State, getPages } from 'src/app/forms/state';
import { Observable } from 'rxjs';
import { fieldTypesMock } from '../response-type/response-types.mock';
import { map, tap } from 'rxjs/operators';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnChanges {
  @Input()
  pageIndex = 1;

  isSectionOpenState = true;
  fieldTypes: any;
  arrayField = false;
  sliderOptions = {
    value: 0,
    min: 0,
    max: 100,
    increment: 1
  };
  previewFormData$: Observable<any>;
  previewFormData = [];

  constructor(private store: Store<State>, private imageUtils: ImageUtils) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.page && changes.page.currentValue) {
      this.pageIndex = changes.page.currentValue;
    }
  }

  formatLabel(value: number): string {
    return `${value}`;
  }

  ngOnInit(): void {
    this.fieldTypes = fieldTypesMock.fieldTypes;
    let pageData;
    this.previewFormData$ = this.store.select(getPages).pipe(
      map((previewFormData) => {
        let sectionData;
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
        return pageData;
      })
    );
  }

  getImageSrc(base64) {
    return this.imageUtils.getImageSrc(base64);
  }

  openBottomSheet(): void {
    this.arrayField = !this.arrayField;
  }

  toggleSectionOpenState = () => {
    this.isSectionOpenState = !this.isSectionOpenState;
  };

  openURL = (question: any) => {
    if (question.link.length) {
      window.open(question.link);
    }
  };
}
