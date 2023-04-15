import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicPreviewResponseTypeLoader]'
})
export class DynamicPreviewResponseTypeLoaderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
