import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  OnInit,
  Input,
  Output
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-spcc-card',
  templateUrl: './spcc-card.component.html',
  styleUrls: ['./spcc-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SPCCCardComponent implements OnInit {
  constructor(private translateService: TranslateService) {}

  @Input('workOrder') workOrder;
  @Input('technicians') technicians;
  @Output('assign') assign = new EventEmitter();
  isDropdownOpen = false;
  ngOnInit() {}

  assignTech = (technician, workOrder) => {
    this.assign.emit({ technician, workOrder });
  };

  ngOnDestroy() {}
}
