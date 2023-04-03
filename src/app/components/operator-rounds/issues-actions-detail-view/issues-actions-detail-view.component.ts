import { ImagePreviewModalComponent } from '../image-preview-modal/image-preview-modal.component';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'app-issues-actions-detail-view',
  templateUrl: './issues-actions-detail-view.component.html',
  styleUrls: ['./issues-actions-detail-view.component.scss']
})
export class IssuesActionsDetailViewComponent implements OnInit {
  issuesActionsDetailViewForm: FormGroup;
  priority = ['High', 'Medium', 'Low'];
  status = ['Open', 'In-Progress'];
  assignList: string[] = ['John', 'John1', 'John2'];

  img: File;
  fileToUpload: any;

  imgPreviews: string[] = [];
  idx = 0;
  listData: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<IssuesActionsDetailViewComponent>,
    public dialogRef1: MatDialogRef<ImagePreviewModalComponent>,

    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    const modalData: any = this.data?.row;
    console.log(modalData, 'model');
    this.listData = this.data?.issueData
      ? this.data?.issueData
      : this.data?.actionData;
    this.getData(modalData);
  }

  getData(modalData) {
    this.issuesActionsDetailViewForm = this.fb.group({
      name: modalData?.Title || '',
      description: modalData?.Description || '',
      category: modalData?.Category || '',
      round: modalData?.Round || '',
      location: modalData?.Location || '',
      asset: modalData?.Asset || '',
      task: modalData?.taskDesciption || '',
      priority: modalData?.Priority || '',
      status: modalData?.Status || '',
      dueDate: modalData?.dueDate
        ? new Date(this.data['Due Date and Time'])
        : '',
      // assignedTo: modalData?.assignee || '',
      assignedTo: modalData?.assignee || '',

      raisedBy: modalData?.createdBy || ''
    });
  }

  onKey(event) {
    const value = event.target.value || '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  uploadAttachment(event) {
    this.img = event.target.files[0];
    const reader = new FileReader();
    // eslint-disable-next-line @typescript-eslint/no-shadow
    reader.onload = (event: any) => {
      this.fileToUpload = event?.target?.result;
    };
    reader?.readAsDataURL(this.img);
  }

  onClik(e) {
    this.imgPreviews = e.target.src;
  }

  openModal(row: any): void {
    this.dialog.open(IssuesActionsDetailViewComponent, {
      data: row,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal'
    });
  }

  next() {
    this.idx++;
    if (this.idx === this.listData?.length) {
      this.idx = 0;
      this.getData(this.listData[this.idx]);
    } else {
      this.getData(this.listData[this.idx]);
    }
  }

  back() {
    this.idx--;
    if (this.idx === -1) {
      this.idx = this.listData?.length - 1;
      this.getData(this.listData[this.idx]);
    } else {
      this.getData(this.listData[this.idx]);
    }
  }
  openImagePreviewModal() {
    this.dialog.open(ImagePreviewModalComponent, {
      width: '75%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '75%'
    });
  }
}
