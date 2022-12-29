import { Component, Output, OnInit, Input, EventEmitter } from '@angular/core';

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

  public responseDrawer = false;
  public sliderdrawer = false;

  ngOnInit(): void {}

  getFieldTypeImage(type) {
    return type ? `assets/rdf-forms-icons/fieldType-icons/${type}.svg` : null;
  }

  selectFieldType(fieldType) {
    this.selectFieldTypeEvent.emit(fieldType);
  }

  toggleResponseTypeModal(value) {
    this.openResponseTypeModalEvent.emit(value);
  }
}
