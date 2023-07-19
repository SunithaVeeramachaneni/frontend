import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RoundPlanFullScreenModalComponent } from './round-plan-full-screen-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-round-plan-view',
  template: ``,
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundPlanViewComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dialog.open(RoundPlanFullScreenModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal'
    });
  }
}
