import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  constructor() {}

  ngOnInit(): void {}

  triggerPreview() {
    this.triggerPreviewDialog.emit();
  }

  triggerDelete() {
    this.indexEmitter.emit(this.index);
  }
}
