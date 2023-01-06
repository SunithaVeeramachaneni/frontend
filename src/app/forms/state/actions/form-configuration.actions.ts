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
  }>()
);

export const updateFormDetail = createAction(
  '[Form Configuration Component] updateFormDetail',
  props<{
    formMetadata: FormMetadata;
    pages: Page[];
    formListId: string;
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

export const updateIsFormDetailPublished = createAction(
  '[Form Configuration Component] updateIsFormDetailPublished',
  props<{ isFormDetailPublished: boolean }>()
);

export const updateCounter = createAction(
  '[Form Configuration Component] updateCounter',
  props<{ counter: number }>()
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

export const updateQuestion = createAction(
  '[Form Configuration Component] updateQuestion',
  props<{
    question: Question;
    questionIndex: number;
    pageIndex: number;
  }>()
);

export const deleteQuestion = createAction(
  '[Form Configuration Component] deleteQuestion',
  props<{
    questionIndex: number;
    pageIndex: number;
  }>()
);

export const resetFormConfiguration = createAction(
  '[Form Configuration Component] resetFormConfiguration'
);
