/* eslint-disable no-underscore-dangle */
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';

@Component({
  selector: 'app-rdf-forms-iphone-preview',
  templateUrl: './iphone-preview.component.html',
  styleUrls: ['./iphone-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IphonePreviewComponent implements OnInit, OnDestroy {
  private _formData;
  @Input() set formData(data) {
    data.subscribe((val) => {
      this._formData = val;
      this.cdrf.markForCheck();
    });
  }
  get formData() {
    return this._formData;
  }
  constructor(
    private imageUtils: ImageUtils,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  getImageSrc(base64) {
    return this.imageUtils.getImageSrc(base64);
  }
}
