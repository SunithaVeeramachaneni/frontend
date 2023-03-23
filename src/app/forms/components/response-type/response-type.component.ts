import { Component, Output, OnInit, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { State, getResponseSets } from '../../state';

import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import { FormService } from '../../services/form.service';

import { slideInOut } from 'src/app/animations';

@Component({
  selector: 'app-response-type',
  templateUrl: './response-type.component.html',
  styleUrls: ['./response-type.component.scss'],
  animations: [slideInOut]
})
export class ResponseTypeComponent implements OnInit {
  @Input() fieldTypes;
  @Input() question;
  @Output() selectFieldTypeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() setQuestionValue: EventEmitter<any> = new EventEmitter<any>();
  @Output() responseTypeCloseEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public isMCQResponseOpen = false;
  public isGlobalResponseOpen = false;
  public globalResponses$: Observable<any[]>;
  public responseToBeEdited: any;
  public globalResponseSlideState: string;
  quickResponsesData$: Observable<any>;
  createEditQuickResponse$ = new BehaviorSubject<any>({
    type: 'create',
    response: {}
  });
  formId: string;

  constructor(
    private formService: FormService,
    private rdfService: RaceDynamicFormService,
    private store: Store<State>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.globalResponses$ = this.store
      .select(getResponseSets)
      .pipe((responses: any) => responses);
    this.globalResponses$.subscribe();

    this.route.params.subscribe((params) => {
      this.formId = params.id;
    });

    this.rdfService.formCreatedUpdated$.subscribe((data) => {
      if (data.id) {
        this.formId = data.id;
      }
    });

    this.quickResponsesData$ = combineLatest([
      of({ data: [] }),
      this.rdfService.getDataSetsByType$('quickResponses').pipe(
        tap((responses) => {
          const defaultResponses = responses.filter((item) => !item.formId);
          return defaultResponses;
        })
      ),
      this.rdfService.getDataSetsByFormId$('quickResponses', this.formId),
      this.createEditQuickResponse$
    ]).pipe(
      map(
        ([
          initial,
          responses,
          formResponses,
          { type, response, responseType }
        ]) => {
          responses = responses.filter((item) => !item.formId);
          if (Object.keys(response).length) {
            if (type === 'create') {
              initial.data = initial.data.concat([response]);
            } else {
              initial.data = initial.data.map((resp) => {
                if (resp.id === response.id) {
                  return response;
                }
                return resp;
              });
            }
            return initial;
          } else {
            if (initial.data.length === 0) {
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
            }
            return initial;
          }
        }
      )
    );

    this.quickResponsesData$.subscribe();
  }

  getFieldTypeImage(type) {
    return type ? `assets/rdf-forms-icons/fieldType-icons/${type}.svg` : null;
  }

  selectFieldType(fieldType) {
    this.selectFieldTypeEvent.emit(fieldType);
    if (fieldType.type === 'RT') {
      this.formService.setsliderOpenState(true);
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
            description
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
      this.responseTypeCloseEvent.emit(true);
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

  handleGlobalResponseCancel = (event) => {
    this.isGlobalResponseOpen = event.isGlobalResponseOpen;
    this.responseToBeEdited = event.responseToBeEdited;
  };
  quickResponseTypeHandler(event) {}
}
