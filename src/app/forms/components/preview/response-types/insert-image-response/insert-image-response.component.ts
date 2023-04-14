import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';

@Component({
  selector: 'app-insert-image-response',
  templateUrl: './insert-image-response.component.html',
  styleUrls: ['./insert-image-response.component.scss']
})
export class InsertImageResponseComponent implements OnInit {
  @Input() question: Question;

  constructor(private imageUtils: ImageUtils) {}

  ngOnInit(): void {}

  getImageSrc(base64) {
    return this.imageUtils.getImageSrc(base64);
  }
}
