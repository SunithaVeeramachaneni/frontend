import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Base64HelperService } from '../../services/base64-helper.service';
import {
  getCurrentStep,
  getCurrentStepImages
} from '../../state/instruction.selectors';
import { Instruction, Step } from '../../../../interfaces';
import { SelectedInstructionData } from '../overview.component';
import { State } from '../../state/instruction.reducer';

@Component({
  selector: 'app-ipad-preview',
  templateUrl: './ipad-preview.component.html',
  styleUrls: ['./ipad-preview.component.scss']
})
export class IpadPreviewComponent implements OnInit, OnDestroy {
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
  base64ImageDetails = {};
  stepImages = {};
  step: Step;
  private currentStepImagesSubscription: Subscription;
  private currentStepSubscription: Subscription;

  constructor(
    private base64HelperService: Base64HelperService,
    private store: Store<State>
  ) {}

  ngOnInit() {
    this.currentStepImagesSubscription = this.store
      .select(getCurrentStepImages)
      .subscribe(
        () =>
          (this.stepImages = this.base64HelperService.getBase64ImageDetails())
      );

    this.currentStepSubscription = this.store
      .select(getCurrentStep)
      .subscribe((step) => (this.step = step));
  }

  getStepImage = (file: string) =>
    this.stepImages[`${this.step?.WI_Id}/${this.step?.StepId}/${file}`];

  ngOnDestroy() {
    this.stepImages = {};
    if (this.currentStepImagesSubscription) {
      this.currentStepImagesSubscription.unsubscribe();
    }

    if (this.currentStepSubscription) {
      this.currentStepSubscription.unsubscribe();
    }
  }
}
