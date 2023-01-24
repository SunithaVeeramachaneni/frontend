import { createAction, props } from '@ngrx/store';
import { FormMetadata, Page, Question, Section } from 'src/app/interfaces';
import { RoundPlanConfigurationState } from '../round-plan-configuration.reducer';

export const createRoundPlan = createAction(
  '[RoundPlan Configuration Modal Component] createRoundPlan',
  props<{ formMetadata: FormMetadata }>()
);

export const updateRoundPlan = createAction(
  '[RoundPlan Configuration] updateRoundPlan',
  props<{ formMetadata: FormMetadata; formListDynamoDBVersion: number }>()
);

export const addRoundPlanMetadata = createAction(
  '[RoundPlan Configuration Modal Component] addRoundPlanMetadata',
  props<{
    formMetadata: FormMetadata;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const updateRoundPlanMetadata = createAction(
  '[RoundPlan Configuration] updateRoundPlanMetadata',
  props<{
    formMetadata: FormMetadata;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const createRoundPlanDetail = createAction(
  '[RoundPlan Configuration] createRoundPlanDetail',
  props<{
    formMetadata: FormMetadata;
    pages: Page[];
    formListId: string;
    authoredFormDetail: any;
    formListDynamoDBVersion: number;
  }>()
);

export const updateRoundPlanDetail = createAction(
  '[RoundPlan Configuration] updateRoundPlanDetail',
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

export const createAuthoredRoundPlanDetail = createAction(
  '[RoundPlan Configuration] createAuthoredRoundPlanDetail',
  props<{
    formStatus: string;
    formDetailPublishStatus: string;
    counter: number;
    pages: Page[];
    formListId: string;
    authoredFormDetailVersion: number;
  }>()
);

export const updateAuthoredRoundPlanDetail = createAction(
  '[RoundPlan Configuration] updateAuthoredRoundPlanDetail',
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
  '[RoundPlan Configuration] updateIsFormDetailPublished',
  props<{ isFormDetailPublished: boolean }>()
);

export const updateFormPublishStatus = createAction(
  '[RoundPlan Configuration] updateFormPublishStatus',
  props<{ formDetailPublishStatus: string }>()
);

export const updateCreateOrEditForm = createAction(
  '[RoundPlan Configuration] updateCreateOrEditForm',
  props<{ createOrEditForm: boolean }>()
);

export const addPage = createAction(
  '[RoundPlan Configuration] addPage',
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
  '[RoundPlan Configuration] updatePageState',
  props<{
    pageIndex: number;
    isOpen: boolean;
  }>()
);

export const deletePage = createAction(
  '[RoundPlan Configuration] deletePage',
  props<{
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const addSection = createAction(
  '[RoundPlan Configuration] addSection',
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
  '[RoundPlan Configuration] updatePageSections',
  props<{
    data: any;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const updateSection = createAction(
  '[RoundPlan Configuration] updateSection',
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
  '[RoundPlan Configuration] updateSectionState',
  props<{
    sectionId: string;
    pageIndex: number;
    isOpen: boolean;
  }>()
);

export const deleteSection = createAction(
  '[RoundPlan Configuration] deleteSection',
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
  '[RoundPlan Configuration] addQuestion',
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
  '[RoundPlan Configuration] updateQuestionBySection',
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
  '[RoundPlan Configuration] updateQuestion',
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
  '[RoundPlan Configuration] updateQuestionState',
  props<{
    questionId: string;
    isOpen: boolean;
    isResponseTypeModalOpen: boolean;
  }>()
);

export const deleteQuestion = createAction(
  '[RoundPlan Configuration] deleteQuestion',
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
  '[RoundPlan Configuration] transferQuestionFromSection',
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
  '[RoundPlan Configuration] updateFormConfiguration',
  props<{ formConfiguration: RoundPlanConfigurationState }>()
);

export const resetFormConfiguration = createAction(
  '[RoundPlan Configuration] resetFormConfiguration'
);

export const initPages = createAction(
  '[RoundPlan Configuration Component] initPages',
  props<{ pages: any[] }>()
);

export const resetPages = createAction(
  '[RoundPlan Configuration Component] resetPages'
);
