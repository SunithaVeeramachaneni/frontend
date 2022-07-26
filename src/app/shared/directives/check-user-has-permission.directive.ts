import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { LoginService } from 'src/app/components/login/services/login.service';
import { CommonService } from '../services/common.service';

@Directive({
  selector: '[appCheckUserHasPermission]'
})
export class CheckUserHasPermissionDirective {
  @Input()
  set appCheckUserHasPermission(permissions: string[]) {
    if (permissions) {
      this.loginService.loggedInUserInfo$.subscribe(
        ({ permissions: perms = [] }) => {
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
        }
      );
    }
  }
  hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private container: ViewContainerRef,
    private commonService: CommonService,
    private loginService: LoginService
  ) {}
}
