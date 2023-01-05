import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  AddPageEvent,
  AddQuestionEvent,
  AddSectionEvent,
  FormMetadata,
  Page,
  UpdateQuestionEvent,
  UpdateSectionEvent
} from 'src/app/interfaces';
import {
  getFormMetadata,
  getPageIndexes,
  getPages,
  getQuestionIndexes,
  getSectionIds,
  getSectionIndexes,
  getPublishFormDetails,
  State
} from 'src/app/forms/state';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { RaceDynamicFormService } from '../services/rdf.service';

@Component({
  selector: 'app-form-configuration',
  templateUrl: './form-configuration.component.html',
  styleUrls: ['./form-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormConfigurationComponent implements OnInit, OnDestroy {
  formConfiguration: FormGroup;
  formMetadata$: Observable<FormMetadata>;
  pageIndexes$: Observable<number[]>;
  pages$: Observable<Page[]>;
  formDetails$: Observable<any>;
  sectionIndexes$: Observable<any>;
  sectionIndexes: any;
  sectionIds$: Observable<any>;
  questionIndexes$: Observable<any>;
  questionIndexes: any;

  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private raceDynamicFormService: RaceDynamicFormService
  ) {}

  ngOnInit(): void {
    this.formConfiguration = this.fb.group({
      id: [''],
      formLogo: [''],
      name: [''],
      description: [''],
      counter: [0],
      formStatus: ['draft']
    });

    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap((formMetadata) => {
        const { name, description } = formMetadata;
        this.formConfiguration.patchValue({ name, description });
      })
    );
    this.pageIndexes$ = this.store.select(getPageIndexes);
    this.sectionIndexes$ = this.store
      .select(getSectionIndexes)
      .pipe(tap((sectionIndexes) => (this.sectionIndexes = sectionIndexes)));
    this.sectionIds$ = this.store.select(getSectionIds);
    this.questionIndexes$ = this.store
      .select(getQuestionIndexes)
      .pipe(tap((questionIndexes) => (this.questionIndexes = questionIndexes)));

    this.store.dispatch(
      FormConfigurationActions.addPage({
        page: this.getPageObject(0, 0, 0),
        pageIndex: 0
      })
    );
    this.formDetails$ = this.store.select(getPublishFormDetails);
    this.formConfiguration.valueChanges.subscribe(console.log);
    this.pages$ = this.store.select(getPages).pipe(tap((pages) => pages));
    // this.pages$.subscribe(console.log);
    // this.store.select(getFormMetadata).subscribe(console.log);
  }

  get formConf() {
    return this.formConfiguration.controls;
  }

  getPageObject(
    pageIndex: number,
    sectionIndex: number,
    questionIndex: number
  ) {
    const section = this.getSection(pageIndex, sectionIndex);
    return {
      name: 'Page',
      position: pageIndex + 1,
      sections: [section],
      questions: [this.getQuestion(questionIndex, section.id)]
    };
  }

  getSection(pageIndex: number, sectionIndex: number) {
    return {
      id: `S${
        this.sectionIndexes && this.sectionIndexes[pageIndex]
          ? this.sectionIndexes[pageIndex].length + 1
          : 1
      }`,
      name: 'Section',
      position: sectionIndex + 1
    };
  }

  getQuestion(questionIndex: number, sectionId: string) {
    this.formConf.counter.setValue(this.formConf.counter.value + 1);
    return {
      id: `Q${this.formConf.counter.value}`,
      sectionId,
      name: '',
      fieldType: 'TF',
      position: questionIndex + 1,
      required: false,
      multi: false,
      value: '',
      isPublished: false,
      isPublishedTillSave: false
    };
  }

  addPageEventHandler(event: AddPageEvent) {
    const { pageIndex } = event;
    this.store.dispatch(
      FormConfigurationActions.addPage({
        page: this.getPageObject(pageIndex, 0, 0),
        pageIndex
      })
    );
  }

  addSectionEventHandler(event: AddSectionEvent) {
    const { pageIndex, sectionIndex } = event;
    const section = this.getSection(pageIndex, sectionIndex);
    this.store.dispatch(
      FormConfigurationActions.addSection({
        section,
        question: this.getQuestion(0, section.id),
        pageIndex,
        sectionIndex
      })
    );
  }

  updateSectionEventHandler(event: UpdateSectionEvent) {
    const { section, pageIndex } = event;
    this.store.dispatch(
      FormConfigurationActions.updateSection({
        section,
        pageIndex
      })
    );
  }

  addQuestionEventHandler(event: AddQuestionEvent) {
    const { pageIndex, questionIndex, sectionId } = event;
    this.store.dispatch(
      FormConfigurationActions.addQuestion({
        question: this.getQuestion(questionIndex, sectionId),
        pageIndex,
        sectionId,
        questionIndex
      })
    );
  }

  updateQuestionEventHandler(event: UpdateQuestionEvent) {
    const { question, sectionId, pageIndex } = event;
    this.store.dispatch(
      FormConfigurationActions.updateQuestion({
        question,
        sectionId,
        pageIndex
      })
    );
  }

  uploadFormImageFile(e) {
    // uploaded image  file code
  }

  publishFormDetail() {
    this.formDetails$
      .pipe(
        tap((formDetails) => {
          const formConfig = this.formConfiguration.value;
          console.log(formConfig);
          if (formDetails.formStatus === 'published') {
            this.raceDynamicFormService.updateFormDetail$(
              formConfig,
              formDetails.pages
            );
          } else
            this.raceDynamicFormService.createFormDetail$(
              formConfig,
              formDetails.pages
            );
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.store.dispatch(FormConfigurationActions.resetFormConfiguration());
  }
}
