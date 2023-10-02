import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, take, tap } from 'rxjs/operators';
import { Permission } from '../../interfaces';
import { routingUrls } from '../../app.constants';
import { HeaderService } from '../../shared/services/header.service';
import { LoginService } from '../login/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isNavigated: boolean;
  permissions: Permission[];

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.loginService.loggedInUserInfo$
      .pipe(
        filter((userInfo) => userInfo && Object.keys(userInfo).length !== 0),
        take(1),
        tap(({ permissions }) => {
          this.permissions = permissions;
          const returnUrl = sessionStorage.getItem('returnUrl');
          if (
            returnUrl &&
            returnUrl !== '/home' &&
            returnUrl !== '/access-denied'
          ) {
            sessionStorage.removeItem('returnUrl');
            this.router.navigate([returnUrl]);
          } else {
            this.navigateToModule();
          }
        })
      )
      .subscribe();
  }

  navigateToModule() {
    const {
      dashboard,
      tenantManagement,
      userManagement,
      maintenance,
      spareParts,
      workInstructions,
      raceDynamicForms,
      myRoundPlans,
      masterConfiguration
    } = routingUrls;

    const modules = [
      dashboard,
      tenantManagement,
      userManagement,
      maintenance,
      spareParts,
      workInstructions,
      raceDynamicForms,
      myRoundPlans,
      masterConfiguration
    ];

    const module = modules.find((mod) =>
      this.permissions.some((permission) => mod.permission === permission.name)
    );
    if (module) {
      this.headerService.setHeaderTitle(module.title);
      this.router.navigate([module.url]);
    }
  }
}
