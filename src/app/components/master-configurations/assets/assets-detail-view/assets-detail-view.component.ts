import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { AssetsService } from '../services/assets.service';

@Component({
  selector: 'app-assets-detail-view',
  templateUrl: './assets-detail-view.component.html',
  styleUrls: ['./assets-detail-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetsDetailViewComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Input() selectedAsset;
  constructor(private assetService: AssetsService) {}

  ngOnInit(): void {}

  edit() {
    this.slideInOut.emit({ status: 'out', data: this.selectedAsset });
    this.assetService.sendDataAsset(this.selectedAsset);
  }

  cancel() {
    this.slideInOut.emit({ status: 'out', data: '' });
  }
}
