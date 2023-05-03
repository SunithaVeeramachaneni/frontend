import { Component, Output, OnInit, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import { ResponseSetService } from 'src/app/components/master-configurations/response-set/services/response-set.service';
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
  @Output() responseTypeCloseEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() isPreviewActive;

  public isMCQResponseOpen = false;
  public isGlobalResponseOpen = false;
  public globalResponses$: Observable<any[]>;
  public responseToBeEdited: any;
  public globalResponseSlideState: string;
  addEditDeleteResponseSet: boolean;
  addEditDeleteResponseSet$: BehaviorSubject<any> = new BehaviorSubject({
    action: '',
    form: {} as any
  });
  allResponses: any[] = [];
  quickResponsesData$: Observable<any>;
  createEditQuickResponse$ = new BehaviorSubject<any>({
    type: 'create',
    response: {}
  });
  formId: string;
  masterData = ['Plants', 'Locations', 'Assets'];

  constructor(
    private formService: FormService,
    private rdfService: RaceDynamicFormService,
    private responseSetService: ResponseSetService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.globalResponses$ = combineLatest([
      this.responseSetService.fetchAllGlobalResponses$(),
      this.addEditDeleteResponseSet$
    ]).pipe(
      map(([allResponses, addEditData]) => {
        this.allResponses = allResponses.items;
        if (this.addEditDeleteResponseSet) {
          const { form, action } = addEditData;
          switch (action) {
            case 'create':
              this.allResponses = [form, ...this.allResponses];
              break;
            case 'update':
              const updatedIdx = this.allResponses.findIndex(
                (item) => item.id === form.id
              );
              this.allResponses[updatedIdx] = form;
              break;
            default:
            // Do nothing
          }
          this.addEditDeleteResponseSet = false;
        }

        return this.allResponses;
      })
    );

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
    return type ? `icon-${type}` : null;
  }

  selectFieldType(fieldType) {
    this.selectFieldTypeEvent.emit(fieldType);
    if (fieldType.type === 'RT') {
      this.formService.setsliderOpenState(true);
    }
    this.responseTypeCloseEvent.emit({ closeResponseModal: true });
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
    this.responseTypeCloseEvent.emit({ closeResponseModal: true });
  }

  toggleResponseTypeModal(value) {
    this.responseTypeCloseEvent.emit({ closeResponseModal: true });
  }

  handleResponses(response = {}) {
    this.isMCQResponseOpen = true;
    if (this.isMCQResponseOpen) {
      this.formService.setMultiChoiceOpenState({
        isOpen: true,
        response
      });
      this.responseTypeCloseEvent.emit({ closeResponseModal: true });
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
    const { actionType: action, responseSet } = event;
    this.addEditDeleteResponseSet = true;
    this.responseToBeEdited = null;
    this.globalResponseSlideState = 'out';
    if (action !== 'cancel') {
      this.addEditDeleteResponseSet$.next({
        action,
        form: responseSet
      });
    }
    this.isGlobalResponseOpen = false;
  };

  handleGlobalResponseCancel = (event) => {
    this.isGlobalResponseOpen = event.isGlobalResponseOpen;
    this.responseToBeEdited = event.responseToBeEdited;
  };
  quickResponseTypeHandler(event) {}

  openGlobalMasterDataSlider(event) {
    this.responseTypeCloseEvent.emit({
      closeResponseModal: true,
      openMasterDataSlider: event
    });
  }
}
