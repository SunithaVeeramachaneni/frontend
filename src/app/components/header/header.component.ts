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
    private _headerSvc: HeaderService
  ) { }

  ngOnInit() {
    this.getLogonUserDetails();
  }
  
  getLogonUserDetails = () =>{
    this._headerSvc.getLogonUserDetails().subscribe((resp)=>{
      if(resp){
        console.log("The logon user detials are", resp[0])
      }
    })
  }

  minimize() {
    this.sideBarMinimize = !this.sideBarMinimize;
    console.log(this.sideBarMinimize)
  }

}
