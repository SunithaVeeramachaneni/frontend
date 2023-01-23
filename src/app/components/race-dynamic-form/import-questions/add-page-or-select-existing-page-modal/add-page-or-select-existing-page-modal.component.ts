import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-page-or-select-existing-page-modal',
  templateUrl: './add-page-or-select-existing-page-modal.component.html',
  styleUrls: ['./add-page-or-select-existing-page-modal.component.scss']
})
export class AddPageOrSelectExistingPageModalComponent implements OnInit {
  selectedOption = 'new';
  selectedPage;
  constructor(
    public dialogRef: MatDialogRef<AddPageOrSelectExistingPageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.selectedPage =
      this.data.pages[0].name + ' ' + this.data.pages[0].position;
  }

  onChange(event) {
    this.selectedOption = event.target.value;
  }

  cancel() {
    this.dialogRef.close();
  }

  import() {
    this.dialogRef.close({
      selectedPage: this.selectedPage,
      selectedPageOption: this.selectedOption
    });
  }
}
