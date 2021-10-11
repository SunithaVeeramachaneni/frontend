import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private minimizeSidebarSubject = new BehaviorSubject<boolean>(true);
  private currentRouteUrlSubject = new BehaviorSubject<string>('');
  private commonFilterSubject = new BehaviorSubject<any>({
    "priority": [],
    "kitStatus": [],
    "workCenter": [],
    "assign": [],
    "search":"",
    "showOverdue": "",
  });
  private headerTitleSubject = new BehaviorSubject<string>('');

  minimizeSidebarAction$ = this.minimizeSidebarSubject.asObservable();
  currentRouteUrlAction$ = this.currentRouteUrlSubject.asObservable();
  commonFilterAction$ = this.commonFilterSubject.asObservable();
  headerTitleAction$ = this.headerTitleSubject.asObservable();

  private selectedDateSubject = new BehaviorSubject<string>("month");
  selectedDateAction$ = this.selectedDateSubject.asObservable();

  constructor() { }


  minimizeSidebar(minimize: boolean) {
    this.minimizeSidebarSubject.next(minimize);
  }

  searchFilter(filterObj) {
    this.commonFilterSubject.next(filterObj);
  }

  updateCurrentRouteUrl(value: string) {
    this.currentRouteUrlSubject.next(value);
  }

  updateHeaderTitle(value: string) {
    this.headerTitleSubject.next(value);
  }
  
  selectDate(selectedDate){
    this.selectedDateSubject.next(selectedDate)
  }
}
