import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TenantService } from '../../tenant-management/services/tenant.service';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-submission-view',
  templateUrl: './submission-view.component.html',
  styleUrls: ['./submission-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubmissionViewComponent implements OnInit {
  submittedFormData;
  constructor(
    private tenantService: TenantService,
    private imageUtils: ImageUtils,
    private dialogRef: MatDialogRef<SubmissionViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.submittedFormData = JSON.parse(
      this.data.formSubmissionListFormSubmissionDetail.items[0].formData
    );
    const tenantInfo = this.tenantService.getTenantInfo();
    this.submittedFormData.FORMS[0].PAGES.forEach((page) => {
      page.SECTIONS.forEach((sec) => {
        sec.FIELDS.forEach((field) => {
          if (field && field.FIELDVALUE) {
            if (field.UIFIELDTYPE === 'ATT') {
              const image = `https://${tenantInfo.amplifyConfig.aws_user_files_s3_bucket}.s3.amazonaws.com/public/${field.FIELDVALUE}`;
              field.FIELDVALUE = image.slice(0, -1);
            }
            if (field.UIFIELDTYPE === 'RT') {
              field.DEFAULTVALUE = field.DEFAULTVALUE.split(',');
            }
            if (field.UIFIELDTYPE === 'SGF') {
              this.signatureImage(field.FIELDVALUE);
            }
            if (field.UIFIELDTYPE === 'DDM') {
              const value = field.FIELDVALUE.split(',');
              field.FIELDVALUE = value;
            }
            if (field.UIFIELDTYPE === 'GAL') {
              field.FIELDVALUE = JSON.parse(field?.FIELDVALUE);
            }
          }
        });
      });
    });
  }

  signatureImage(sigImage) {
    return this.imageUtils.getImageSrc(Buffer.from(sigImage).toString());
  }

  goToBack() {
    this.dialogRef.close();
  }
}
