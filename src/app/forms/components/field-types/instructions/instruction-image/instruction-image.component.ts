import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-instruction-image',
  templateUrl: './instruction-image.component.html',
  styleUrls: ['./instruction-image.component.scss']
})
export class InstructionImageComponent implements OnInit {
  @Input() image;
  @Input() index;
  @Output() indexEmitter: EventEmitter<number> = new EventEmitter<number>();
  @Output() triggerPreviewDialog: EventEmitter<null> = new EventEmitter();
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  getImageSrc = (source: string) => {
    if (source) {
      const base64Image = source.includes('base64,')
        ? source
        : 'data:image/jpeg;base64,' + source;
      return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
    }
  };
  triggerPreview() {
    this.triggerPreviewDialog.emit();
  }

  triggerDelete() {
    this.indexEmitter.emit(this.index);
  }
}
