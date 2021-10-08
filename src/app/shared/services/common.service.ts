import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private minimizeSidebarSubject = new BehaviorSubject<boolean>(true);
  minimizeSidebarAction$ = this.minimizeSidebarSubject.asObservable();

  private commonFilterSubject = new BehaviorSubject<any>({
    "priority": [],
    "kitStatus": [],
    "workCenter": [],
    "assign": [],
    "search":"",
    "showOverdue": "",
  });
  commonFilterAction$ = this.commonFilterSubject.asObservable();

  private selectedDateSubject = new BehaviorSubject<string>("month");
  selectedDateAction$ = this.selectedDateSubject.asObservable();

  constructor() { }


  minimizeSidebar(minimize: boolean) {
    this.minimizeSidebarSubject.next(minimize);
  }
  searchFilter(filterObj){
    this.commonFilterSubject.next(filterObj);
  }

  selectDate(selectedDate){
    this.selectedDateSubject.next(selectedDate)
  }
}
