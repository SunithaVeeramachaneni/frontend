/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { API, graphqlOperation } from 'aws-amplify';
import { format, formatDistance } from 'date-fns';
import { from, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  APIService,
  CreateResponseSetInput,
  GetFormListQuery,
  ListFormListsQuery,
  ListFormSubmissionListsQuery,
  UpdateAuthoredFormDetailInput,
  UpdateFormDetailInput,
  UpdateResponseSetInput
} from 'src/app/API.service';
import { LoadEvent, SearchEvent, TableEvent } from './../../../interfaces';

const limit = 10000;
@Injectable({
  providedIn: 'root'
})
export class RaceDynamicFormService {
  fetchForms$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  constructor(private readonly awsApiService: APIService) {}

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

  getResponseSet$(queryParams: {
    nextToken?: string;
    limit?: number;
    responseType: string;
  }) {
    if (queryParams.nextToken !== null) {
      return from(
        this.awsApiService.ListResponseSets(
          {
            type: { eq: queryParams.responseType }
          },
          queryParams.limit,
          queryParams.nextToken
        )
      );
    }
  }

  createResponseSet$(responseSet) {
    return from(
      this.awsApiService.CreateResponseSet({
        type: responseSet.responseType,
        name: responseSet.name,
        description: responseSet?.description,
        isMultiColumn: responseSet.isMultiColumn,
        values: responseSet.values
      })
    );
  }

  updateResponseSet$(responseSet) {
    return from(
      this.awsApiService.UpdateResponseSet({
        id: responseSet.id,
        type: responseSet.responseType,
        name: responseSet.name,
        description: responseSet.description,
        isMultiColumn: responseSet.isMultiColumn,
        values: responseSet.values,
        _version: responseSet.version
      })
    );
  }

  deleteResponseSet$(responseSetId: string) {
    return from(
      this.awsApiService.DeleteResponseSet({
        id: responseSetId
      })
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
      const { sections, questions } = page;
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
                DEFAULTVALUE: ''
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
}
