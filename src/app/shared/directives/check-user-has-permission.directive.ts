import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { LoginService } from 'src/app/components/login/services/login.service';

@Directive({
  selector: '[appCheckUserHasPermission]'
})
export class CheckUserHasPermissionDirective {
  @Input()
  set appCheckUserHasPermission(permissions: string[]) {
    if (permissions) {
      this.permissions = permissions;
      this.updateView();
    }
  }
  hasView = false;
  permissions: string[];

  constructor(
    private templateRef: TemplateRef<any>,
    private container: ViewContainerRef,
    private loginService: LoginService
  ) {}

  updateView() {
    this.loginService.loggedInUserInfo$
      .pipe(take(1))
      .subscribe(({ permissions: perms = [] }) => {
        const hasPermission = perms.find((per) =>
          this.permissions.includes(per.name)
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
