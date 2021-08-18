import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CommonService } from '../../shared/service/common.service';

@Component({
  selector: 'app-component-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public sidebarMinimize = false;
  @Input() title;
  constructor(private commonService: CommonService) {}

  ngOnInit() {}

  minimize() {
     this.sidebarMinimize = !this.sidebarMinimize;
    this.commonService.minimizeSidebar(this.sidebarMinimize);
  }

}
