import { createAction, props } from '@ngrx/store';
import { Question } from 'src/app/interfaces';

export const addLogicToQuestion = createAction(
  '[Form Configuration] addLogicToQuestion',
  props<{
    pageIndex: number;
    questionId: string;
    logic: any;
    subFormId: string;
  }>()
);
export const removeLogicsOfQuestion = createAction(
  '[Form Configuration] removeLogicsOfQuestion',
  props<{
    pageIndex: number;
    questionId: string;
    subFormId: string;
  }>()
);

export const updateQuestionLogic = createAction(
  '[Form Configuration] updateQuestionLogic',
  props<{
    questionId: string;
    pageIndex: number;
    logic: any;
    subFormId: string;
  }>()
);

export const deleteQuestionLogic = createAction(
  '[Form Configuration] deleteQuestionLogic',
  props<{
    questionId: string;
    pageIndex: number;
    logicId: string;
    subFormId: string;
  }>()
);

export const askQuestionsCreate = createAction(
  '[Form Configuration] askQuestionsCreate',
  props<{
    questionId: string;
    pageIndex: number;
    logicIndex: number;
    logicId: string;
    question: Question;
    subFormId: string;
  }>()
);

export const askQuestionsUpdate = createAction(
  '[Form Configuration] askQuestionsUpdate',
  props<{
    questionId: string;
    pageIndex: number;
    question: Question;
    subFormId: string;
  }>()
);
export const askQuestionsDelete = createAction(
  '[Form Configuration] askQuestionsDelete',
  props<{
    questionId: string;
    pageIndex: number;
    subFormId: string;
  }>()
);
