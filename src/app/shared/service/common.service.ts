import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private minimizeSidebarSubject = new BehaviorSubject<boolean>(false);
  minimizeSidebarAction$ = this.minimizeSidebarSubject.asObservable();

  constructor() { }

  minimizeSidebar(minimize: boolean) {
    this.minimizeSidebarSubject.next(minimize);
  }
}
