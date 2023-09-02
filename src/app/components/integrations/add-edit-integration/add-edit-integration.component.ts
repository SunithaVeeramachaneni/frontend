import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Inject
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IntegrationsService } from '../services/integrations.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-integration',
  templateUrl: './add-edit-integration.component.html',
  styleUrls: ['./add-edit-integration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditIntegrationComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddEditIntegrationComponent>,
    private fb: FormBuilder,
    private cdrf: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private integrationsService: IntegrationsService
  ) {}

  ngOnInit(): void {}
}
