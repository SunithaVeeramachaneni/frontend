import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  OnInit,
  Input,
  Output
} from '@angular/core';
import { permissions } from 'src/app/app.constants';

@Component({
  selector: 'app-spcc-card',
  templateUrl: './spcc-card.component.html',
  styleUrls: ['./spcc-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SPCCCardComponent implements OnInit {
  @Input() workOrder;
  @Input() technicians;
  @Output() assign = new EventEmitter();
  isDropdownOpen = false;
  readonly permissions = permissions;

  constructor() {}

  ngOnInit() {}

  assignTech = (technician, workOrder) => {
    this.assign.emit({ technician, workOrder });
  };
}
