import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonService } from '../services/common.service';

@Directive({
  selector: '[appCheckUserHasPermission]'
})
export class CheckUserHasPermissionDirective {
  @Input()
  set appCheckUserHasPermission(permissions: string[]) {
    if (permissions) {
      this.commonService.permissionsAction$.subscribe((perms) => {
        const hasPermission = perms.find((per) =>
          permissions.includes(per.name)
        );
        if (hasPermission && !this.hasView) {
          this.container.createEmbeddedView(this.templateRef);
          this.hasView = true;
        } else {
          this.container.clear();
          this.hasView = false;
        }
      });
    }
  }
  hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private container: ViewContainerRef,
    private commonService: CommonService
  ) {}
}
