import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-response-type-button',
  templateUrl: './response-type-button.component.html',
  styleUrls: ['./response-type-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponseTypeButtonComponent implements OnInit {
  @Input() questionForm;
  @Input() fieldTypes;
  @Input() title;
  @Input() isImported: boolean;
  @Output() responseTypeOpenEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  constructor() {}

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
