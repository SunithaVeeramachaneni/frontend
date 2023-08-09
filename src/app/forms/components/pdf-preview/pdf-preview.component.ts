/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import { ErrorInfo } from 'src/app/interfaces/error-info';
import { ToastService } from 'src/app/shared/toast';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDFPreviewComponent implements OnInit {
  selectedPDFSrc;
  selectedPDFBlob;
  downloadInProgress = true;

  constructor(
    private readonly toast: ToastService,
    public dialogRef: MatDialogRef<PDFPreviewComponent>,
    private readonly operatorRoundsService: OperatorRoundsService,
    private readonly rdfService: RaceDynamicFormService,
    @Inject(MAT_DIALOG_DATA) public data,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const selectedForm = this.data.selectedForm;
    const moduleName = this.data.moduleName;

    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };

    if (moduleName === 'RDF') {
      this.rdfService
        .downloadAttachment$(selectedForm.formId, selectedForm.id, info)
        .subscribe(
          (data) => {
            const blob = new Blob([data], { type: 'application/pdf' });
            this.selectedPDFBlob = blob;
            const fileReader = new FileReader();
            fileReader.onload = () => {
              this.selectedPDFSrc = new Uint8Array(
                fileReader.result as ArrayBuffer
              );
              this.downloadInProgress = false;
              this.cdrf.detectChanges();
            };
            fileReader.readAsArrayBuffer(blob);
            return;
          },
          (err) => {
            this.downloadInProgress = false;
            this.cdrf.detectChanges();
            this.toast.show({
              text: 'Error occured while generating PDF!',
              type: 'warning'
            });
          }
        );
    } else {
      this.operatorRoundsService
        .downloadAttachment$(selectedForm.roundPlanId, selectedForm.id, info)
        .subscribe(
          (data) => {
            const blob = new Blob([data], { type: 'application/pdf' });
            this.selectedPDFBlob = blob;
            const fileReader = new FileReader();
            fileReader.onload = () => {
              this.selectedPDFSrc = new Uint8Array(
                fileReader.result as ArrayBuffer
              );
              this.downloadInProgress = false;
              this.cdrf.detectChanges();
            };
            fileReader.readAsArrayBuffer(blob);
            return;
          },
          (err) => {
            this.downloadInProgress = false;
            this.cdrf.detectChanges();
            this.toast.show({
              text: 'Error occured while generating PDF!',
              type: 'warning'
            });
          }
        );
    }
  }

  downloadPdf() {
    if (this.selectedPDFBlob) {
      const selectedForm = this.data.selectedForm;
      const aElement = document.createElement('a');
      const fileName =
        selectedForm.name && selectedForm.name?.length
          ? selectedForm.name
          : 'untitled';
      aElement.setAttribute('download', `${fileName}.pdf`);
      const href = URL.createObjectURL(this.selectedPDFBlob);
      aElement.href = href;
      aElement.setAttribute('target', '_blank');
      aElement.click();
      URL.revokeObjectURL(href);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
