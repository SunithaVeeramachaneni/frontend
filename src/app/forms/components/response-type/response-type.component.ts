/* eslint-disable no-underscore-dangle */
import { Component, Output, OnInit, Input, EventEmitter } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { FormService } from '../../services/form.service';

import { slideInOut } from 'src/app/animations';
import { Store } from '@ngrx/store';
import {
  State,
  getDefaultQuickResponses,
  getFormMetadata,
  getFormSpecificQuickResponses,
  getGlobalResponses
} from '../../state';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import {
  GlobalResponseActions,
  QuickResponseActions
} from '../../state/actions';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormMetadata, Question } from 'src/app/interfaces';

@Component({
  selector: 'app-response-type',
  templateUrl: './response-type.component.html',
  styleUrls: ['./response-type.component.scss'],
  animations: [slideInOut]
})
export class ResponseTypeComponent implements OnInit {
  @Input() set fieldTypes(fieldTypes: any) {
    if (fieldTypes) {
      this._fieldTypes = fieldTypes;
    }
  }
  get fieldTypes(): any {
    return this._fieldTypes;
  }
  @Input() set question(question: Question) {
    if (question) {
      this._question = question;
    }
  }
  get question(): Question {
    return this._question;
  }
  @Output() selectFieldTypeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() setQuestionValue: EventEmitter<any> = new EventEmitter<any>();
  @Output() responseTypeCloseEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input() isPreviewActive;
  @Input() isEmbeddedForm: boolean;

  public isMCQResponseOpen = false;
  public isGlobalResponseOpen = false;
  public globalResponses$: Observable<any[]>;
  public responseToBeEdited: any;
  public globalResponseSlideState: string;
  tabIndex = 0;
  addEditDeleteResponseSet: boolean;
  addEditDeleteResponseSet$: BehaviorSubject<any> = new BehaviorSubject({
    action: '',
    form: {} as any
  });
  allResponses: any[] = [];
  quickResponsesData$: Observable<any>;
  formId: string;
  formMetadata$: Observable<FormMetadata>;
  private _question: Question = {} as Question;
  private _fieldTypes: any = {};

  constructor(
    private formService: FormService,
    private operatorRoundsService: OperatorRoundsService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.globalResponses$ = this.store
      .select(getGlobalResponses)
      .pipe(
        map((responses) => responses.filter((response) => !response._deleted))
      );
    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap(({ id }) => {
        this.formId = id;
      })
    );

    this.quickResponsesData$ = combineLatest([
      of({ data: [] }),
      this.store.select(getDefaultQuickResponses),
      this.store.select(getFormSpecificQuickResponses)
    ]).pipe(
      map(([initial, responses, formResponses]) => {
        initial.data = [];
        const quickResp = responses.map((r) => ({
          id: r.id,
          name: '',
          values: r.values
        }));
        initial.data = initial.data.concat(quickResp);
        const formQuickResp = formResponses.map((r) => ({
          id: r.id,
          name: '',
          values: r.values,
          formId: r.formId
        }));
        initial.data = initial.data.concat(formQuickResp);
        return initial;
      })
    );

    this.quickResponsesData$.subscribe();
  }

  getFieldTypeImage(type) {
    if (type === 'ATT' && !this.isEmbeddedForm) return `icon-ATT-standalone`;
    return type ? `icon-${type}` : null;
  }

  selectFieldType(fieldType) {
    this.selectFieldTypeEvent.emit(fieldType);
    if (fieldType.type === 'RT') {
      this.formService.setsliderOpenState({
        isOpen: true,
        questionId: this.question.id,
        value: {
          value: 0,
          min: 0,
          max: 100,
          increment: 1
        }
      });
    }
    this.responseTypeCloseEvent.emit(true);
  }

  handleMCQRepsonseSelection = (responseType, response) => {
    const { type, values, name, description, id } = response;

    this.selectFieldTypeEvent.emit({
      type:
        responseType === 'quickResponse' && values?.length <= 4 ? 'VI' : 'DD'
    });
    this.setQuestionValue.emit(
      responseType === 'quickResponse'
        ? { id, type: responseType, name, value: values, description: name }
        : {
            id,
            type: responseType,
            name,
            value: JSON.parse(values),
            description,
            // eslint-disable-next-line no-underscore-dangle
            version: response._version,
            createdBy: response.createdBy,
            refCount: response.refCount,
            isMultiColumn: false
          }
    );
  };
  closeResponseType() {
    this.responseTypeCloseEvent.emit(true);
  }

  toggleResponseTypeModal(value) {
    this.responseTypeCloseEvent.emit(true);
  }

  handleResponses(response = {}) {
    this.isMCQResponseOpen = true;
    if (this.isMCQResponseOpen) {
      this.formService.setMultiChoiceOpenState({
        isOpen: true,
        response
      });
    }
  }

  handleGlobalResponsesToggle() {
    this.isGlobalResponseOpen = !this.isGlobalResponseOpen;
    this.globalResponseSlideState = 'in';
  }

  handleSlideState = (event) => (this.globalResponseSlideState = event);

  handleEditGlobalResponse = (response: any) => {
    this.responseToBeEdited = response;
    this.handleGlobalResponsesToggle();
  };

  handleGlobalResponseChange = (event) => {
    const { actionType: action, responseSet: item } = event;
    this.addEditDeleteResponseSet = true;
    this.responseToBeEdited = null;
    this.globalResponseSlideState = 'out';
    if (action === 'create') {
      this.store.dispatch(GlobalResponseActions.setGlobalResponse({ item }));
    } else if (action === 'update') {
      this.store.dispatch(GlobalResponseActions.updateGlobalResponse({ item }));
    }
    this.isGlobalResponseOpen = false;
  };

  getSelectedIndex(question = {} as Question) {
    return question.fieldType === 'DD' || question.fieldType === 'VI'
      ? (this.tabIndex = 1)
      : (this.tabIndex = 0);
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
  }

  handleGlobalResponseCancel = (event) => {
    this.isGlobalResponseOpen = event.isGlobalResponseOpen;
    this.responseToBeEdited = event.responseToBeEdited;
  };
  quickResponseTypeHandler(event) {
    switch (event.eventType) {
      case 'quickResponsesAdd':
        const createDataset = {
          formId: this.formId,
          type: 'quickResponses',
          values: event.data.responses,
          name: 'quickResponses'
        };
        this.operatorRoundsService
          .createDataSet$(createDataset)
          .subscribe((response) => {
            if (Object.keys(response).length) {
              this.store.dispatch(
                QuickResponseActions.setFormSpecificQuickResponse({
                  formSpecificResponse: response
                })
              );
            }
          });
        break;

      case 'quickResponseUpdate':
        const updateDataset = {
          formId: this.formId,
          type: 'quickResponses',
          values: event.data.responses,
          name: 'quickResponses',
          id: event.data.id
        };
        this.operatorRoundsService
          .updateDataSet$(event.data.id, updateDataset)
          .subscribe((response) => {
            if (Object.keys(response).length) {
              this.store.dispatch(
                QuickResponseActions.updateFormSpecificQuickResponse({
                  formSpecificResponse: updateDataset
                })
              );
            }
          });
        break;
    }
  }
}
