/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { API, graphqlOperation } from 'aws-amplify';
import { format, formatDistance } from 'date-fns';
import { from, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  APIService,
  GetFormListQuery,
  ListFormListsQuery,
  ListFormSubmissionListsQuery,
  UpdateAuthoredFormDetailInput,
  UpdateFormDetailInput
} from 'src/app/API.service';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';
import {
  ErrorInfo,
  FormMetadata,
  LoadEvent,
  SearchEvent,
  TableEvent
} from './../../../interfaces';
import { formConfigurationStatus } from 'src/app/app.constants';
import { ToastService } from 'src/app/shared/toast';

const limit = 10000;
@Injectable({
  providedIn: 'root'
})
export class RaceDynamicFormService {
  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  constructor(
    private readonly awsApiService: APIService,
    private toastService: ToastService,
    private appService: AppService
  ) {}

  createTags$ = (
    tags: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(environment.rdfApiUrl, 'datasets', tags, info);

  createDataSet$ = (
    dataset: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._postData(environment.rdfApiUrl, 'datasets', dataset, info);

  updateDataSet$ = (
    datasetId: string,
    dataset: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService._putDataToGateway(
      environment.rdfApiUrl,
      `datasets/${datasetId}`,
      dataset,
      info
    );

  getDataSetsByType$ = (
    datasetType: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> =>
    this.appService._getResp(
      environment.rdfApiUrl,
      `datasets/${datasetType}`,
      info
    );
  getDataSetsByFormId$ = (
    datasetType: string,
    formId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> =>
    this.appService._getResp(
      environment.rdfApiUrl,
      `datasets/${datasetType}/${formId}`,
      info
    );

  getFormsList$(queryParams: {
    nextToken?: string;
    limit: number;
    searchKey: string;
  }) {
    if (queryParams?.nextToken !== null) {
      return from(
        this.awsApiService.ListFormLists(
          {
            ...(queryParams.searchKey && {
              name: { contains: queryParams?.searchKey }
            })
          },
          queryParams.limit,
          queryParams.nextToken
        )
      ).pipe(map((res) => this.formatGraphQLFormsResponse(res)));
    }
  }

  getSubmissionFormsList$(queryParams: {
    nextToken?: string;
    limit: number;
    searchKey: string;
  }) {
    if (queryParams?.nextToken !== null) {
      return from(
        this.awsApiService.ListFormSubmissionLists(
          {
            ...(queryParams.searchKey && {
              name: { contains: queryParams?.searchKey }
            })
          },
          queryParams.limit,
          queryParams.nextToken
        )
      ).pipe(map((res) => this.formatSubmittedListResponse(res)));
    }
  }

  getFormsListCount$(): Observable<number> {
    const statement = `query { listFormLists(limit: ${limit}) { items { id } } }`;
    return from(API.graphql(graphqlOperation(statement))).pipe(
      map(
        ({ data: { listFormLists } }: any) => listFormLists?.items?.length || 0
      )
    );
  }

  getSubmissionFormsListCount$(): Observable<number> {
    const statement = `query { listFormSubmissionLists(limit: ${limit}) { items { id } } }`;
    return from(API.graphql(graphqlOperation(statement))).pipe(
      map(
        ({ data: { listFormSubmissionLists } }: any) =>
          listFormSubmissionLists?.items?.length || 0
      )
    );
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
        name: formListQuery.name,
        formLogo: formListQuery.formLogo,
        description: formListQuery.description,
        formStatus: formListQuery.formStatus,
        author: formListQuery.author,
        formType: formListQuery.formType,
        tags: formListQuery.tags,
        isPublic: formListQuery.isPublic
      })
    );
  }

  updateForm$(formMetaDataDetails) {
    return from(
      this.awsApiService.UpdateFormList({
        ...formMetaDataDetails.formMetadata,
        _version: formMetaDataDetails.formListDynamoDBVersion
      })
    );
  }

  deleteForm$(id: string) {
    return from(this.awsApiService.DeleteFormList({ id }, {}));
  }

  getFormById$(id: string) {
    return from(this.awsApiService.GetFormList(id));
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
        formDetailPublishStatus: formDetails.formDetailPublishStatus,
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
        formDetailPublishStatus: formDetails.formDetailPublishStatus,
        formlistID: formDetails.formListId,
        pages: JSON.stringify(formDetails.pages),
        counter: formDetails.counter,
        id: formDetails.authoredFormDetailId,
        _version: formDetails.authoredFormDetailDynamoDBVersion
      } as UpdateAuthoredFormDetailInput)
    );
  }

  getAuthoredFormDetailByFormId$(formId: string) {
    return from(
      this.awsApiService.AuthoredFormDetailsByFormlistID(formId, null, {
        formStatus: { eq: formConfigurationStatus.draft }
      })
    ).pipe(map(({ items }) => items));
  }

  getAuthoredFormDetailsByFormId$(formId: string) {
    return from(
      this.awsApiService.AuthoredFormDetailsByFormlistID(formId)
    ).pipe(map(({ items }) => items));
  }

  getFormDetailByFormId$(formId: string) {
    return from(this.awsApiService.FormDetailsByFormlistID(formId)).pipe(
      map(({ items }) => items)
    );
  }

  handleError(error: any) {
    const message = error.errors?.length
      ? error.errors[0].message.split(':')[0]
      : error.message;
    this.toastService.show({
      type: 'warning',
      text: message
    });
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

  fetchAllFormListNames$() {
    const statement = `query { listFormLists(limit: ${limit}) { items { name } } }`;
    return from(API.graphql(graphqlOperation(statement))).pipe(
      map(
        ({ data: { listFormLists } }: any) =>
          listFormLists?.items as GetFormListQuery[]
      )
    );
  }

  getAuthoredFormDetail$(formlistID: string) {
    return from(
      this.awsApiService.AuthoredFormDetailsByFormlistID(formlistID)
    ).pipe(map(({ items }) => items));
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
            image: p?.formLogo,
            condition: true
          },
          preTextImageConfig: {
            logoAvialable: p?.formLogo === '' ? false : true,
            style: {
              width: '40px',
              height: '40px',
              marginRight: '10px'
            }
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
    const nextToken = resp?.nextToken;
    return {
      count,
      rows,
      nextToken
    };
  }

  private formatSubmittedListResponse(resp: ListFormSubmissionListsQuery) {
    const rows =
      resp.items
        .sort(
          (a, b) =>
            new Date(b?.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        ?.map((p) => ({
          ...p,
          preTextImage: {
            image: p?.formLogo,
            condition: true
          },
          preTextImageConfig: {
            logoAvialable: p?.formLogo === '' ? false : true,
            style: {
              width: '40px',
              height: '40px',
              marginRight: '10px'
            }
          },
          responses: '23/26',
          createdAt: format(new Date(p?.createdAt), 'Do MMM'),
          updatedAt: formatDistance(new Date(p?.updatedAt), new Date(), {
            addSuffix: true
          })
        })) || [];
    const nextToken = resp?.nextToken;
    return {
      rows,
      nextToken
    };
  }

  getInspectionDetailByInspectionId$ = (
    inspectionId: string
  ) => {
    return from(this.awsApiService.GetFormSubmissionDetail(inspectionId));
  }
}
