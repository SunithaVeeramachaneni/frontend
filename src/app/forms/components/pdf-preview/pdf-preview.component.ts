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
    const htmlContent = `<h1>PDF BUILDER HTML CONTENT!</h1>`;
    // ALL FIELDS ROUND PLAN -----
    const roundPlanId = '0c0e2092-22d5-447e-a539-a2a4daa25816';
    const roundId = 'd6a0c8e3-b4f9-4cd8-b99b-525184af5c74';
    // const roundPlanId = '91762fbc-78e5-4799-8443-0332801a72f3';
    // const roundId = '44586bba-42c1-4401-ae59-6961d911fca7';
    fetch(`http://localhost:8007/rounds/${roundPlanId}/${roundId}`, {
      method: 'post',
      body: JSON.stringify({ htmlContent }),
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
        aElement.setAttribute('download', 'output.pdf');
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
