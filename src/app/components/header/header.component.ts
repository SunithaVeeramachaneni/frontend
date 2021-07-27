import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-component-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public username : string;
  public userImage: string;
  public sideBarMinimize = false;
  @Input() title;
  constructor(
    private _headerSvc: HeaderService,
  ) { }

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
    this.sideBarMinimize = !this.sideBarMinimize;
    console.log(this.sideBarMinimize)
  }

}
