/* eslint-disable no-underscore-dangle */
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';

@Component({
  selector: 'app-rdf-forms-iphone-preview',
  templateUrl: './iphone-preview.component.html',
  styleUrls: ['./iphone-preview.component.css']
})
export class IphonePreviewComponent implements OnInit, OnDestroy {
  private _formData;
  @Input() set formData(data) {
    this._formData = data;
  }
  get formData() {
    return this._formData;
  }
  constructor(private imageUtils: ImageUtils) {}

  ngOnInit() {}

  ngOnDestroy() {}

  getImageSrc(base64) {
    return this.imageUtils.getImageSrc(base64);
  }
}
