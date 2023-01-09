/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { formatDistance } from 'date-fns';
import { from, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  APIService,
  GetFormListQuery,
  ListFormListsQuery,
  UpdateAuthoredFormDetailInput,
  UpdateFormDetailInput
} from 'src/app/API.service';
import {
  FormMetadata,
  LoadEvent,
  SearchEvent,
  TableEvent
} from './../../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RaceDynamicFormService {
  nextToken = '';
  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  constructor(private readonly awsApiService: APIService) {}

  getFormsList$(queryParams: {
    skip?: number;
    limit: number;
    searchKey: string;
  }) {
    return from(
      this.awsApiService.ListFormLists(
        {
          name: {
            contains: queryParams?.searchKey || ''
          }
        },
        queryParams.limit,
        this.nextToken
      )
    ).pipe(map((res) => this.formatGraphQLFormsResponse(res)));
  }

  createForm$(
    formListQuery: Pick<
      GetFormListQuery,
      | 'name'
      | 'formLogo'
      | 'description'
      | 'author'
      | 'tags'
      | 'formType'
      | 'formStatus'
      | 'isPublic'
    >
  ) {
    return from(
      this.awsApiService.CreateFormList({
        formLogo: formListQuery.formLogo ?? '',
        name: formListQuery?.name ?? '',
        description: formListQuery.description ?? '',
        formStatus: formListQuery.formStatus ?? '',
        author: formListQuery.author ?? '',
        formType: formListQuery.formType ?? '',
        tags: formListQuery.tags || null,
        isPublic: formListQuery.isPublic
      })
    );
  }

  updateForm$(formMetaDataDetails) {
    const { isArchived, ...form } = formMetaDataDetails.formMetadata;
    return from(
      this.awsApiService.UpdateFormList({
        ...form,
        _version: formMetaDataDetails.formListDynamoDBVersion
      })
    );
  }

  deleteForm$(id: string) {
    return from(this.awsApiService.DeleteFormList({ id }, {}));
  }

  createFormDetail$(formDetails) {
    return from(
      this.awsApiService.CreateFormDetail({
        formlistID: formDetails.formListId,
        formData: this.formatFormData(
          formDetails.formMetadata,
          formDetails.pages
        )
      })
    );
  }

  updateFormDetail$(formDetails) {
    return from(
      this.awsApiService.UpdateFormDetail({
        id: formDetails.formDetailId,
        formlistID: formDetails.formListId,
        formData: this.formatFormData(
          formDetails.formMetadata,
          formDetails.pages
        ),
        _version: formDetails.formDetailDynamoDBVersion
      } as UpdateFormDetailInput)
    );
  }

  createAuthoredFormDetail$(formDetails) {
    return from(
      this.awsApiService.CreateAuthoredFormDetail({
        formStatus: formDetails.formStatus,
        formlistID: formDetails.formListId,
        pages: JSON.stringify(formDetails.pages),
        counter: formDetails.counter,
        version: formDetails.authoredFormDetailVersion.toString()
      })
    );
  }

  updateAuthoredFormDetail$(formDetails) {
    return from(
      this.awsApiService.UpdateAuthoredFormDetail({
        formStatus: formDetails.formStatus,
        formlistID: formDetails.formListId,
        pages: JSON.stringify(formDetails.pages),
        counter: formDetails.counter,
        id: formDetails.authoredFormDetailId,
        _version: formDetails.authoredFormDetailDynamoDBVersion
      } as UpdateAuthoredFormDetailInput)
    );
  }

  formatFormData = (form, pages): string => {
    const forms = [];
    const arrayFieldTypeQuestions = [];
    const formData = {
      FORMNAME: form.name,
      PAGES: []
    };
    formData.PAGES = pages.map((page) => {
      const { sections, questions, logics } = page;
      const pageItem = {
        SECTIONS: sections.map((section) => {
          const questionsBySection = questions.filter(
            (item) => item.sectionId === section.id
          );
          const sectionItem = {
            SECTIONNAME: section.name,
            FIELDS: questionsBySection.map((question) => {
              const questionItem = {
                UNIQUEKEY: question.id,
                FIELDLABEL: question.name,
                UIFIELDTYPE: question.fieldType,
                UIFIELDDESC: question.fieldType,
                DEFAULTVALUE: '',
                UIVALIDATION: this.getValidationExpression(
                  question.id,
                  questions,
                  logics
                )
              };

              if (question.fieldType === 'ARD') {
                Object.assign(questionItem, { SUBFORMNAME: question.name }); // Might be name or id.
                arrayFieldTypeQuestions.push(question);
              }

              return questionItem;
            })
          };

          return sectionItem;
        })
      };

      return pageItem;
    });

    forms.push(formData);
    return JSON.stringify({ FORMS: forms });
  };

  getValidationExpression(questionId, questions, logics) {
    let expression = '';
    let globalIndex = 0;
    const questionLogics = logics.filter(
      (logic) => logic.questionId === questionId
    );
    if (!questionLogics || !questionLogics.length) return expression;

    questionLogics.forEach((logic) => {
      const isEmpty = !logic.operand2.length;

      // Mandate Questions;
      const mandatedQuestions = logic.mandateQuestions;
      if (mandatedQuestions && mandatedQuestions.length) {
        mandatedQuestions.forEach((mq) => {
          globalIndex = globalIndex + 1;
          if (isEmpty) {
            expression = `${expression};${globalIndex}:(E) ${mq} EQ MANDIT IF ${questionId} ${logic.operator} EMPTY`;
          } else {
            expression = `${expression};${globalIndex}:(E) ${mq} EQ MANDIT IF ${questionId} ${logic.operator} (V)${logic.operand2}`;
          }
        });
      }

      // Hide Questions;
      const hiddenQuestions = logic.hideQuestions;
      if (hiddenQuestions && hiddenQuestions.length) {
        hiddenQuestions.forEach((hq) => {
          globalIndex = globalIndex + 1;
          if (isEmpty) {
            expression = `${expression};${globalIndex}:(HI) ${hq} IF ${questionId} ${logic.operator} EMPTY`;
          } else {
            expression = `${expression};${globalIndex}:(HI) ${hq} IF ${questionId} ${logic.operator} (V)${logic.operand2}`;
          }
        });
      }

      // Ask Questions;
      const askQuestions = questions.filter(
        (q) => q.sectionId === `AQ_${logic.id}`
      );
      askQuestions.forEach((q) => {
        globalIndex = globalIndex + 1;
        expression = `${expression};${globalIndex}:(HI) ${q.id} IF ${questionId} ${logic.operator} EMPTY OR ${questionId} NE (V)${logic.operand2}`;
      });
    });
    if (expression[0] === ';') {
      expression = expression.slice(1, expression.length);
    }
    if (expression[expression.length - 1] === ';') {
      expression = expression.slice(0, expression.length - 1);
    }
    return expression;
  }

  private formatGraphQLFormsResponse(resp: ListFormListsQuery) {
    const rows =
      resp.items
        .sort(
          (a, b) =>
            new Date(b?.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        ?.map((p) => ({
          ...p,
          preTextImage: {
            style: {
              width: '30px',
              height: '30px',
              'border-radius': '50%',
              display: 'block',
              padding: '0px 10px'
            },
            image: p?.formLogo,
            condition: true
          },
          lastPublishedBy: p.lastPublishedBy,
          author: p.author,
          publishedDate: p.publishedDate
            ? formatDistance(new Date(p.publishedDate), new Date(), {
                addSuffix: true
              })
            : ''
        })) || [];
    const count = resp?.items.length || 0;
    this.nextToken = resp?.nextToken || '';
    return {
      count,
      rows
    };
  }
}
