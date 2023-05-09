import { Component, OnInit } from '@angular/core';
import { AddDetailsComponent } from '../add-detail-modal/add-detail-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-detail-modal',
  templateUrl: './add-detail.component.html',
  styleUrls: ['./add-detail.component.scss']
})
export class AddDetailModalComponent implements OnInit {
  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    const dialogRef = this.dialog.open(AddDetailsComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/master-configuration']);
    });
  }
}
