import { createAction, props } from '@ngrx/store';
import { FormMetadata, Page, Question, Section } from 'src/app/interfaces';
import { FormConfigurationState } from '../form-configuration.reducer';

export const createForm = createAction(
  '[Form Configuration Modal Component] createFrom',
  props<{ formMetadata: FormMetadata }>()
);

export const updateForm = createAction(
  '[Form Configuration Component] updateForm',
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
  '[Form Configuration Component] updateFormMetadata',
  props<{
    formMetadata: FormMetadata;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const createFormDetail = createAction(
  '[Form Configuration Component] createFormDetail',
  props<{
    formMetadata: FormMetadata;
    pages: Page[];
    formListId: string;
    authoredFormDetail: any;
    formListDynamoDBVersion: number;
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
    formDetailDynamoDBVersion: number;
    formListDynamoDBVersion: number;
  }>()
);

export const createAuthoredFormDetail = createAction(
  '[Form Configuration Component] createAuthoredFormDetail',
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
  '[Form Configuration Component] updateAuthoredFormDetail',
  props<{
    formStatus: string;
    formDetailPublishStatus: string;
    counter: number;
    pages: Page[];
    formListId: string;
    authoredFormDetailId: string;
    authoredFormDetailDynamoDBVersion: number;
  }>()
);

export const updateIsFormDetailPublished = createAction(
  '[Form Configuration Component] updateIsFormDetailPublished',
  props<{ isFormDetailPublished: boolean }>()
);

export const updateFormPublishStatus = createAction(
  '[Form Configuration Component] updateFormPublishStatus',
  props<{ formDetailPublishStatus: string }>()
);

export const updateCreateOrEditForm = createAction(
  '[Form Configuration Component] updateCreateOrEditForm',
  props<{ createOrEditForm: boolean }>()
);

export const addPage = createAction(
  '[Form Configuration Component] addPage',
  props<{
    page: Page;
    pageIndex: number;
    questionCounter: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const updatePageState = createAction(
  '[Form Configuration Component] updatePageState',
  props<{
    pageIndex: number;
    isOpen: boolean;
  }>()
);

export const deletePage = createAction(
  '[Form Configuration Component] deletePage',
  props<{
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const addSection = createAction(
  '[Form Configuration Component] addSection',
  props<{
    section: Section;
    question: Question;
    pageIndex: number;
    sectionIndex: number;
    questionCounter: number;
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
  '[Form Configuration Component] updateSection',
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
  '[Form Configuration Component] updateSectionState',
  props<{
    sectionId: string;
    pageIndex: number;
    isOpen: boolean;
  }>()
);

export const deleteSection = createAction(
  '[Form Configuration Component] deleteSection',
  props<{
    sectionIndex: number;
    sectionId: string;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const addQuestion = createAction(
  '[Form Configuration Component] addQuestion',
  props<{
    question: Question;
    pageIndex: number;
    sectionId: string;
    questionIndex: number;
    questionCounter: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const updateQuestionBySection = createAction(
  '[Form Configuration Component] updateQuestionBySection',
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
  '[Form Configuration Component] updateQuestion',
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
  '[Form Configuration Component] updateQuestionState',
  props<{
    questionId: string;
    isOpen: boolean;
    isResponseTypeModalOpen: boolean;
  }>()
);

export const deleteQuestion = createAction(
  '[Form Configuration Component] deleteQuestion',
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
  '[Form Configuration Component] updateFormConfiguration',
  props<{ formConfiguration: FormConfigurationState }>()
);

export const resetFormConfiguration = createAction(
  '[Form Configuration Component] resetFormConfiguration'
);
