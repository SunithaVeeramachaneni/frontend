import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { ResponseSetService } from 'src/app/components/master-configurations/response-set/services/response-set.service';
import { ColumnConfigurationService } from 'src/app/forms/services/column-configuration.service';
@Component({
  selector: 'app-import-questions-modal',
  templateUrl: './import-questions-modal.component.html',
  styleUrls: ['./import-questions-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportQuestionsModalComponent implements OnInit {
  selectedIndex = 0;
  constructor(
    public dialogRef: MatDialogRef<ImportQuestionsModalComponent>,
    private responseSetService: ResponseSetService,
    private columnConfigService: ColumnConfigurationService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.selectedIndex = this.data.tabIndex;
    this.fetchResponseSetByModuleName().subscribe();
  }
  fetchResponseSetByModuleName = () => {
    return this.responseSetService.fetchResponseSetByModuleName$().pipe(
      tap((data) => {
        this.columnConfigService.setSelectedColumnsFilterData(data);
        this.columnConfigService.setAllModuleFiltersAndColumns(data);
      })
    );
  };
}
