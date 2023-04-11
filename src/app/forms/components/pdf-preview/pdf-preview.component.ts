/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDFPreviewComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PDFPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {}

  printPDF(selectedForm) {
    const id = selectedForm;
    const roundPlanId = selectedForm.id;
    const roundId = selectedForm.roundId;

    fetch(`http://localhost:8007/rounds/${roundPlanId}/${roundId}`, {
      method: 'get',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Accept: 'application/json',
        responseType: 'arraybuffer'
      }
    })
      .then((res) => res.blob())
      .then((res) => {
        const aElement = document.createElement('a');
        const fileName =
          selectedForm.name && selectedForm.name?.length
            ? selectedForm.name
            : 'untitled';
        aElement.setAttribute('download', `${fileName}.pdf`);
        const href = URL.createObjectURL(res);
        aElement.href = href;
        aElement.setAttribute('target', '_blank');
        aElement.click();
        URL.revokeObjectURL(href);
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
