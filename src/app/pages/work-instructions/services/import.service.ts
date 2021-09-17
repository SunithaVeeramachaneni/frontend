import { Observable } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { SseService } from '../../../shared/services/sse.service';
import { ImportFileEventData } from '../../../interfaces';

@Injectable({
  providedIn: 'root'
})

/*
 * Service to import files
 *
 */
export class ImportService {
  /**
   * Service constructor
   * @param zone to do some action outside the Angular zone
   * @param sseService inject the event source service
   */
  constructor(private zone: NgZone, private sseService: SseService) {}


  /**
   * Import file
   * @param url to make call
   * @param file to import
   * @return obervable that has the progress
   */
  public importFile(url: string, formData: FormData): Observable<ImportFileEventData> {
    return this.getServerSentEvent(url, formData);
  }

  /**
   * Get event source (SSE)
   */
  private getServerSentEvent(url: string, data: FormData): Observable<ImportFileEventData> {
    return new Observable((observer) => {
      const eventSource = this.sseService.getEventSourceWithPost(url, data);
      // Launch query
      eventSource.stream();
      // on answer from message listener
      eventSource.onmessage = (event) => {
        this.zone.run(() => {
          observer.next(JSON.parse(event.data));
        });
      };
      eventSource.onerror = (event) => {
        this.zone.run(() => {
          if (event.data) {
            observer.error(JSON.parse(event.data));
          }
        });
      };
    });
  }


  public closeConnection(): void {
    this.sseService.closeEventSource();
  }
}

