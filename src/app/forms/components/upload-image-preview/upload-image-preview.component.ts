import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-image-preview',
  templateUrl: './upload-image-preview.component.html',
  styleUrls: ['./upload-image-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadImagePreviewComponent implements OnInit {
  @Input() image;
  @Input() index;
  @Output() triggerPreviewDialog: EventEmitter<null> = new EventEmitter();
  @Output() imageIndexEmitter: EventEmitter<number> =
    new EventEmitter<number>();
  constructor(private sanitizer: DomSanitizer) {}
  ngOnInit(): void {
    console.log('image', this.image);
  }

  getImageSrc = (source: string) => {
    if (source) {
      console.log('abcde');
      const base64Image = 'data:image/jpeg;base64,' + source;
      console.log('base64image', base64Image);
      return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
    }
  };

  triggerDelete() {
    this.imageIndexEmitter.emit(this.index);
  }

  triggerPreview() {
    this.triggerPreviewDialog.emit();
  }
}
