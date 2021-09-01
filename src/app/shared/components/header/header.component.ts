import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { HeaderService } from '../../service/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public username : string;
  public userImage: string;
  public sidebarMinimize = false;
  @Input() title;
  constructor(
    private _headerSvc: HeaderService,
    private commonService: CommonService
  ) {}


  ngOnInit() {
    this.getLogonUserDetails();
  }
  
  getLogonUserDetails = () =>{
    this._headerSvc.getLogonUserDetails().subscribe((resp)=>{
      if(resp){
        this.userImage = "data:image/jpeg;base64,"+resp[0].FILECONTENT;
        this.username=resp[0].SHORT;
      }
    })
  }

  minimize() {
     this.sidebarMinimize = !this.sidebarMinimize;
    this.commonService.minimizeSidebar(this.sidebarMinimize);
  }

}
