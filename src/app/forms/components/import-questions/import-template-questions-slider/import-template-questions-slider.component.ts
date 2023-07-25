import {
  ChangeDetectionStrategy,
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
import { BehaviorSubject, Observable, Subject, Subscription, of } from 'rxjs';
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
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import { updateForm } from 'src/app/forms/state/builder/builder.actions';

@Component({
  selector: 'app-import-template-questions-slider',
  templateUrl: './import-template-questions-slider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  sectionCheckedCount = 0;
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
  searchSections = new FormControl('');
  formTemplateUsage: any = {};
  getFormTemplateUsageSubscription: Subscription;
  updateFormTemplateUsageByFormIdSubscription: Subscription;
  updateformTemplateListSuscription: Subscription;
  private onDestroy$ = new Subject();

  constructor(
    private modal: MatDialog,
    private formConfigurationService: FormConfigurationService,
    private raceDynamicFormService: RaceDynamicFormService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
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

    this.selectedTemplateControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((template) => {
        this.sectionCheckedCount = 0;
        this.getFormTemplateUsageSubscription = this.raceDynamicFormService
          .getFormTemplateUsage$({
            formId: this.currentFormData.formMetadata.id,
            templateId: template.id
          })
          .subscribe((res) => {
            this.updateFormTemplateUsageByFormId(res[0], template.id);
          });
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

  updateFormTemplateUsageByFormId(res, templateId) {
    this.formTemplateUsage = {
      formId: this.currentFormData.formMetadata.id,
      templateId,
      sections: res?.sections ? JSON.parse(res.sections) : {}
    };
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
      const questionsInSection = {};
      filteredTemplate.questions.forEach((question) => {
        if (section.id === question.sectionId) {
          questionsInSection[question.id] = 1;
          questionsArray.push(question);
        }
      });
      const logicsArray = filteredTemplate.logics.filter(
        (logic) => questionsInSection[logic.questionId] === 1
      );
      return {
        ...section,
        questions: questionsArray,
        logics: logicsArray,
        checked: false
      };
    });
  }

  setSectionChecked(checked, section) {
    section.checked = checked;
    if (checked) this.sectionCheckedCount++;
    else this.sectionCheckedCount--;
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
      const logics = section.logics;
      delete section.logics;
      section.externalSectionId = section.id;
      section.isImported = true;
      section.templateId = this.selectedTemplateControl.value.id;
      section.templateName = this.selectedTemplateControl.value.name;
      this.importSectionQuestions = [
        ...this.importSectionQuestions,
        { section, questions, logics }
      ];
    });

    const dialogRef = this.modal.open(
      AddPageOrSelectExistingPageModalComponent,
      {
        data: this.currentFormData
      }
    );

    dialogRef.afterClosed().subscribe((data) => {
      const sectionCounters = JSON.parse(
        this.selectedTemplateControl.value?.sectionCounters || '{}'
      );
      for (const section of importTemplateData) {
        this.formTemplateUsage.sections[section.externalSectionId] = 1;
        if (!sectionCounters[this.formTemplateUsage.formId])
          sectionCounters[this.formTemplateUsage.formId] = {};
        if (
          sectionCounters[this.formTemplateUsage.formId][
            section.externalSectionId
          ]
        ) {
          sectionCounters[this.formTemplateUsage.formId][
            section.externalSectionId
          ] = ++sectionCounters[this.formTemplateUsage.formId][
            section.externalSectionId
          ];
        } else {
          sectionCounters[this.formTemplateUsage.formId][
            section.externalSectionId
          ] = 1;
        }
      }

      this.importSectionQuestions.forEach((d) => {
        d.section.counter =
          sectionCounters[this.formTemplateUsage.formId][
            d.section.externalSectionId
          ];
        d.questions.forEach(
          (question) =>
            (question.id =
              question.id +
              `_${
                sectionCounters[this.formTemplateUsage.formId][
                  d.section.externalSectionId
                ]
              }`)
        );
        d.logics.forEach((logic) => {
          logic.id =
            logic.id +
            `_${
              sectionCounters[this.formTemplateUsage.formId][
                d.section.externalSectionId
              ]
            }`;
          logic.questionId =
            logic.questionId +
            `_${
              sectionCounters[this.formTemplateUsage.formId][
                d.section.externalSectionId
              ]
            }`;
          logic.evidenceQuestions = logic.evidenceQuestions.map(
            (item) =>
              (item =
                item +
                `_${
                  sectionCounters[this.formTemplateUsage.formId][
                    d.section.externalSectionId
                  ]
                }`)
          );
          logic.mandateQuestions = logic.mandateQuestions.map(
            (item) =>
              (item =
                item +
                `_${
                  sectionCounters[this.formTemplateUsage.formId][
                    d.section.externalSectionId
                  ]
                }`)
          );
          logic.hideQuestions = logic.hideQuestions.map(
            (item) =>
              (item =
                item +
                `_${
                  sectionCounters[this.formTemplateUsage.formId][
                    d.section.externalSectionId
                  ]
                }`)
          );
          logic.questions.forEach((question) => {
            question.id =
              question.id +
              `_${
                sectionCounters[this.formTemplateUsage.formId][
                  d.section.externalSectionId
                ]
              }`;
            question.sectionId =
              question.sectionId +
              `_${
                sectionCounters[this.formTemplateUsage.formId][
                  d.section.externalSectionId
                ]
              }`;
            d.questions.push({
              ...question,
              id: question.id,
              sectonId: question.sectionId
            });
          });
        });
      });
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
      const updateFormTemplateUsageByFormIdPayload = {
        formId: this.formTemplateUsage.formId,
        importedSections: {}
      };
      updateFormTemplateUsageByFormIdPayload.importedSections[
        this.formTemplateUsage.templateId
      ] = this.formTemplateUsage.sections;
      this.updateFormTemplateUsageByFormIdSubscription =
        this.raceDynamicFormService
          .updateFormTemplateUsageByFormId$(
            updateFormTemplateUsageByFormIdPayload
          )
          .subscribe((res) => {
            this.updateFormTemplateUsageByFormId(
              res,
              this.selectedTemplateControl.value.id
            );
          });
      this.updateformTemplateListSuscription = this.raceDynamicFormService
        .updateTemplate$(this.formTemplateUsage.templateId, {
          sectionCounters
        })
        .subscribe((res) => {
          this.selectedTemplateControl.patchValue({
            sectionCounters: res.sectionCounters
          });
        });
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
    if (this.getFormTemplateUsageSubscription) {
      this.getFormTemplateUsageSubscription.unsubscribe();
    }
    if (this.updateFormTemplateUsageByFormIdSubscription) {
      this.updateFormTemplateUsageByFormIdSubscription.unsubscribe();
    }
    if (this.updateformTemplateListSuscription) {
      this.updateformTemplateListSuscription.unsubscribe();
    }
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
