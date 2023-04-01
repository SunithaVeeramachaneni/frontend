import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssetsService } from '../assets/services/assets.service';
import { LocationService } from '../locations/services/location.service';

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
      const observable = isAssets
        ? this.assetsService.uploadExcel(formData)
        : this.locationService.uploadExcel(formData);
      observable?.subscribe((result) => {
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
    this.locationService.exportAsExcelFile(this.failure, this.type === 'assets' ? "Assets" : "Location");
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
