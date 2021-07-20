import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-component-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public sideBarMinimize = false;
  @Input() title;
  constructor( ) {}

  ngOnInit() {}

  minimize() {
    this.sideBarMinimize = !this.sideBarMinimize;
    console.log(this.sideBarMinimize)
  }

}
