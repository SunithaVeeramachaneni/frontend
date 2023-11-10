import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notes-shift-log-container',
  templateUrl: './notes-shift-log-container.component.html',
  styleUrls: ['./notes-shift-log-container.component.scss']
})
export class NotesShiftLogContainerComponent implements OnInit {
  @Input() shrAllDetails: any;
  @Input() selectedRow: any;
  showNotes = true;
  showLogs = true;
  shrId: string;
  notes: any;
  shiftLogs: any;
  constructor() {}

  ngOnInit(): void {
    const {
      shrList: { id },
      shrDetails: { notes, shiftLogs }
    } = this.shrAllDetails;
    this.shrId = id;
    this.notes = notes || [];
    this.shiftLogs = shiftLogs || [];
  }

  toggleNotes() {
    this.showNotes = !this.showNotes;
  }

  toggleLogs() {
    this.showLogs = !this.showLogs;
  }
}
