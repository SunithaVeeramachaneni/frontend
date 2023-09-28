import { Injectable, OnInit } from '@angular/core';
import { Column } from '@innovapptive.com/dynamictable/lib/interfaces';
import { BehaviorSubject } from 'rxjs';
import { additionalDetailColumnConfig } from 'src/app/app.constants';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import { columnConfiguration } from 'src/app/interfaces/columnConfiguration';

@Injectable({
  providedIn: 'root'
})
export class ColumnConfigurationService {
  moduleColumnConfiguration$ = new BehaviorSubject<Column[] | null>(null);
  constructor(private rdfService: RaceDynamicFormService) {}

  getColumnIdFromName(columnName: string): string {
    return columnName.toLowerCase().replace(/ /g, '_');
  }
  getColumnConfigFromAdditionalDetails(
    additionalDetail: any
  ): columnConfiguration {
    return {
      columnId: this.getColumnIdFromName(additionalDetail?.name),
      columnName: additionalDetail?.name,
      disabled: false,
      selected: false,
      draggable: true,
      default: false
    };
  }
  getDynamicColumnsFromColumnConfig(
    moduleDefaultColumnConfig,
    selectedColumnConfig
  ): Column[] {
    const dynamicTableColumns = [];
    selectedColumnConfig.forEach((column) => {
      if (column.default) {
        dynamicTableColumns.push(
          moduleDefaultColumnConfig.find(
            (defaultColumn) => defaultColumn.id === column.columnId
          )
        );
      } else {
        dynamicTableColumns.push({
          ...additionalDetailColumnConfig,
          id: column.columnId,
          displayName: column.columnName
        });
      }
    });
    return this.rdfService.updateConfigOptionsFromColumns(dynamicTableColumns);
  }
}
