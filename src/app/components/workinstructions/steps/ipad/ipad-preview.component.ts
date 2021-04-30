import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Base64HelperService } from '../../../../shared/base64-helper.service';
import { State } from '../../../../state/app.state';
import { getCurrentStepImages } from '../../state/instruction.selectors';

@Component({
    selector: 'app-ipad-preview',
    templateUrl: './ipad-preview.component.html',
    styleUrls: ['./ipad-preview.component.css']
  })

export class IpadPreviewComponent implements OnInit, OnDestroy {
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
    base64ImageDetails = {};
    stepImages = {};
    private currentStepImagesSubscription: Subscription;

    constructor(private base64HelperService: Base64HelperService,
                private store: Store<State>) {}

    ngOnInit() {
      this.currentStepImagesSubscription = this.store.select(getCurrentStepImages).subscribe(
        () => this.stepImages = this.base64HelperService.getBase64ImageDetails()
      );
    }
    ngOnDestroy() {
      this.stepImages = {};
      if (this.currentStepImagesSubscription) {
        this.currentStepImagesSubscription.unsubscribe();
      }
    }
}
