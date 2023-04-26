import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-round-plan-image-preview',
  templateUrl: './round-plan-image-preview.component.html',
  styleUrls: ['./round-plan-image-preview.component.scss']
})
export class RoundPlanImagePreviewComponent implements OnInit {
  @Input() image;
  @Input() index;
  @Output() indexEmitter: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {
    console.log(this.image);
  }

  triggerDelete() {
    this.indexEmitter.emit(this.index);
  }
}
