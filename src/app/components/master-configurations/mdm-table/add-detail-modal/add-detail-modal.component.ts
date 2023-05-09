import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-detail-modal',
  templateUrl: './add-detail-modal.component.html',
  styleUrls: ['./add-detail-modal.component.scss']
})
export class AddDetailsComponent implements OnInit {
  isLinear = false;
  constructor(private dialogRef: MatDialogRef<AddDetailsComponent>) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }
}
