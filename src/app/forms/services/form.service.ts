/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ResponseTypeOpenState } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private sliderOpenStateSubject = new BehaviorSubject<boolean>(false);
  private multiChoiceOpenStateSubject =
    new BehaviorSubject<ResponseTypeOpenState>({
      isOpen: false,
      response: {}
    });
  private openResponseTypeSubject = new BehaviorSubject<boolean>(false);

  sliderOpenState$ = this.sliderOpenStateSubject.asObservable();
  multiChoiceOpenState$ = this.multiChoiceOpenStateSubject.asObservable();
  openResponseType$ = this.openResponseTypeSubject.asObservable();

  constructor() {}

  setsliderOpenState(open: boolean) {
    this.sliderOpenStateSubject.next(open);
  }

  setMultiChoiceOpenState(responseType: ResponseTypeOpenState) {
    this.multiChoiceOpenStateSubject.next(responseType);
  }

  setOpenResponseType(open: boolean) {
    this.openResponseTypeSubject.next(open);
  }
}
