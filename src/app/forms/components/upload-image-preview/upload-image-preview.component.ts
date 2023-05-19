import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TenantService } from 'src/app/components/tenant-management/services/tenant.service';

@Component({
  selector: 'app-upload-image-preview',
  templateUrl: './upload-image-preview.component.html',
  styleUrls: ['./upload-image-preview.component.scss']
})
export class UploadImagePreviewComponent implements OnInit {
  @Input() image;

  @Output() triggerPreviewDialog: EventEmitter<null> = new EventEmitter();
  @Output() imageIndexEmitter: EventEmitter<any> = new EventEmitter<any>();

  s3BaseUrl: string;
  constructor(private tenantService: TenantService) {}

  ngOnInit(): void {}

  imageURL() {
    const {
      s3Details: { bucket, region }
    } = this.tenantService.getTenantInfo();

    this.s3BaseUrl = `https://${bucket}.s3.${region}.amazonaws.com/`;

    const imageUrl = `${this.s3BaseUrl}${this.image.objectKey}`;

    return imageUrl;
  }

  triggerDelete() {
    this.imageIndexEmitter.emit({ index: this.image.index, type: 'image' });
  }

  triggerPreview() {
    this.triggerPreviewDialog.emit();
  }
}
