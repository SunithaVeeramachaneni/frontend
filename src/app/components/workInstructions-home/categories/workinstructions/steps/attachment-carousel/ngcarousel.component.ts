import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Slick } from 'ngx-slickjs';
import { Subscription } from 'rxjs';
import { Base64HelperService } from '../../../../../../shared/base64-helper.service';
import { State } from '../../../../../../state/app.state';
import { getCurrentStepImages } from '../../state/instruction.selectors';
import { Slide } from "./carousel.interface";

@Component({
  selector: 'app-ngcarousel',
  template: `
               <div slickContainer #slickController="slick" [slickConfig]="config">
                <ng-container *ngIf="slickController.initialize">
                    <img slickItem *ngFor="let slide of slides; let i = index" [hidden]="!stepImages[slide.src]" [attr.src]="stepImages[slide.src]">
                </ng-container>
                </div>
                `,
  styles: [`
            .slick-slider {
                margin-left: -13px;
            }
            .slick-initialized .slick-slide {
                display: block;
                height:250px;
                width: 230px;
                margin-left: 0px;
                padding: 0px 10px 0px 0px;
            }
            `]
})
export class NgCarousel implements OnInit, OnDestroy {
  config: Slick.Config = {
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      dots: false,
      autoplay: false,
      variableWidth: true,
    };

 @Input() slides: Slide[];

  currentSlide = 0;
  stepImages = {};
  private currentStepImagesSubscription: Subscription;

  constructor(private base64HelperService: Base64HelperService,
              private store: Store<State>) {}

  ngOnInit() {
    // this.preloadImages(); // for the demo
    this.currentStepImagesSubscription = this.store.select(getCurrentStepImages).subscribe(
      () => this.stepImages = this.base64HelperService.getBase64ImageDetails()
    );
  }

  ngOnDestroy() {
    this.slides = [];
    this.stepImages = {};
    if (this.currentStepImagesSubscription) {
      this.currentStepImagesSubscription.unsubscribe();
    }
  }

  preloadImages() {
    for (const slide of this.slides) {
      new Image().src = this.base64HelperService.getBase64ImageData(slide.src);
    }
  }
}
