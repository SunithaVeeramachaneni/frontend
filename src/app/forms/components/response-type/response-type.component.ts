import { Component, Output, OnInit, Input, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormService } from '../../services/form.service';
import { getResponseSets } from '../../state';

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
  public isGlobalResponseOpen = false;
  public globalResponses$: Observable<[]>;
  public responseToBeEdited: any;

  constructor(private formService: FormService, private store: Store) {}

  ngOnInit(): void {
    this.globalResponses$ = this.store
      .select(getResponseSets)
      .pipe((responses: any) => {
        console.log(responses);
        return responses;
      });
    this.globalResponses$.subscribe();
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

  handleResponses() {
    this.isMCQResponseOpen = true;
    if (this.isMCQResponseOpen) {
      this.formService.setMultiChoiceOpenState(true);
      this.formService.setOpenResponseType(false);
    }
  }

  handleGlobalResponsesToggle() {
    this.isGlobalResponseOpen = !this.isGlobalResponseOpen;
  }

  handleEditGlobalResponse = (response: any) => {
    this.responseToBeEdited = response;
  };
}
