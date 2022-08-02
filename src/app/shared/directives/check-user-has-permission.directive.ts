import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
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
  @Input() set appCheckUserHasPermissionElse(
    elseTemplateRef: TemplateRef<unknown>
  ) {
    this.elseTemplateRef = elseTemplateRef;
    this.updateView();
  }
  hasView = false;
  permissions: string[];
  elseTemplateRef: TemplateRef<unknown>;

  constructor(
    private templateRef: TemplateRef<any>,
    private container: ViewContainerRef,
    private loginService: LoginService
  ) {}

  updateView() {
    this.loginService.loggedInUserInfo$.subscribe(
      ({ permissions: perms = [] }) => {
        const hasPermission = perms.find((per) =>
          this.permissions.includes(per.name)
        );
        this.container.clear();
        if (hasPermission) {
          this.container.createEmbeddedView(this.templateRef);
        } else if (this.elseTemplateRef) {
          this.container.createEmbeddedView(this.elseTemplateRef);
        }
      }
    );
  }
}
