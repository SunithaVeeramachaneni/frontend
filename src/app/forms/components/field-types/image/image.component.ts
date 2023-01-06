import { Component, OnInit, Input } from '@angular/core';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  @Input() questionForm;

  constructor(private imageUtils: ImageUtils) {}

  ngOnInit(): void {}

  getImageSrc(base64) {
    return this.imageUtils.getImageSrc(base64);
  }
}
