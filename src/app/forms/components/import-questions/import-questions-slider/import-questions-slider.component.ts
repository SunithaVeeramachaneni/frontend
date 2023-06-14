import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash-es';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormConfigurationService } from 'src/app/forms/services/form-configuration.service';
import {
  getPagesCount,
  getQuestionCounter,
  getSectionIndexes,
  State
} from 'src/app/forms/state';
import { SectionQuestions } from 'src/app/interfaces';
import { AddPageOrSelectExistingPageModalComponent } from '../add-page-or-select-existing-page-modal/add-page-or-select-existing-page-modal.component';

@Component({
  selector: 'app-import-questions-slider',
  templateUrl: './import-questions-slider.component.html',
  styleUrls: ['./import-questions-slider.component.scss']
})
export class ImportQuestionsSliderComponent implements OnInit {
  @Input() selectedFormName;
  @Input() selectedFormData;
  @Input() currentFormData;
  @Input() isEmbeddedForm;
  @Input() isFooter;
  @Input() title;

  @Output() cancelSliderEvent: EventEmitter<boolean> = new EventEmitter();
  importSectionQuestions: SectionQuestions[] = [];
  sectionIndexes$: Observable<any>;
  sectionIndexes: any;
  pagesCount$: Observable<number>;
  pagesCount: number;
  questionCounter$: Observable<number>;
  questionCounter: number;

  constructor(
    private modal: MatDialog,
    private formConfigurationService: FormConfigurationService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.selectedFormData.forEach((item) => {
      if (item) {
        item.isOpen = false;
        item.sections.forEach((section) => {
          if (section) {
            section.isOpen = false;
          }
        });
      }
    });

    this.sectionIndexes$ = this.store
      .select(getSectionIndexes)
      .pipe(tap((sectionIndexes) => (this.sectionIndexes = sectionIndexes)));

    this.pagesCount$ = this.store
      .select(getPagesCount)
      .pipe(tap((pagesCount) => (this.pagesCount = pagesCount)));

    this.questionCounter$ = this.store
      .select(getQuestionCounter)
      .pipe(tap((questionCounter) => (this.questionCounter = questionCounter)));
  }

  useForm() {
    let importFormData = cloneDeep(this.selectedFormData);
    importFormData.forEach((page) => {
      page.sections = page.sections.filter((section) => {
        section.questions = section.questions.filter(
          (question) => question.checked === true
        );
        return section.questions.length;
      });
    });
    importFormData = importFormData.filter((page) => page.sections.length);
    importFormData.forEach((page) =>
      page.sections.forEach((section) => {
        const questions = section.questions.filter(
          (question) => question.sectionId === section.id
        );
        this.importSectionQuestions = [
          ...this.importSectionQuestions,
          { section, questions }
        ];
      })
    );

    const dialogRef = this.modal.open(
      AddPageOrSelectExistingPageModalComponent,
      {
        data: this.currentFormData
      }
    );

    dialogRef.afterClosed().subscribe((data) => {
      const questionsCount = this.importSectionQuestions.reduce((acc, curr) => {
        acc += curr.questions.length;
        return acc;
      }, 0);
      if (data.selectedPageOption === 'new') {
        this.formConfigurationService.addPage(
          this.pagesCount,
          this.importSectionQuestions.length,
          questionsCount,
          this.sectionIndexes,
          this.questionCounter,
          this.importSectionQuestions
        );
      } else if (data.selectedPageOption === 'existing') {
        this.formConfigurationService.addSections(
          data.selectedPage.position - 1,
          this.importSectionQuestions.length,
          questionsCount,
          data.selectedPage.sections.length,
          this.sectionIndexes,
          this.questionCounter,
          this.importSectionQuestions
        );
      }
      this.cancelSliderEvent.emit(false);
    });
  }
  toggleIsOpen(page) {
    page.isOpen = !page.isOpen;
  }

  cancel() {
    this.cancelSliderEvent.emit(false);
  }

  updateAllChecked(checked, question, section, page) {
    question.checked = checked;
    const countOfSectionChecked = section.questions.filter(
      (per) => per.checked
    ).length;

    const countOfPageChecked = page.sections.filter((p) => p.checked).length;

    if (countOfSectionChecked === 0) section.checked = false;
    if (countOfSectionChecked === section.questions.length)
      section.checked = true;

    if (countOfPageChecked === 0) page.checked = false;
    if (countOfPageChecked === page.sections.length) page.checked = true;
  }

  setAllChecked(checked, page) {
    page.checked = checked;
    page.sections.forEach((section) => {
      section.checked = checked;
      section.questions.forEach((t) => (t.checked = checked));
    });
  }

  setAllSectionChecked(checked, section) {
    section.checked = checked;
    section.questions.forEach((t) => (t.checked = checked));
  }

  checkedSectionCount(section, page) {
    const checkedCount = section.questions.filter((p) => p.checked).length;
    const countOfPageChecked = page.sections.filter((p) => p.checked).length;

    if (countOfPageChecked === 0) page.checked = false;
    if (countOfPageChecked === page.sections.length) page.checked = true;

    return checkedCount > 0 && checkedCount !== section.questions.length;
  }

  fewComplete(page) {
    const checkedCount = page.sections.filter((p) => p.checked).length;

    return checkedCount > 0 && checkedCount !== page.sections.length;
  }
}
