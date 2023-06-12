import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  OnInit,
  TemplateRef
} from '@angular/core';

@Component({
  selector: 'app-lazy-load-container',
  templateUrl: './lazy-load-container.component.html',
  styleUrls: ['./lazy-load-container.component.scss']
})
export class LazyLoadContainerComponent implements OnInit, AfterContentChecked {
  @ContentChild('body', { static: true })
  contentTemplate: TemplateRef<ElementRef>;
  loadContent: boolean;

  constructor(private elRef: ElementRef) {}

  ngOnInit(): void {}

  ngAfterContentChecked(): void {
    if (this.elRef.nativeElement.offsetParent) {
      this.loadContent = true;
    }
  }
}
