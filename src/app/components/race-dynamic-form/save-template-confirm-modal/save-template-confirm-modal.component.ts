import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RaceDynamicFormService } from '../services/rdf.service';
import { formConfigurationStatus } from 'src/app/app.constants';

@Component({
  selector: 'app-save-template-confirm-modal',
  templateUrl: './save-template-confirm-modal.component.html',
  styleUrls: ['./save-template-confirm-modal.component.scss']
})
export class SaveTemplateConfirmModalComponent implements OnInit {
  @Input() templateData: any;
  @Input() templateName: string;
  @Input() templateId: string | null;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private rdfService: RaceDynamicFormService) {}

  ngOnInit(): void {}

  save() {
    // ensuring all references to existing formdata are cut
    this.templateData = JSON.parse(JSON.stringify(this.templateData));
    this.templateData.formMetadata.name = this.templateName;

    // for this flow, the form needs to always be marked as Ready/Published.
    this.templateData.formStatus = formConfigurationStatus.ready;

    // if publishedDate is specified but not lastPublishedBy, backend will infer from authInfo.
    this.templateData.formMetadata.publishedDate = new Date().toISOString();

    // we need to reset formUsageCount to 0 when we overwrite from forms
    this.templateData.formMetadata.formsUsageCount = 0;

    if (this.templateId) {
      this.rdfService
        .updateTemplate$(this.templateId, this.templateData.formMetadata)
        .subscribe(() => {
          this.rdfService
            .createAuthoredTemplateDetail$(this.templateId, this.templateData)
            .subscribe();
        });
    } else {
      this.rdfService
        .createTemplate$(this.templateData.formMetadata)
        .subscribe((res) => {
          this.rdfService
            .createAuthoredTemplateDetail$(res.id, this.templateData)
            .subscribe();
        });
    }
    this.closeModal.emit(true);
  }
}
