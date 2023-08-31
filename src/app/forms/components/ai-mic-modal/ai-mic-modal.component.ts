import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output
} from '@angular/core';
import * as annyang from 'annyang';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-ai-mic-modal',
  templateUrl: './ai-mic-modal.component.html',
  styleUrls: ['./ai-mic-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AiMicModalComponent implements OnInit {
  @Output() promptString = new EventEmitter<string>();
  transcript = '';
  inactivityTimeout: any;
  inactivityDuration = 2000;
  listeningBoolean = true;
  constructor(
    private dialogRef: MatDialogRef<AiMicModalComponent>,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.startListening();
  }
  startListening() {
    this.transcript = '';
    if (annyang) {
      annyang.start();
      const commands = {
        '*text': (text: string) => {
          this.transcript += ' ' + text;
          this.submitData();
          this.cdrf.detectChanges();
          this.resetInactivityTimeout();
        }
      };
      annyang.addCommands(commands);
    }
  }
  submitData() {
    this.dialogRef.close(this.transcript);
  }
  toggleListening() {
    if (!this.listeningBoolean) {
      this.startListening();
    } else {
      this.stopListening();
    }
    this.listeningBoolean = !this.listeningBoolean;
  }
  resetInactivityTimeout() {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.stopListening();
      this.cdrf.detectChanges();
      if (this.transcript.trim() !== '') {
        this.submitData();
      }
      this.listeningBoolean = false;
    }, this.inactivityDuration);
  }
  stopListening() {
    if (annyang) {
      annyang.abort();
    }
  }
  ngOnDestroy() {
    this.transcript = '';
    if (annyang) {
      annyang.abort();
    }
  }
}
