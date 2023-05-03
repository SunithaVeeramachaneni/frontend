/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
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
import { Observable } from 'rxjs';
import { ValidationError } from 'src/app/interfaces';

@Component({
  selector: 'app-add-edit-mdm',
  templateUrl: './add-edit-mdm.component.html',
  styleUrls: ['./add-edit-mdm.component.scss']
})
export class AddEditMdmComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {}

  cancel() {
    this.slideInOut.emit('out');
  }
}
