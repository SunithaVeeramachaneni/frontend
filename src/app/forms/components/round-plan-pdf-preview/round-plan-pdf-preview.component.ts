import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-round-plan-pdf-preview',
  templateUrl: './round-plan-pdf-preview.component.html',
  styleUrls: ['./round-plan-pdf-preview.component.scss']
})
export class RoundPlanPdfPreviewComponent implements OnInit {
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
