import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private toastService: ToastService) {}

  /**
   * Will handle error by displaying toast message
   *
   * @param  {HttpErrorResponse} error
   * @param  boolean sse
   *
   * @returns void
   */
  handleError = (error: HttpErrorResponse, sse: boolean = false): void => {
    this.toastService.show({
      text: this.getErrorMessage(error, sse),
      type: 'warning'
    });
  };

  /**
   * returns error message from HttpErrorResponse
   *
   * @param  {HttpErrorResponse} error
   * @param  boolean sse
   *
   * @returns {string} error message
   */
  getErrorMessage = (
    error: HttpErrorResponse,
    sse: boolean = false
  ): string => {
    if (sse === true) {
      return error.message
        ? error.message
        : error.error?.message
        ? error.error.message
        : 'Server Side Error!';
    } else {
      if (error.status === 0 && error.statusText === 'Unknown Error') {
        return 'Unable to connect to server!';
      } else {
        return error.error?.message
          ? error.error.message
          : error.error?.error?.message
          ? error.error.error.message
          : error.message
          ? error.message
          : error.statusText;
      }
    }
  };
}
