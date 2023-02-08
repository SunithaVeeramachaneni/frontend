import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ValidationError } from 'src/app/interfaces';

@Component({
  selector: 'app-add-edit-uom',
  templateUrl: './add-edit-uom.component.html',
  styleUrls: ['./add-edit-uom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditUnitOfMeasurementComponent {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() createUnitData: EventEmitter<any> = new EventEmitter();
  @Input() set unitEditData(data) {
    // eslint-disable-next-line no-underscore-dangle
    this._unitEditData = data;
  }
  _unitEditData: any;

  cancel() {
    this.slideInOut.emit('out');
  }
}
