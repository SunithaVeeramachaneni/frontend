import { createAction, props } from '@ngrx/store';
import { FormMetadata, Page, Question, Section } from 'src/app/interfaces';
import { FormConfigurationState } from '../form-configuration.reducer';

export const createForm = createAction(
  '[Form Configuration Modal Component] createForm',
  props<{ formMetadata: FormMetadata }>()
);

export const updateForm = createAction(
  '[Form Configuration] updateForm',
  props<{ formMetadata: FormMetadata; formListDynamoDBVersion: number }>()
);

export const addFormMetadata = createAction(
  '[Form Configuration Modal Component] addFormMetadata',
  props<{
    formMetadata: FormMetadata;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const updateFormMetadata = createAction(
  '[Form Configuration] updateFormMetadata',
  props<{
    formMetadata: FormMetadata;
    formStatus: string;
    formDetailPublishStatus: string;
    formListDynamoDBVersion: number;
    formSaveStatus: string;
  }>()
);

export const createFormDetail = createAction(
  '[Form Configuration] createFormDetail',
  props<{
    formMetadata: FormMetadata;
    pdfBuilderConfiguration: any;
    pages: Page[];
    formListId: string;
    authoredFormDetail: any;
    formListDynamoDBVersion: number;
  }>()
);

export const updateFormDetail = createAction(
  '[Form Configuration] updateFormDetail',
  props<{
    formMetadata: FormMetadata;
    pages: Page[];
    pdfBuilderConfiguration: any;
    formListId: string;
    formDetailId: string;
    authoredFormDetail: any;
    formDetailDynamoDBVersion: number;
    formListDynamoDBVersion: number;
  }>()
);

export const createAuthoredFormDetail = createAction(
  '[Form Configuration] createAuthoredFormDetail',
  props<{
    formStatus: string;
    formDetailPublishStatus: string;
    counter: number;
    pages: Page[];
    formListId: string;
    authoredFormDetailVersion: number;
  }>()
);

export const updateAuthoredFormDetail = createAction(
  '[Form Configuration] updateAuthoredFormDetail',
  props<{
    formStatus: string;
    formDetailPublishStatus: string;
    counter: number;
    pages: Page[];
    pdfBuilderConfiguration: any;
    formListId: string;
    authoredFormDetailId: string;
    authoredFormDetailVersion: number;
    authoredFormDetailDynamoDBVersion: number;
  }>()
);

export const updateIsFormDetailPublished = createAction(
  '[Form Configuration] updateIsFormDetailPublished',
  props<{ isFormDetailPublished: boolean }>()
);

export const updateFormPublishStatus = createAction(
  '[Form Configuration] updateFormPublishStatus',
  props<{ formDetailPublishStatus: string }>()
);

export const updateCreateOrEditForm = createAction(
  '[Form Configuration] updateCreateOrEditForm',
  props<{ createOrEditForm: boolean }>()
);

export const updateCounter = createAction(
  '[Form Configuration] updateCounter',
  props<{ counter: number }>()
);

export const addPage = createAction(
  '[Form Configuration] addPage',
  props<{
    page: Page;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const updatePageState = createAction(
  '[Form Configuration] updatePageState',
  props<{
    pageIndex: number;
    isOpen: boolean;
  }>()
);
export const updatePage = createAction(
  '[Form Configuration] updatePage',
  props<{
    page: Page;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const deletePage = createAction(
  '[Form Configuration] deletePage',
  props<{
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const addSections = createAction(
  '[Form Configuration] addSections',
  props<{
    sections: Section[];
    questions: Question[];
    pageIndex: number;
    sectionIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const updatePageSections = createAction(
  '[Form Configuration] updatePageSections',
  props<{
    data: any;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const updateSection = createAction(
  '[Form Configuration] updateSection',
  props<{
    section: Section;
    sectionIndex: number;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const updateSectionState = createAction(
  '[Form Configuration] updateSectionState',
  props<{
    sectionId: string;
    pageIndex: number;
    isOpen: boolean;
  }>()
);

export const deleteSection = createAction(
  '[Form Configuration] deleteSection',
  props<{
    sectionIndex: number;
    sectionId: string;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const addQuestions = createAction(
  '[Form Configuration] addQuestions',
  props<{
    questions: Question[];
    pageIndex: number;
    sectionId: string;
    questionIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const updateQuestionBySection = createAction(
  '[Form Configuration] updateQuestionBySection',
  props<{
    question: Question;
    sectionId: string;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const updateQuestion = createAction(
  '[Form Configuration] updateQuestion',
  props<{
    question: Question;
    questionIndex: number;
    sectionId: string;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const updateQuestionState = createAction(
  '[Form Configuration] updateQuestionState',
  props<{
    questionId: string;
    isOpen: boolean;
    isResponseTypeModalOpen: boolean;
  }>()
);

export const deleteQuestion = createAction(
  '[Form Configuration] deleteQuestion',
  props<{
    questionIndex: number;
    sectionId: string;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
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
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const updateFormConfiguration = createAction(
  '[Form Configuration] updateFormConfiguration',
  props<{ formConfiguration: FormConfigurationState }>()
);

export const resetFormConfiguration = createAction(
  '[Form Configuration] resetFormConfiguration'
);

export const initPages = createAction(
  '[Form Configuration Component] initPages',
  props<{ pages: any[] }>()
);

export const resetPages = createAction(
  '[Form Configuration Component] resetPages'
);
