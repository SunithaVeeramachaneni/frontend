import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-round-plan-pdf-preview',
  templateUrl: './round-plan-pdf-preview.component.html',
  styleUrls: ['./round-plan-pdf-preview.component.scss']
})
export class RoundPlanPdfPreviewComponent implements OnInit {
  @Input() pdf: any;

  @Output() indexEmitter: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {
    console.log('pdf', this.pdf);
  }

  triggerDelete() {
    this.indexEmitter.emit(this.pdf.index);
  }
}
