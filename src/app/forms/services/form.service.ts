/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private sliderOpenStateSubject = new BehaviorSubject<boolean>(false);
  private multiChoiceOpenStateSubject = new BehaviorSubject<boolean>(false);
  private openResponseTypeSubject = new BehaviorSubject<boolean>(false);

  sliderOpenState$ = this.sliderOpenStateSubject.asObservable();
  multiChoiceOpenState$ = this.multiChoiceOpenStateSubject.asObservable();

  constructor() {}

  setsliderOpenState(open: boolean) {
    this.sliderOpenStateSubject.next(open);
  }

  setMultiChoiceOpenState(open: boolean) {
    this.multiChoiceOpenStateSubject.next(open);
  }
}
