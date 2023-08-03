import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Slide } from './carousel.interface';
import { trigger, transition, useAnimation } from '@angular/animations';

import {
  AnimationType,
  scaleIn,
  scaleOut,
  fadeIn,
  fadeOut,
  flipIn,
  flipOut,
  jackIn,
  jackOut
} from './carousel.animations';
import { Base64HelperService } from '../../services/base64-helper.service';
import { Store } from '@ngrx/store';
import {
  getCurrentStep,
  getCurrentStepImages
} from '../../state/instruction.selectors';
import { Subscription } from 'rxjs';
import { Step } from '../../../../interfaces';
import { State } from '../../state/instruction.reducer';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('slideAnimation', [
      /* scale */
      transition('void => scale', [
        useAnimation(scaleIn, { params: { time: '500ms' } })
      ]),
      transition('scale => void', [
        useAnimation(scaleOut, { params: { time: '500ms' } })
      ]),

      /* fade */
      transition('void => fade', [
        useAnimation(fadeIn, { params: { time: '500ms' } })
      ]),
      transition('fade => void', [
        useAnimation(fadeOut, { params: { time: '500ms' } })
      ]),

      /* flip */
      transition('void => flip', [
        useAnimation(flipIn, { params: { time: '500ms' } })
      ]),
      transition('flip => void', [
        useAnimation(flipOut, { params: { time: '500ms' } })
      ]),

      /* JackInTheBox */
      transition('void => jackInTheBox', [
        useAnimation(jackIn, { params: { time: '700ms' } })
      ]),
      transition('jackInTheBox => void', [
        useAnimation(jackOut, { params: { time: '700ms' } })
      ])
    ])
  ]
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() slides: Slide[];

  @Input() animationType = AnimationType.Scale;

  currentSlide = 0;
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
    this.slides = [];
    this.stepImages = {};
    if (this.currentStepImagesSubscription) {
      this.currentStepImagesSubscription.unsubscribe();
    }

    if (this.currentStepSubscription) {
      this.currentStepSubscription.unsubscribe();
    }
  }
}
