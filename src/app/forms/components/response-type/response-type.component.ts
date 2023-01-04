import { Component, Output, OnInit, Input, EventEmitter } from '@angular/core';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-response-type',
  templateUrl: './response-type.component.html',
  styleUrls: ['./response-type.component.scss']
})
export class ResponseTypeComponent implements OnInit {
  @Output() selectFieldTypeEvent: EventEmitter<any> = new EventEmitter();
  @Output() openResponseTypeModalEvent: EventEmitter<any> = new EventEmitter();

  @Input() fieldTypes;
  @Input() question;

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
    this.openResponseTypeModalEvent.emit(false);
  }

  toggleResponseTypeModal(value) {
    this.openResponseTypeModalEvent.emit(value);
  }

  handleResponses() {
    this.isMCQResponseOpen = true;
    if (this.isMCQResponseOpen) {
      this.formService.setMultiChoiceOpenState(true);
      this.openResponseTypeModalEvent.emit(false);
    }
  }
}
