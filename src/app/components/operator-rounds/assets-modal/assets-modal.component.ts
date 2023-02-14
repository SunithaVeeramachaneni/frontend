import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-assets-modal',
  templateUrl: './assets-modal.component.html',
  styleUrls: ['./assets-modal.component.scss']
})
export class AssetsModalComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  
}
