import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LogonUserDetails } from '../../../interfaces';
import { CommonService } from '../../services/common.service';
import { HeaderService } from '../../services/header.service';
import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public username : string;
  public userImage: string;
  public sidebarMinimize = false;
  logonUserDetails$: Observable<LogonUserDetails>;
  public sideBarOpen = '../../../../assets/img/sidebar-opened.svg';
  public sideBarClosed = '../../../../assets/img/sidebar-closed.svg';
  @Input() title;
  private minimizeSidebarActionSubscription: Subscription;

  isAuthenticated = false;
  userData$: Observable<UserDataResult>;

  constructor(
    private _headerSvc: HeaderService,
    private commonService: CommonService,
    public oidcSecurityService: OidcSecurityService
  ) {}


  ngOnInit() {
    this.minimizeSidebarActionSubscription = this.commonService.minimizeSidebarAction$.subscribe(data => {
      this.sidebarMinimize = data;
    });
    this.logonUserDetails$ = this._headerSvc.getLogonUserDetails();
    this.logonUserDetails$.subscribe(res=>{
      console.log("logindata",res)
    })
    this.userData$ = this.oidcSecurityService.userData$;
    this.userData$.subscribe(res=>{
      console.log("userData",res)
    })
  }

  minimize(e) {
    this.sidebarMinimize = e;
    this.commonService.minimizeSidebar(this.sidebarMinimize);
  }

  ngOnDestroy(): void {
    if (this.minimizeSidebarActionSubscription) {
      this.minimizeSidebarActionSubscription.unsubscribe();
    }    
  }

  signout(){
    console.log("logging off")
    this.oidcSecurityService.logoff();
  }

}
