import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-upload-pdf-preview',
  templateUrl: './upload-pdf-preview.component.html',
  styleUrls: ['./upload-pdf-preview.component.scss']
})
export class UploadPdfPreviewComponent implements OnInit {
  @Input() pdf: any;
  @Input() index: number;

  @Output() pdfIndexEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  triggerDelete() {
    //this.pdfIndexEmitter.emit({ index: this.pdf.index, type: 'pdf' });
    this.pdfIndexEmitter.emit(this.index);
  }
}
