import { Component, Output, OnInit, Input, EventEmitter } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-response-type',
  templateUrl: './response-type.component.html',
  styleUrls: ['./response-type.component.scss']
})
export class ResponseTypeComponent implements OnInit {
  @Output() selectFieldTypeEvent: EventEmitter<any> = new EventEmitter<any>();

  @Input() fieldTypes;
  @Input() question;

  public isMCQResponseOpen = false;
  quickResponsesData$: Observable<any>;
  createEditQuickResponse$ = new BehaviorSubject<any>({
    type: 'create',
    response: {}
  });
  quickResponsesLoading = false;

  constructor(
    private formService: FormService,
    private rdfService: RaceDynamicFormService
  ) {}

  ngOnInit(): void {
    this.quickResponsesLoading = true;
    this.quickResponsesData$ = combineLatest([
      of({ data: [] }),
      this.rdfService.getDataSetsByType$('quickResponses').pipe(
        tap((v) => {
          this.quickResponsesLoading = false;
        })
      ),
      this.createEditQuickResponse$
    ]).pipe(
      map(([initial, responses, { type, response, responseType }]) => {
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
          }
          return initial;
        }
      })
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
    this.formService.setOpenResponseType(false);
  }

  toggleResponseTypeModal(value) {
    this.formService.setOpenResponseType(false);
  }

  handleResponses(response = {}) {
    this.isMCQResponseOpen = true;
    if (this.isMCQResponseOpen) {
      this.formService.setMultiChoiceOpenState({
        isOpen: true,
        response
      });
      this.formService.setOpenResponseType(false);
    }
  }

  quickResponseTypeHandler(event) {
    console.log(event);
  }
}
