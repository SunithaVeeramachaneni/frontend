import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ILayoutConf {
  navigationPos?: string; // side, top
  sidebarStyle?: string; // full, compact, closed
  sidebarCompactToggle?: boolean; // sidebar expandable on hover
}
export interface ILayoutChangeOptions {
  duration?: number;
  transitionClass?: boolean;
}
interface IAdjustScreenOptions {
  browserEvent?: any;
  route?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  public layoutConf: ILayoutConf = {};
  layoutConfSubject = new BehaviorSubject<ILayoutConf>(this.layoutConf);
  layoutConf$ = this.layoutConfSubject.asObservable();
  public isMobile: boolean;
  public currentRoute: string;
  public fullWidthRoutes = [];

  constructor() {
    this.setAppLayout(
      // ******** SET YOUR LAYOUT OPTIONS HERE *********
      {
        navigationPos: 'side', // side, top
        sidebarStyle: 'full', // full, compact, closed
        sidebarCompactToggle: false // applied when "sidebarStyle" is "compact"
      }
    );
  }

  setAppLayout(layoutConf: ILayoutConf) {
    this.layoutConf = { ...this.layoutConf, ...layoutConf };
  }

  publishLayoutChange(lc: ILayoutConf, opt: ILayoutChangeOptions = {}) {
    this.layoutConf = Object.assign(this.layoutConf, lc);
    this.layoutConfSubject.next(this.layoutConf);
  }

  adjustLayout(options: IAdjustScreenOptions = {}) {
    let sidebarStyle: string;
    this.currentRoute = options.route || this.currentRoute;
    sidebarStyle = this.isMobile ? 'closed' : 'full';

    if (this.currentRoute) {
      this.fullWidthRoutes.forEach((route) => {
        if (this.currentRoute.indexOf(route) !== -1) {
          sidebarStyle = 'closed';
        }
      });
    }

    this.publishLayoutChange({
      sidebarStyle
    });
  }
}
