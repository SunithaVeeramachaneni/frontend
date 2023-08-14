import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { assetImg } from 'src/app/app.constants';

@Component({
  selector: 'app-assets-detail-view',
  templateUrl: './assets-detail-view.component.html',
  styleUrls: ['./assets-detail-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetsDetailViewComponent implements OnInit {
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

  selectedAssetImageurl(asset: any) {
    return asset.image || assetImg;
  }
}
