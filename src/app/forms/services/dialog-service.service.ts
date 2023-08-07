import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormModalComponent } from 'src/app/components/race-dynamic-form/form-modal/form-modal.component';

@Injectable({
  providedIn: 'root'
})
export class DialogServiceService {
  dialogRef$: any;
  isOpen: boolean;

  constructor(private dialog: MatDialog, private router: Router) {}

  openModal() {
    this.isOpen = true;
    this.dialogRef$ = this.dialog.open(FormModalComponent, {
      data: {
        formData: { isCreateAI: true }
      }
    });
  }

  closeModal() {
    this.dialogRef$.afterClosed().subscribe((result) => {
      if (result?.isCreateAI || result.data.isCreateAI) {
        this.router.navigate([`forms/edit/${result?.formId}`], {
          queryParams: { isCreateAI: true }
        });
      }
      this.isOpen = false;
    });
  }
}
