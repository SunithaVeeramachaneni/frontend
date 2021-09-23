import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LogonUserDetails } from '../../../interfaces';
import { CommonService } from '../../services/common.service';
import { HeaderService } from '../../services/header.service';

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
  @Input() title;
  private minimizeSidebarActionSubscription: Subscription;

  constructor(
    private _headerSvc: HeaderService,
    private commonService: CommonService
  ) {}


  ngOnInit() {
    this.minimizeSidebarActionSubscription = this.commonService.minimizeSidebarAction$.subscribe(data => {
      this.sidebarMinimize = data;
    });
    this.logonUserDetails$ = this._headerSvc.getLogonUserDetails();
  }

  minimize() {
     this.sidebarMinimize = !this.sidebarMinimize;
    this.commonService.minimizeSidebar(this.sidebarMinimize);
  }

  ngOnDestroy(): void {
    if (this.minimizeSidebarActionSubscription) {
      this.minimizeSidebarActionSubscription.unsubscribe();
    }    
  }

}
