// Ref Link: https://stackblitz.com/edit/angular-9a25dh?file=src%2Fapp%2Falbum%2Falbum.component.html
import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  AfterViewInit
} from '@angular/core';

@Directive({
  selector: '[appAmIvisible]'
})
export class AmIvisibleDirective implements AfterViewInit {
  @Output() elementVisible = new EventEmitter<boolean>();
  @Input() isTargetElement: boolean;
  intersectionOptions = {
    root: null, //implies the root is the document viewport
    rootMargin: '0px',
    threshold: [0, 0.5, 1]
  };

  constructor(private element: ElementRef) {}

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      this.intersectionCallback.bind(this),
      this.intersectionOptions
    );
    if (this.isTargetElement) {
      observer.observe(this.element.nativeElement);
    }
  }

  intersectionCallback(entries, observer) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio === 1) {
        this.elementVisible.emit(true); //element is completely visible in the viewport
      } else {
        this.elementVisible.emit(false);
      }
    });
  }
}
