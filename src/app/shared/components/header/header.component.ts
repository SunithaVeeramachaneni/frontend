import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-component-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public sidebarMinimize = false;
  @Input() title;
  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.commonService.minimizeSidebarAction$.subscribe(data => {
      this.sidebarMinimize = data;
    });
  }

  minimize() {
     this.sidebarMinimize = !this.sidebarMinimize;
    this.commonService.minimizeSidebar(this.sidebarMinimize);
  }

}
