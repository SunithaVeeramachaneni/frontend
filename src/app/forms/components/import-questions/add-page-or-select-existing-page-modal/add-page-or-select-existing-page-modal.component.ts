import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isEqual } from 'lodash-es';
import { Page } from 'src/app/interfaces';

@Component({
  selector: 'app-add-page-or-select-existing-page-modal',
  templateUrl: './add-page-or-select-existing-page-modal.component.html',
  styleUrls: ['./add-page-or-select-existing-page-modal.component.scss']
})
export class AddPageOrSelectExistingPageModalComponent implements OnInit {
  selectedPageOption = 'new';
  pageOptions: string[] = ['new', 'existing'];
  selectedPage;
  selectedPageControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<AddPageOrSelectExistingPageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.selectedPageControl.setValue(this.data.pages[0]);
    setTimeout(() => {
      if (this.data?.formMetadata?.formType?.toLowerCase() === 'embedded') {
        this.dialogRef.close({
          selectedPage: this.selectedPageControl.value,
          selectedPageOption: 'existing'
        });
      }
    }, 0);
  }

  cancel() {
    this.dialogRef.close({});
  }

  import() {
    this.dialogRef.close({
      selectedPage: this.selectedPageControl.value,
      selectedPageOption: this.selectedPageOption
    });
  }

  compareFn(option1: Page, option2: Page) {
    return isEqual(option1, option2);
  }
}
