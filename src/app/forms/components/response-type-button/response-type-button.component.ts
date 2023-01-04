import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-response-type-button',
  templateUrl: './response-type-button.component.html',
  styleUrls: ['./response-type-button.component.scss']
})
export class ResponseTypeButtonComponent implements OnInit {
  @Input() questionForm;
  @Input() fieldTypes;
  @Output() openResponseTypeEvent: EventEmitter<boolean> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  getFieldTypeImage(type) {
    return type ? `assets/rdf-forms-icons/fieldType-icons/${type}.svg` : null;
  }

  getFieldTypeDescription(type) {
    return type
      ? this.fieldTypes.find((field) => field.type === type)?.description
      : null;
  }
}
