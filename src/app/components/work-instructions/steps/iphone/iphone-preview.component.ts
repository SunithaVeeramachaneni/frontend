import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Instruction } from 'src/app/interfaces';
import { SelectedInstructionData } from '../overview.component';

@Component({
  selector: 'app-iphone-preview',
  templateUrl: './iphone-preview.component.html',
  styleUrls: ['./iphone-preview.component.scss']
})
export class IphonePreviewComponent implements OnInit, OnDestroy {
  @Input() titleProvided;
  @Input() selectedID;
  @Input() tabs;
  @Input() selectedInstructionData: SelectedInstructionData;
  @Input() selectedInstruction: Instruction;
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
