import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { cloneDeep, isEqual } from 'lodash-es';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap
} from 'rxjs/operators';
import { FormConfigurationService } from 'src/app/forms/services/form-configuration.service';
import {
  getPagesCount,
  getQuestionCounter,
  getSectionIndexes,
  State
} from 'src/app/forms/state';
import { SectionQuestions } from 'src/app/interfaces';
import { AddPageOrSelectExistingPageModalComponent } from '../add-page-or-select-existing-page-modal/add-page-or-select-existing-page-modal.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-import-template-questions-slider',
  templateUrl: './import-template-questions-slider.component.html',
  styleUrls: ['./import-template-questions-slider.component.scss']
})
export class ImportTemplateQuestionsSliderComponent
  implements OnInit, OnDestroy
{
  @Input() isFooter;
  @Input() selectedTemplateName;
  @Input() selectedTemplateData;
  @Input() isEmbeddedForm;
  @Input() currentFormData;
  @Input() allTemplates;

  @Output() cancelSliderEvent: EventEmitter<boolean> = new EventEmitter();
  importSectionQuestions: SectionQuestions[] = [];
  sectionIndexes$: Observable<any>;
  sectionIndexes: any;
  pagesCount$: Observable<number>;
  pagesCount: number;
  questionCounter$: Observable<number>;
  questionCounter: number;
  selectedTemplateControl = new FormControl('');
  allTemplateSections = [];
  selectedTemplateSections$ = new BehaviorSubject<any[]>([]);
  searchSections;
  private onDestroy$ = new Subject();

  constructor(
    private modal: MatDialog,
    private formConfigurationService: FormConfigurationService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.searchSections = new FormControl('');

    this.searchSections.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap((res: any) => {
          this.applySearch(res);
        })
      )
      .subscribe();

    this.selectedTemplateControl.valueChanges.subscribe((template) => {
      this.allTemplateSections = this.getTemplateSections(template);
      this.selectedTemplateSections$.next(this.allTemplateSections);
    });

    this.selectedTemplateControl.setValue(this.selectedTemplateData);
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

  applySearch(searchTerm: string) {
    const filteredSections = this.allTemplateSections.filter((item: any) =>
      item.name.toLocaleLowerCase().startsWith(searchTerm.toLocaleLowerCase())
    );
    this.selectedTemplateSections$.next(filteredSections);
  }

  getTemplateSections(template) {
    const filteredTemplate = JSON.parse(
      template.authoredFormTemplateDetails[0].pages
    )[0];
    return filteredTemplate.sections.map((section) => {
      const questionsArray = [];
      filteredTemplate.questions.forEach((question) => {
        if (section.id === question.sectionId) {
          questionsArray.push(question);
        }
      });
      return { ...section, questions: questionsArray, checked: false };
    });
  }

  setSectionChecked(checked, section) {
    console.log(checked, section);
    section.checked = checked;
  }

  useTemplate() {
    let importTemplateData = cloneDeep(this.selectedTemplateSections$.value);

    importTemplateData = importTemplateData.filter(
      (section) => section.checked === true
    );
    importTemplateData.forEach((section) => {
      const questions = section.questions.filter(
        (question) => question.sectionId === section.id
      );
      section.externalSectionID = section.id;
      section.isImported = true;
      section.templateID = this.selectedTemplateControl.value.id;
      this.importSectionQuestions = [
        ...this.importSectionQuestions,
        { section, questions }
      ];
    });

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

  cancel() {
    this.cancelSliderEvent.emit(false);
  }

  compareFn(option1: any, option2: any) {
    return isEqual(option1, option2);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
