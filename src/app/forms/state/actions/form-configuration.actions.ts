import { createAction, props } from '@ngrx/store';
import { FormMetadata, Page, Question, Section } from 'src/app/interfaces';

export const createForm = createAction(
  '[Form Configuration Modal Component] createFrom',
  props<{ formMetadata: FormMetadata }>()
);

export const updateForm = createAction(
  '[Form Configuration Component] updateForm',
  props<{ formMetadata: FormMetadata }>()
);

export const addFormMetadata = createAction(
  '[Form Configuration Modal Component] addFormMetadata',
  props<{ formMetadata: FormMetadata }>()
);

export const updateFormMetadata = createAction(
  '[Form Configuration Component] updateFormMetadata',
  props<{ formMetadata: FormMetadata }>()
);

export const createFormDetail = createAction(
  '[Form Configuration Component] createFormDetail',
  props<{
    formMetadata: FormMetadata;
    pages: Page[];
    formListId: string;
    authoredFormDetail: any;
  }>()
);

export const updateFormDetail = createAction(
  '[Form Configuration Component] updateFormDetail',
  props<{
    formMetadata: FormMetadata;
    pages: Page[];
    formListId: string;
    formDetailId: string;
    authoredFormDetail: any;
  }>()
);

export const createAuthoredFormDetail = createAction(
  '[Form Configuration Component] createAuthoredFormDetail',
  props<{
    formStatus: string;
    counter: number;
    pages: Page[];
    formListId: string;
    authoredFormDetailVersion: number;
  }>()
);

export const updateAuthoredFormDetail = createAction(
  '[Form Configuration Component] updateAuthoredFormDetail',
  props<{
    formStatus: string;
    counter: number;
    pages: Page[];
    formListId: string;
    authoredFormDetailId: string;
  }>()
);

export const updateCounter = createAction(
  '[Form Configuration Component] updateCounter',
  props<{ counter: number }>()
);

export const updateIsFormDetailPublished = createAction(
  '[Form Configuration Component] updateIsFormDetailPublished',
  props<{ isFormDetailPublished: boolean }>()
);

export const updateFormPublishStatus = createAction(
  '[Form Configuration Component] updateFormPublishStatus',
  props<{ formPublishStatus: string }>()
);

export const updateCreateOrEditForm = createAction(
  '[Form Configuration Component] updateCreateOrEditForm',
  props<{ createOrEditForm: boolean }>()
);

export const addPage = createAction(
  '[Form Configuration Component] addPage',
  props<{ page: Page; pageIndex: number }>()
);

export const deletePage = createAction(
  '[Form Configuration Component] deletePage',
  props<{ pageIndex: number }>()
);

export const addSection = createAction(
  '[Form Configuration Component] addSection',
  props<{
    section: Section;
    question: Question;
    pageIndex: number;
    sectionIndex: number;
  }>()
);

export const updatePage = createAction(
  '[Form Configuration] updatePage',
  props<{
    data: any;
    pageIndex: number;
  }>()
);

export const updateSection = createAction(
  '[Form Configuration Component] updateSection',
  props<{ section: Section; sectionIndex: number; pageIndex: number }>()
);

export const deleteSection = createAction(
  '[Form Configuration Component] deleteSection',
  props<{ sectionIndex: number; sectionId: string; pageIndex: number }>()
);

export const addQuestion = createAction(
  '[Form Configuration Component] addQuestion',
  props<{
    question: Question;
    pageIndex: number;
    sectionId: string;
    questionIndex: number;
  }>()
);

export const updateQuestionBySection = createAction(
  '[Form Configuration Component] updateQuestionBySection',
  props<{
    question: Question;
    sectionId: string;
    pageIndex: number;
  }>()
);

export const updateQuestion = createAction(
  '[Form Configuration Component] updateQuestion',
  props<{
    question: Question;
    questionIndex: number;
    sectionId: string;
    pageIndex: number;
  }>()
);

export const deleteQuestion = createAction(
  '[Form Configuration Component] deleteQuestion',
  props<{
    questionIndex: number;
    sectionId: string;
    pageIndex: number;
  }>()
);

export const askQuestionsUpdate = createAction(
  '[Form Configuration Component] askQuestionsUpdate',
  props<{
    questionId: string;
    pageIndex: number;
    question: Question;
  }>()
);
export const askQuestionsDelete = createAction(
  '[Form Configuration Component] askQuestionsDelete',
  props<{
    questionId: string;
    pageIndex: number;
  }>()
);

export const transferQuestionFromSection = createAction(
  '[Form Configuration] transferQuestionFromSection',
  props<{
    questionId: string;
    currentIndex: number;
    previousIndex: number;
    sourceSectionId: string;
    destinationSectionId: string;
    pageIndex: number;
  }>()
);

export const addLogicToQuestion = createAction(
  '[Form Configuration Component] addLogicToQuestion',
  props<{
    pageIndex: number;
    questionId: string;
    logic: any;
  }>()
);

export const updateQuestionLogic = createAction(
  '[Form Configuration Component] updateQuestionLogic',
  props<{
    questionId: string;
    pageIndex: number;
    logic: any;
  }>()
);

export const deleteQuestionLogic = createAction(
  '[Form Configuration Component] deleteQuestionLogic',
  props<{
    questionId: string;
    pageIndex: number;
    logicId: string;
  }>()
);

export const askQuestionsCreate = createAction(
  '[Form Configuration Component] askQuestionsCreate',
  props<{
    questionId: string;
    pageIndex: number;
    logicIndex: number;
    logicId: string;
    question: Question;
  }>()
);

export const resetFormConfiguration = createAction(
  '[Form Configuration Component] resetFormConfiguration'
);
