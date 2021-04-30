import {Component, Input, OnInit, OnDestroy} from '@angular/core';

@Component({
    selector: 'app-iphone-preview',
    templateUrl: './iphone-preview.component.html',
    styleUrls: ['./iphone-preview.component.css']
  })

export class IphonePreviewComponent implements OnInit, OnDestroy {
  @Input() titleProvided;
  @Input() selectedID;
  @Input() tabs;
  @Input() selectedInstructionData: any[];
  @Input() selectedInstruction: any[];
  @Input() loadedImages: any[];
  @Input() currentStepTitle;
  @Input() instructions;
  @Input() warnings;
  @Input() hints;
  @Input() reactionPlan;

    constructor() {}

    ngOnInit() {}

    ngOnDestroy() {}
}
