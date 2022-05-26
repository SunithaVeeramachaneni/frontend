/* eslint-disable no-underscore-dangle */
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EmitterService } from '../../EmitterService';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let JitsiMeetExternalAPI: any;
export interface DialogData {
  conversation: any;
}

@Component({
  selector: 'app-video-call-dialog',
  templateUrl: './video-call-dialog.component.html',
  styleUrls: ['./video-call-dialog.component.scss']
})
export class VideoCallDialogComponent implements OnInit {
  attachment: any;

  constructor(
    public dialogRef: MatDialogRef<VideoCallDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private emitterService: EmitterService
  ) {}

  ngOnInit() {
    const api = new JitsiMeetExternalAPI('8x8.vc', {
      roomName:
        'vpaas-magic-cookie-e8280671868542458c5c3357eaf72ade/SampleAppTimelyBlowsEnactReasonably',
      parentNode: document.querySelector('#jaas-container')
    });
    this.emitterService.chatMessageAdded.emit({
      meetingLink: api._url,
      data: this.data
    });
  }

  closeUploadDialog(): void {
    this.dialogRef.close();
  }
}
