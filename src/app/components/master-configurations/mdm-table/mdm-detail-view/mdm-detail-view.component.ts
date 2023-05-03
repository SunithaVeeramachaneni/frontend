import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'app-mdm-detail-view',
  templateUrl: './mdm-detail-view.component.html',
  styleUrls: ['./mdm-detail-view.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdmDetailViewComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Input() selectedAsset;
  constructor() {}

  ngOnInit(): void {}

  edit() {
    this.slideInOut.emit({ status: 'out', data: this.selectedAsset });
  }

  cancel() {
    this.slideInOut.emit({ status: 'out', data: '' });
  }
}
