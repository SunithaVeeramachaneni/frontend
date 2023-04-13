import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UsersService } from '../services/users.service';
import { downloadFile } from 'src/app/shared/utils/fileUtils';
import { tap } from 'rxjs/internal/operators/tap';

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
  failure: any = [];
  isFailure = false;
  constructor(
    private readonly userService: UsersService,
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
      this.title = 'In-Progress';
      this.type = type;
      this.message = `Adding users`;
      const observable = this.userService.uploadExcel(formData);
      observable?.subscribe((result) => {
        if (Object.keys(result).length > 0) {
          this.isSuccess = true;
          this.title = 'All done!';
          this.message = `Adding all ${result?.totalCount} User`;
          this.successCount = result?.successCount;
          this.failedCount = result?.failedCount;
          this.failure = result.failure;
        } else {
          this.isFailure = true;
          this.title = 'Alert';
          this.message = `The file uploaded is not as per the template format`;
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
    this.dialogRef.close({ event: 'close', data: this.successCount > 0 });
  }

  onReview(): void {
    this.isReviewed = true;
  }

  downloadExcel(): void {
    this.userService
      .downloadFailure({ rows: this.failure })
      .pipe(
        tap((data) => {
          downloadFile(data, 'User_Upload_Data');
        })
      )
      .subscribe();
  }

  downloadTemplate(): void {
    this.userService
      .downloadSampleUserTemplate()
      .pipe(
        tap((data) => {
          downloadFile(data, 'User_Sample_Template');
        })
      )
      .subscribe();
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
