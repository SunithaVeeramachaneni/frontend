import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AnimationEvent } from '@angular/animations';

import { ToastData, TOAST_CONFIG_TOKEN, ToastConfig } from './toast-config';
import { ToastRef } from './toast-ref';
import { toastAnimations, ToastAnimationState } from './toast-animation';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['toast.component.scss'],
  animations: [toastAnimations.fadeToast]
})
export class ToastComponent implements OnInit, OnDestroy {
  animationState: ToastAnimationState = 'default';
  iconType: string;

  private intervalId;

  constructor(
    readonly data: ToastData,
    readonly ref: ToastRef,
    @Inject(TOAST_CONFIG_TOKEN) public toastConfig: ToastConfig,
    private toastService: ToastService
  ) {
    this.iconType = data.type === 'success' ? 'done' : data.type;
  }

  ngOnInit() {
    this.intervalId = setTimeout(() => (this.animationState = 'closing'), 2000);
  }

  ngOnDestroy() {
    clearTimeout(this.intervalId);
    this.toastService.setToastData(
      this.toastService
        .getToastData()
        .filter((toastData) => toastData.text !== this.data.text)
    );
  }

  close() {
    this.ref.close();
  }

  onFadeFinished(event: AnimationEvent) {
    const { toState } = event;
    const isFadeOut = (toState as ToastAnimationState) === 'closing';
    const itFinished = this.animationState === 'closing';

    if (isFadeOut && itFinished) {
      this.close();
    }
  }
}
