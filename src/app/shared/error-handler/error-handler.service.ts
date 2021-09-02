import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ToastService } from '../toast';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private toastService: ToastService) { }

  /**
   * Will handle error by displaying toast message and returns specified response
   *
   * @param  {HttpErrorResponse} error
   * @param  {{}|[]|null=null} response
   *
   * @returns null | Observable<{} | []>
   */
   handleError = (error: HttpErrorResponse, response: {} | [] | null = null): Observable<{} | []> | null => {
    this.toastService.show({
      text: this.getErrorMessage(error),
      type: 'warning',
    });
    if (response !== null) {
      return of(response);
    }
    return null;
  }

  /**
   * returns error message from HttpErrorResponse
   *
   * @param  {HttpErrorResponse} error
   *
   * @returns {string} error message
   */
  getErrorMessage = (error: HttpErrorResponse): string => {
    if (error.status === 0 && error.statusText === 'Unknown Error') {
      return 'Unable to connect to server!';
    } else {
      return error.error?.message ? error.error.message : error.message ? error.message : error.statusText;
    }
  }

}
