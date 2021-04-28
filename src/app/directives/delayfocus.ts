import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[delayFocus]'
})
export class DelayFocusDirective {

  @Input() delayFocusInterval;
  @Input() set delayFocus(condition: boolean) {
    if (condition) {
      console.log(this.delayFocusInterval);
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, this.delayFocusInterval | 500);
    }
  }
  constructor(private el: ElementRef) { }

}
