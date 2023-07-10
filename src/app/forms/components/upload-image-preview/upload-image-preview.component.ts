import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-upload-image-preview',
  templateUrl: './upload-image-preview.component.html',
  styleUrls: ['./upload-image-preview.component.scss']
})
export class UploadImagePreviewComponent implements OnInit {
  @Input() image;
  @Input() index;
  @Output() triggerPreviewDialog: EventEmitter<null> = new EventEmitter();
  @Output() imageIndexEmitter: EventEmitter<number> =
    new EventEmitter<number>();

  ngOnInit(): void {
    console.log('image', this.image);
  }

  triggerDelete() {
    this.imageIndexEmitter.emit(this.index);
  }

  triggerPreview() {
    this.triggerPreviewDialog.emit();
  }
}
