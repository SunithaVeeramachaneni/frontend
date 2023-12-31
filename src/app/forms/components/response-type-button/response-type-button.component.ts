import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-response-type-button',
  templateUrl: './response-type-button.component.html',
  styleUrls: ['./response-type-button.component.scss']
})
export class ResponseTypeButtonComponent implements OnInit {
  @Input() questionForm;
  @Input() fieldTypes;
  @Input() title;
  @Output() responseTypeOpenEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  constructor(private formService: FormService) {}

  ngOnInit(): void {}

  getFieldTypeImage(type) {
    return type ? `icon-${type}` : null;
  }

  getFieldTypeDescription(type) {
    return type
      ? this.fieldTypes.find((field) => field.type === type)?.description
      : null;
  }

  openResponseTypeModal() {
    this.responseTypeOpenEvent.emit(true);
  }
}
