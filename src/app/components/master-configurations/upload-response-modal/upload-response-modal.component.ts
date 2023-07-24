import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { downloadFile } from 'src/app/shared/utils/fileUtils';
import { AssetsService } from '../assets/services/assets.service';
import { LocationService } from '../locations/services/location.service';
import { ResponseSetService } from '../response-set/services/response-set.service';
import { Observable } from 'rxjs';
import { SseService } from 'src/app/shared/services/sse.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-response-modal',
  templateUrl: './upload-response-modal.component.html',
  styleUrls: ['./upload-response-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadResponseModalComponent implements OnInit, AfterViewChecked {
  title = '';
  message = '';
  isSuccess = false;
  isFailure = false;
  isReviewed = false;
  successCount = 0;
  failedCount = 0;
  type = '';
  formType = '';
  failure: any = [];
  observable: Observable<any>;
  constructor(
    private readonly locationService: LocationService,
    private readonly assetsService: AssetsService,
    private readonly resposneSetService: ResponseSetService,
    private readonly sseService: SseService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialogRef: MatDialogRef<UploadResponseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData
  ) {}

  ngOnInit(): void {
    this.init();
    if (this.dialogData) {
      const formData = new FormData();
      this.isFailure = false;
      this.isSuccess = false;
      formData.append('file', this.dialogData?.file);
      const type = this.dialogData?.type;
      const formType = this.dialogData?.formType;
      this.title = 'In-Progress';
      this.type = type;
      this.formType = formType;
      this.message = `Adding ${type}`;
      this.successCount = 0;
      switch (type) {
        case 'assets':
          this.observable = this.assetsService.uploadExcel(formData);
          break;
        case 'locations':
          this.observable = this.locationService.uploadExcel(formData);
          break;
        case 'response-set':
          this.observable = this.resposneSetService.uploadExcel(formData);
          break;
        case 'forms':
          this.observable = new Observable((observer) => {
            const params: URLSearchParams = new URLSearchParams();
            params.set('formType', formType.toString());
            const eventSourceForms = this.sseService.getEventSourceWithPost(
              environment.rdfApiUrl,
              'forms/upload?' + params.toString(),
              formData
            );

            eventSourceForms.stream();
            eventSourceForms.onmessage = (event) => {
              const eventData = JSON.parse(event.data);
              const { successCount, failedCount, totalCount, failure } =
                eventData;

              observer.next({
                totalCount,
                failedCount,
                successCount,
                failure
              });

              if (successCount + failedCount === totalCount) {
                eventSourceForms.close();
              }
            };

            eventSourceForms.onerror = (event) => {
              observer.error(JSON.parse(event.data));
            };
          });
          break;
      }
      this.observable?.subscribe((result) => {
        if (Object.keys(result).length > 0) {
          this.isSuccess = true;
          this.title = 'All done!';
          this.message = `Adding all ${result?.totalCount} ${type}`;
          this.successCount = result?.successCount;
          this.failedCount = result?.failedCount;
          this.failure = result?.failure;
        } else {
          this.isFailure = true;
          this.title = 'Failure!';
          this.message = `Uploaded file is invalid`;
        }
      });
    } else {
      this.onClose();
    }
  }
  downloadExcel() {
    switch (this.type) {
      case 'assets':
        this.assetsService
          .downloadFailure({ rows: this.failure })
          .pipe(
            tap((data) => {
              downloadFile(data, 'Asset_Failure');
            })
          )
          .subscribe();
        break;
      case 'locations':
        this.locationService
          .downloadFailure({ rows: this.failure })
          .pipe(
            tap((data) => {
              downloadFile(data, 'Location_Failure');
            })
          )
          .subscribe();
        break;
      case 'response-set':
        this.resposneSetService
          .downloadFailure({ rows: this.failure })
          .pipe(
            tap((data) => {
              downloadFile(data, 'Response-Set_Failure');
            })
          )
          .subscribe();
        break;
    }
  }
  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  onClose(): void {
    this.dialogRef.close({ event: 'close', data: this.successCount > 0 });
  }

  onReview(): void {
    this.isReviewed = true;
  }

  private init(): void {
    this.title = '';
    this.message = '';
    this.isSuccess = false;
    this.isReviewed = false;
    this.successCount = 0;
    this.failedCount = 0;
    this.type = '';
  }
}
