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
  isReviewed = false;
  successCount = 0;
  failedCount = 0;
  type = '';
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
      formData.append('file', this.dialogData?.file);
      const type = this.dialogData?.type;
      const isAssets = type === 'assets';
      this.title = 'In-Progress';
      this.type = type;
      this.message = `Adding ${type}`;
      const observable = isAssets
        ? this.assetsService.uploadExcel(formData)
        : this.locationService.uploadExcel(formData);
      observable?.subscribe((result) => {
        if (result) {
          this.isSuccess = true;
          this.title = 'All done!';
          this.message = `Adding all ${result?.totalCount} ${type}`;
          this.successCount = result?.successCount;
          this.failedCount = result?.failedCount;
        }
      });
    } else {
      this.onClose();
    }
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  onClose(): void {
    this.dialogRef.close('close');
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
