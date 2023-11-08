import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-instruction-pdf',
  templateUrl: './instruction-pdf.component.html',
  styleUrls: ['./instruction-pdf.component.scss']
})
export class InstructionPdfComponent implements OnInit {
  @Input() pdf;
  @Input() index;
  @Output() indexEmitter: EventEmitter<number> = new EventEmitter<number>();
  @Output() triggerPreviewDialog: EventEmitter<null> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  triggerPreview() {
    this.triggerPreviewDialog.emit();
  }
  triggerDelete() {
    this.indexEmitter.emit(this.index);
  }
}
