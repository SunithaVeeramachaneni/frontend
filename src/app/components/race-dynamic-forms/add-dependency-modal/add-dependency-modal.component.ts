import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-dependency-modal',
  templateUrl: './add-dependency-modal.component.html',
  styleUrls: ['./add-dependency-modal.component.scss']
})
export class AddDependencyModalComponent implements OnInit {
  isChecked = false;
  globalDataset: any;
  selectedResponseType: string;
  selectedResponseTypes: string[];
  constructor(
    private dialogRef: MatDialogRef<AddDependencyModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: AddDependencyModalComponent
  ) {}

  ngOnInit(): void {
    const { globalDataset, selectedResponseType } = this.data;
    this.globalDataset = globalDataset;
    this.selectedResponseType = selectedResponseType;
    this.selectedResponseTypes = [this.selectedResponseType];
  }

  selectDependency(responseType: string) {
    return this.selectedResponseTypes.includes(responseType);
  }

  saveDependencies() {
    this.dialogRef.close('hehehee');
  }
}
