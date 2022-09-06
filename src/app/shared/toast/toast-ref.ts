// @ts-ignore
import { OverlayRef } from '@angular/cdk/overlay';

// @ts-ignore
export class ToastRef {
  constructor(private readonly overlay: OverlayRef) {}

  close() {
    this.overlay.dispose();
  }

  isVisible() {
    return (
      this.overlay &&
      this.overlay.overlayElement &&
      window.getComputedStyle(this.overlay.overlayElement).display === 'none'
    );
  }

  getPosition() {
    return this.overlay.overlayElement.getBoundingClientRect();
  }
}
