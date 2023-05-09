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
import { ErrorInfo } from 'src/app/interfaces';

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
  failure: any = [];
  observable: Observable<any>;
  constructor(
    private readonly locationService: LocationService,
    private readonly assetsService: AssetsService,
    private readonly resposneSetService: ResponseSetService,
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
      this.title = 'In-Progress';
      this.type = type;
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
