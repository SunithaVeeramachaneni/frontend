/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Slick } from 'ngx-slickjs';
import { Subscription } from 'rxjs';
import { Base64HelperService } from '../../services/base64-helper.service';
import {
  getCurrentStep,
  getCurrentStepImages
} from '../../state/instruction.selectors';
import { Slide } from './carousel.interface';
import { Step } from '../../../../interfaces';
import { State } from '../../state/instruction.reducer';

@Component({
  selector: 'app-ngcarousel',
  template: `
    <div slickContainer #slickController="slick" [slickConfig]="config">
      <ng-container *ngIf="slickController.initialize">
        <img
          slickItem
          *ngFor="let slide of slides; let i = index"
          [hidden]="!getStepImage(slide.src)"
          [attr.src]="getStepImage(slide.src)"
        />
      </ng-container>
    </div>
  `,
  styles: [
    `
      .slick-slider {
        margin-left: -13px;
      }
      .slick-initialized .slick-slide {
        display: block;
        height: 250px;
        width: 230px;
        margin-left: 0px;
        padding: 0px 10px 0px 0px;
      }
    `
  ]
})
export class NgCarousel implements OnInit, OnDestroy {
  @Input() slides: Slide[];
  config: Slick.Config = {
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    dots: false,
    autoplay: false,
    variableWidth: true
  };

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
