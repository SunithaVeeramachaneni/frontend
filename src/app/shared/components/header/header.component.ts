import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
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
  public sideBarOpen = '../../../../assets/img/sidebar-opened.svg';
  public sideBarClosed = '../../../../assets/img/sidebar-closed.svg';
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
    this.getLogonUserDetails();
  }
  
  getLogonUserDetails = () =>{
    this._headerSvc.getLogonUserDetails().subscribe((resp)=>{
      if (resp.length) {
        this.userImage = "data:image/jpeg;base64,"+resp[0].FILECONTENT;
        this.username=resp[0].SHORT;
      }
    })
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
