import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkInstructionHeaderComponent } from '../work-instruction-header/work-instruction-header.component';
import { WorkInstructionAuthoringComponent } from '../work-instruction-authoring/work-instruction-authoring.component';

@Component({
  selector: 'app-work-instruction-header-modal',
  templateUrl: './work-instruction-header-modal.component.html',
  styleUrls: ['./work-instruction-header-modal.component.scss']
})
export class WorkInstructionHeaderModalComponent implements OnInit {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private headerModalRef: MatDialogRef<WorkInstructionHeaderModalComponent>
  ) {}

  ngOnInit(): void {}
  back() {
    this.headerModalRef.close();
  }
  openAuthoring() {
    const authoringDialog = this.dialog.open(
      WorkInstructionAuthoringComponent,
      {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        panelClass: 'full-screen-modal',
        disableClose: true
      }
    );
  }
}
