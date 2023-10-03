import { createAction, props } from '@ngrx/store';
import { FormMetadata, Page, Question, Section } from 'src/app/interfaces';
import { FormConfigurationState } from './builder.reducer';

export const createForm = createAction(
  '[Form Configuration Modal Component] createFrom',
  props<{ formMetadata: FormMetadata }>()
);

export const updateForm = createAction(
  '[Builder Configuration] updateForm',
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
  '[Builder Configuration] updateFormMetadata',
  props<{
    formMetadata: FormMetadata;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);
export const updatePDFBuilderConfiguration = createAction(
  '[Builder Configuration] updatePDFBuilderConfiguration',
  props<{
    pdfBuilderConfiguration: any;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const createFormDetail = createAction(
  '[Builder Configuration] createFormDetail',
  props<{
    formMetadata: FormMetadata;
    pages: Page[];
    formListId: string;
    authoredFormDetail: any;
    formListDynamoDBVersion: number;
  }>()
);

export const updateFormDetail = createAction(
  '[Builder Configuration] updateFormDetail',
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
  '[Builder Configuration] createAuthoredFormDetail',
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
  '[Builder Configuration] updateAuthoredFormDetail',
  props<{
    formStatus: string;
    formDetailPublishStatus: string;
    counter: number;
    pages: Page[];
    formListId: string;
    authoredFormDetailId: string;
    authoredFormDetailDynamoDBVersion: number;
    authoredFormDetailVersion: number;
  }>()
);

export const updateIsFormDetailPublished = createAction(
  '[Builder Configuration] updateIsFormDetailPublished',
  props<{ isFormDetailPublished: boolean }>()
);

export const updateFormPublishStatus = createAction(
  '[Builder Configuration] updateFormPublishStatus',
  props<{ formDetailPublishStatus: string }>()
);

export const updateCreateOrEditForm = createAction(
  '[Builder Configuration] updateCreateOrEditForm',
  props<{ createOrEditForm: boolean }>()
);

export const initPage = createAction(
  '[Builder Configuration] initPage',
  props<{
    subFormId: string;
  }>()
);

export const removeSubForm = createAction(
  '[Builder Configuration] removeSubForm',
  props<{
    subFormId: string;
  }>()
);
export const removeSubFormInstances = createAction(
  '[Builder Configuration] removeSubFormInstances',
  props<{
    subFormIds: string[];
  }>()
);

export const addPage = createAction(
  '[Builder Configuration] addPage',
  props<{
    subFormId?: string;
    page: Page;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
    counter: number;
  }>()
);

export const updatePageState = createAction(
  '[Builder Configuration] updatePageState',
  props<{
    pageIndex: number;
    isOpen: boolean;
    subFormId?: string;
    isCollapse?: boolean;
  }>()
);
export const updatePage = createAction(
  '[Builder Configuration] updatePage',
  props<{
    page: Page;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
    subFormId: string;
  }>()
);
export const deletePage = createAction(
  '[Builder Configuration] deletePage',
  props<{
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
    subFormId: string;
  }>()
);

export const addSections = createAction(
  '[Builder Configuration] addSections',
  props<{
    sections: Section[];
    questions: Question[];
    pageIndex: number;
    sectionIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
    subFormId?: string;
    counter: number;
  }>()
);

export const addLogics = createAction(
  '[Builder Configuration] addLogics',
  props<{
    subFormId?: string;
    logics: any[];
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const updatePageSections = createAction(
  '[Builder Configuration] updatePageSections',
  props<{
    data: any;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
    subFormId: string;
  }>()
);

export const updateSection = createAction(
  '[Builder Configuration] updateSection',
  props<{
    section: Section;
    sectionIndex: number;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
    subFormId: string;
  }>()
);

export const updateSectionState = createAction(
  '[Builder Configuration] updateSectionState',
  props<{
    sectionId: string;
    pageIndex: number;
    isOpen: boolean;
    subFormId: string;
  }>()
);

export const deleteSection = createAction(
  '[Builder Configuration] deleteSection',
  props<{
    sectionIndex: number;
    sectionId: string;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
    subFormId: string;
  }>()
);

export const addQuestions = createAction(
  '[Builder Configuration] addQuestions',
  props<{
    questions: Question[];
    pageIndex: number;
    sectionId: string;
    questionIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
    subFormId?: string;
    counter: number;
  }>()
);

export const updateQuestionBySection = createAction(
  '[Builder Configuration] updateQuestionBySection',
  props<{
    question: Question;
    sectionId: string;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
    subFormId: string;
  }>()
);

export const updateQuestion = createAction(
  '[Builder Configuration] updateQuestion',
  props<{
    question: Question;
    questionIndex: number;
    sectionId: string;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
    subFormId: string;
  }>()
);

export const updateQuestionState = createAction(
  '[Builder Configuration] updateQuestionState',
  props<{
    questionId: string;
    isOpen: boolean;
    subFormId?: string;
  }>()
);

export const deleteQuestion = createAction(
  '[Builder Configuration] deleteQuestion',
  props<{
    questionIndex: number;
    sectionId: string;
    pageIndex: number;
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
    subFormId: string;
  }>()
);

export const transferQuestionFromSection = createAction(
  '[Builder Configuration] transferQuestionFromSection',
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
    subFormId: string;
  }>()
);

export const updateFormStatuses = createAction(
  '[Builder Configuration] updateRoundPlanStatuses',
  props<{
    formStatus: string;
    formDetailPublishStatus: string;
    formSaveStatus: string;
  }>()
);

export const updateFormConfiguration = createAction(
  '[Builder Configuration] updateFormConfiguration',
  props<{ formConfiguration: FormConfigurationState }>()
);

export const resetFormConfiguration = createAction(
  '[Builder Configuration] resetFormConfiguration'
);

export const initPages = createAction(
  '[Form Configuration Component] initPages',
  props<{ pages: any[]; subFormId: string }>()
);

export const createTemplate = createAction(
  '[Template Configuration Modal Component] createTemplate',
  props<{ formMetadata: FormMetadata }>()
);

export const updateTemplate = createAction(
  '[Template Configuration] updateTemplate',
  props<{ formMetadata: FormMetadata }>()
);

export const publishTemplate = createAction(
  '[Template Configuration] publishTemplate',
  props<{ formMetadata: FormMetadata; data: any }>()
);

export const createAuthoredTemplateDetail = createAction(
  '[Template Configuration] createAuthoredTemplateDetail',
  props<{
    formStatus: string;
    counter: number;
    pages: Page[];
    templateId: string;
  }>()
);

export const replacePagesAndCounter = createAction(
  '[Form Configuration Component] replacePagesAndCounter',
  props<{
    counter: number;
    pages: Page[];
  }>()
);

export const updateFormStatus = createAction(
  '[Builder Configuration] updateFormStatus',
  props<{ formStatus: string }>()
);

export const updateModuleName = createAction(
  '[Builder Configuration] updateModuleName',
  props<{ moduleName: string }>()
);

export const updateAllSectionState = createAction(
  '[Builder Configuration] updateAllSectionState',
  props<{
    isCollapse: boolean;
    subFormId: string;
  }>()
);
