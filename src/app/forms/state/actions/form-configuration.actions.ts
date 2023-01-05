import { createAction, props } from '@ngrx/store';
import { FormMetadata, Page, Question, Section } from 'src/app/interfaces';

export const addFormMetadata = createAction(
  '[Form Configuration Modal] addFormMetadata',
  props<{ formMetadata: FormMetadata }>()
);

export const addPage = createAction(
  '[Form Configuration] addPage',
  props<{ page: Page; pageIndex: number }>()
);

export const addSection = createAction(
  '[Form Configuration] addSection',
  props<{
    section: Section;
    question: Question;
    pageIndex: number;
    sectionIndex: number;
  }>()
);

export const updateSection = createAction(
  '[Form Configuration] updateSection',
  props<{ section: Section; pageIndex: number }>()
);

export const addQuestion = createAction(
  '[Form Configuration] addQuestion',
  props<{
    question: Question;
    pageIndex: number;
    sectionId: string;
    questionIndex: number;
  }>()
);

export const updateQuestion = createAction(
  '[Form Configuration] updateQuestion',
  props<{
    question: Question;
    sectionId: string;
    pageIndex: number;
  }>()
);

export const resetFormConfiguration = createAction(
  '[Form Configuration] resetFormConfiguration'
);
