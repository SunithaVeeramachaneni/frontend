/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import {
  progressStatus,
  formConfigurationStatus,
  routingUrls
} from '../../../app.constants';
import { ToastService } from 'src/app/shared/toast';
import { FormUpdateProgressService } from '../../services/form-update-progress.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Store } from '@ngrx/store';
import { State, getFormMetadata, getSectionIndexes } from 'src/app/forms/state';
import { getRequestCounter } from '../../state/builder/builder-state.selectors';
import { BuilderConfigurationActions } from '../../state/actions';
import { Router } from '@angular/router';
import { RoundPlanConfigurationService } from '../../services/round-plan-configuration.service';
import { Page, Question, Section } from 'src/app/interfaces';
@Component({
  selector: 'app-ai-form-update-delete-progress',
  templateUrl: './ai-form-update-delete-progress.component.html',
  styleUrls: ['./ai-form-update-delete-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiFormUpdateDeleteProgressComponent implements OnInit, OnDestroy {
  _isOpen: boolean;
  _isExpanded: boolean;
  formMetadata: any[] = [];
  totalCompletedCount = 0;
  isTemplateCreated: boolean;
  currentRouteUrl$: Observable<string>;
  firstEvent: boolean = true;
  sectionIndexes$: Observable<any>;
  questionCount = 0;
  readonly routingUrls = routingUrls;
  private onDestroy$ = new Subject();

  constructor(
    private commonService: CommonService,
    private rdfService: RaceDynamicFormService,
    private cdr: ChangeDetectorRef,
    private formProgressService: FormUpdateProgressService,
    private roundPlanConfigurationServce: RoundPlanConfigurationService,
    private toastService: ToastService,
    private store: Store<State>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isOpen();
    this.isExpanded();
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$;
    this.formUpdateDeletePayload$().subscribe((payload) => {
      if (payload?.forms.length > 0) {
        this.resetCounters();
        payload.forms.map((form) => {
          form.preTextImage = {
            image: 'assets/rdf-forms-icons/formlogo.svg'
          };
          form.progressStatus = progressStatus.inprogress;
          if (this.checkIfFormIdExists(form.uid) === -1) {
            this.formMetadata.unshift(form);
          } else {
            const idx = this.formMetadata.findIndex(
              (data) => data.id === form.uid
            );
            this.formMetadata[idx].progressStatus = progressStatus.inprogress;
          }
          this.formProgressService.aiFirstFormComplete$.next(false);
        });
        this.calculateProgress();
        delete payload.affectedForms;
        this.updateProgress$(payload).subscribe((event) => {
          if (this.firstEvent) {
            this.firstEvent = false;
            this.formProgressService.aiFormProgressIsOpen$.next(true);
            this.putFormInStore(event, payload.plant);
          } else {
            this.updateForm(event);
          }
          this.formProgressService.aiFormLoading$.next(false);
          if (event?.isCompletedForm) {
            this.formProgressService.aiFirstFormComplete$.next(true);
            const idx = this.formMetadata.findIndex(
              (form) => form.uid === event.uid
            );

            this.formMetadata[idx].progressStatus = progressStatus.success;
            this.formMetadata[idx].uid = event.uid;
            this.formMetadata[idx].formlistID = event.formlistID;
            this.calculateProgress();
            // this.showToast();
            this.cdr.detectChanges();
          }
        });
        this.cdr.detectChanges();
      }
    });
  }
  getSectionsArrayFromHTML(inputString: String) {
    const regex = /<li>(.*?)<\/li>/g;
    const matches = inputString.match(regex);

    const sectionsArray = matches.map((match) => {
      const sectionName = match.replace(/<\/?li>/g, '');
      return { sectionName };
    });

    return sectionsArray;
  }
  calculateProgress() {
    if (this.formMetadata.length === 0) {
      this.isOpenToggle(false);
    } else {
      // this.isOpenToggle(true);
    }
    this.totalCompletedCount = this.formMetadata.filter(
      (form) => form.progressStatus !== progressStatus.inprogress
    ).length;
  }

  showToast() {
    if (
      this.totalCompletedCount === this.formMetadata.length &&
      this.formMetadata.length > 0
    ) {
      this.toastService.show({
        type: 'success',
        text: `${this.totalCompletedCount} ${
          this.totalCompletedCount === 1 ? 'Form is' : 'Forms are'
        } updated successfully.`
      });
    }
  }
  closeFormProgressComponent() {
    this.isOpenToggle(false);
    setTimeout(() => {
      this.formMetadata = [];
      this.totalCompletedCount = 0;
    }, 500);
  }

  checkIfFormIdExists(formId) {
    return this.formMetadata.findIndex((form) => form.id === formId);
  }
  formUpdateDeletePayload$() {
    return this.formProgressService.aiFormGeneratePayload$;
  }
  updateProgress$(data: any) {
    return this.rdfService.createFormsFromPrompt$(
      { forms: data.forms },
      data.plantId,
      data.requestCounter
    );
  }
  isOpen() {
    this.formProgressService.aiFormProgressIsOpen$.subscribe((isOpen) => {
      this._isOpen = isOpen;
    });
  }
  isOpenToggle(isOpen?: boolean) {
    this.formProgressService.aiFormProgressIsOpen$.next(
      isOpen ?? !this._isOpen
    );
  }
  isExpanded() {
    this.formProgressService.aiFormProgressisExpanded$.subscribe(
      (isExpanded) => {
        this._isExpanded = isExpanded;
      }
    );
  }
  isExpandedToggle(isExpanded?: boolean) {
    this.formProgressService.aiFormProgressisExpanded$.next(
      isExpanded ?? !this._isExpanded
    );
  }
  resetCounters() {
    if (
      this.formMetadata.length === this.totalCompletedCount &&
      this.totalCompletedCount !== 0
    ) {
      this.formMetadata = [];
      this.totalCompletedCount = 0;
    }
  }

  redirectForm(form) {
    if (form.formlistID) {
      this.router.navigate([`forms/edit/${form.formlistID}`], {
        queryParams: { isCreateAI: true }
      });
    }
  }

  putFormInStore(event, plant) {
    const { section: sectionObject, formList, counter } = event;
    this.store.dispatch(
      BuilderConfigurationActions.addFormMetadata({
        formMetadata: {
          ...formList,
          plant
        },
        formDetailPublishStatus: formConfigurationStatus.draft,
        formSaveStatus: formConfigurationStatus.saving
      })
    );
    this.store.dispatch(
      BuilderConfigurationActions.updateCreateOrEditForm({
        createOrEditForm: true
      })
    );
    this.questionCount = counter;

    // ADD PAGE
    const page: Page = {
      name: 'Page 1',
      isOpen: true,
      position: 1,
      logics: [],
      questions: [],
      sections: []
    };
    this.store.dispatch(
      BuilderConfigurationActions.addPage({
        subFormId: '',
        page,
        pageIndex: 0,
        counter: 0,
        ...this.roundPlanConfigurationServce.getFormConfigurationStatuses()
      })
    );

    const {
      id,
      name,
      isOpen,
      position,
      questions: questionsArray
    } = sectionObject;
    const section: Section = {
      id,
      name,
      isOpen,
      position,
      counter
    };

    const questions: Question[] = [];

    const sections: Section[] = [section];
    const pageIndex = 0;
    const sectionIndex = position - 1;

    this.store.dispatch(
      BuilderConfigurationActions.addSections({
        sections,
        questions,
        pageIndex,
        sectionIndex,
        ...this.roundPlanConfigurationServce.getFormConfigurationStatuses(),
        subFormId: '',
        counter
      })
    );

    this.router.navigate(['/forms/create']);

    this.addQuestionWithDelay(id, questionsArray, 0);
  }

  updateForm(event) {
    const { section: sectionObject, isCompletedForm } = event;
    if (isCompletedForm !== true) {
      const {
        id,
        name,
        isOpen,
        position,
        questions: questionsArray
      } = sectionObject;

      const section: Section = {
        id,
        name,
        isOpen,
        position,
        counter: 0
      };

      const sections: Section[] = [section];
      const questions: Question[] = [];
      const pageIndex = 0;
      const sectionIndex = position - 1;

      this.store.dispatch(
        BuilderConfigurationActions.addSections({
          sections,
          questions,
          pageIndex,
          sectionIndex,
          ...this.roundPlanConfigurationServce.getFormConfigurationStatuses(),
          subFormId: '',
          counter: 0
        })
      );

      this.addQuestionWithDelay(id, questionsArray, 0);

      console.log('SECTION COMPLETED');
    }
  }

  addQuestionWithDelay(id, questionsArray, questionIndex) {
    if (questionIndex >= questionsArray.length) {
      return; // Base case: All questions added
    }

    const currentQuestion = questionsArray[questionIndex];
    console.log('QUESTION: ', currentQuestion);

    const questions: Question[] = [currentQuestion];
    const sectionId = id;
    const counter = this.questionCount + 1;
    const pageIndex = 0;

    this.store.dispatch(
      BuilderConfigurationActions.addQuestions({
        questions,
        pageIndex,
        sectionId,
        questionIndex: currentQuestion.position,
        counter,
        ...this.roundPlanConfigurationServce.getFormConfigurationStatuses()
      })
    );

    setTimeout(() => {
      this.addQuestionWithDelay(id, questionsArray, questionIndex + 1); // Recurse to the next question
    }, 500);
  }

  ngOnDestroy(): void {
    this.formMetadata = [];
    this.totalCompletedCount = 0;
    this.formUpdateDeletePayload$().unsubscribe();
    this.formProgressService.aiFormProgressIsOpen$.unsubscribe();
    this.formProgressService.aiFormProgressisExpanded$.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
