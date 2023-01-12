import { Component, Output, OnInit, Input, EventEmitter } from '@angular/core';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-response-type',
  templateUrl: './response-type.component.html',
  styleUrls: ['./response-type.component.scss']
})
export class ResponseTypeComponent implements OnInit {
  @Input() fieldTypes;
  @Input() question;
  @Output() selectFieldTypeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() responseTypeCloseEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public isMCQResponseOpen = false;

  constructor(private formService: FormService) {}

  ngOnInit(): void {}

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

  toggleResponseTypeModal(value) {
    this.responseTypeCloseEvent.emit(true);
  }

  handleResponses() {
    this.isMCQResponseOpen = true;
    if (this.isMCQResponseOpen) {
      this.formService.setMultiChoiceOpenState(true);
      this.responseTypeCloseEvent.emit(true);
    }
  }
}
