import { Component, Output, OnInit, Input, EventEmitter } from '@angular/core';
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
}
