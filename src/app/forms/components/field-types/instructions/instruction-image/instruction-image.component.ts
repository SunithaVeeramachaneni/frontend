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

  constructor() {}

  ngOnInit(): void {}

  triggerDelete() {
    this.indexEmitter.emit(this.index);
  }
}
