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
      | 'lastPublishedBy'
      | 'publishedDate'
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
        publishedDate: new Date().toISOString(),
        lastPublishedBy: formListQuery.lastPublishedBy ?? '',
        formType: formListQuery.formType ?? '',
        tags: formListQuery.tags || null,
        isPublic: formListQuery.isPublic
      })
    );
  }

  updateForm$(formMetaData) {
    const { isArchived, ...form } = formMetaData;
    return from(this.awsApiService.UpdateFormList(form));
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
      this.awsApiService.UpdateFormDetail(
        {
          formlistID: formDetails.formListId,
          formData: this.formatFormData(
            formDetails.formMetadata,
            formDetails.pages
          )
        } as UpdateFormDetailInput,
        {
          formlistID: formDetails.formListId
        }
      )
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
        id: formDetails.authoredFormDetailId
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
          updatedBy: p.lastPublishedBy,
          createdBy: p.author,
          updatedAt: formatDistance(new Date(p?.updatedAt), new Date(), {
            addSuffix: true
          })
        })) || [];
    const count = resp?.items.length || 0;
    this.nextToken = resp?.nextToken || '';
    return {
      count,
      rows
    };
  }
}
