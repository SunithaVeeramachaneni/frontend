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
  constructor(
    private readonly locationService: LocationService,
    private readonly assetsService: AssetsService,
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
      const isAssets = type === 'assets';
      this.title = 'In-Progress';
      this.type = type;
      this.message = `Adding ${type}`;
      this.successCount = 0;
      const info: ErrorInfo = {
        displayToast: false,
        failureResponse: 'throwError'
      };
      const observable = isAssets
        ? this.assetsService.uploadExcel(formData, info)
        : this.locationService.uploadExcel(formData, info);
      observable?.subscribe(
        (result) => {
          if (Object.keys(result).length > 0) {
            this.isSuccess = true;
            this.title = 'All done!';
            this.message = `Adding all ${result?.totalCount} ${type}`;
            this.successCount = result?.successCount;
            this.failedCount = result?.failedCount;
            this.failure = result?.failure;
          }
        },
        (error) => {
          this.isFailure = true;
          this.title = 'Failure!';
          this.message = `Uploaded file is invalid`;
        }
      );
    } else {
      this.onClose();
    }
  }

  downloadExcel() {
    if (this.type === 'assets') {
      this.assetsService
        .downloadFailure({ rows: this.failure })
        .pipe(
          tap((data) => {
            downloadFile(data, 'Asset_Failure');
          })
        )
        .subscribe();
    } else {
      this.locationService
        .downloadFailure({ rows: this.failure })
        .pipe(
          tap((data) => {
            downloadFile(data, 'Location_Failure');
          })
        )
        .subscribe();
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
