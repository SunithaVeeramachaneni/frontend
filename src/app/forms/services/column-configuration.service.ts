import { Injectable, OnInit } from '@angular/core';
import { Column } from '@innovapptive.com/dynamictable/lib/interfaces';
import { BehaviorSubject } from 'rxjs';
import {
  additionalDetailColumnConfig,
  metadataFlatModuleNames
} from 'src/app/app.constants';
import { LoginService } from 'src/app/components/login/services/login.service';
import {
  RDF_DEFAULT_COLUMNS,
  RDF_DEFAULT_COLUMN_CONFIG,
  RDF_TEMPLATE_DEFAULT_COLUMNS,
  RDF_TEMPLATE_DEFAULT_COLUMN_CONFIG
} from 'src/app/components/race-dynamic-form/race-dynamic-forms.constants';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import { columnConfiguration } from 'src/app/interfaces/columnConfiguration';

@Injectable({
  providedIn: 'root'
})
export class ColumnConfigurationService {
  allColumnConfigurations: columnConfiguration[] = [];
  selectedColumnConfigurations: columnConfiguration[] = [];
  isLoadingColumns$ = new BehaviorSubject<boolean>(true);
  private userColumnConfiguration: any;
  moduleColumnConfiguration$ = new BehaviorSubject<Column[] | null>(null);
  constructor(private rdfService: RaceDynamicFormService) {}

  getColumnIdFromName(columnName: string): string {
    return columnName.toLowerCase().replace(/ /g, '_');
  }
  getAllColumnConfigurations() {
    return this.allColumnConfigurations;
  }
  getModuleDefaultDynamicTableConfig(moduleName: string): Partial<Column>[] {
    switch (moduleName) {
      case metadataFlatModuleNames.RACE_DYNAMIC_FORMS:
        return RDF_DEFAULT_COLUMN_CONFIG;
      case metadataFlatModuleNames.RDF_TEMPLATES:
        return RDF_TEMPLATE_DEFAULT_COLUMN_CONFIG;
      default:
        return [];
    }
  }
  getModuleDefaultColumnConfig(moduleName: string): columnConfiguration[] {
    switch (moduleName) {
      case metadataFlatModuleNames.RACE_DYNAMIC_FORMS:
        return RDF_DEFAULT_COLUMNS;
      case metadataFlatModuleNames.RDF_TEMPLATES:
        return RDF_TEMPLATE_DEFAULT_COLUMNS;
      default:
        return [];
    }
  }
  getColumnConfigFromAdditionalDetails(
    additionalDetail: any,
    selected: boolean
  ): columnConfiguration {
    return {
      columnId: this.getColumnIdFromName(additionalDetail?.name),
      columnName: additionalDetail?.name,
      disabled: false,
      selected: selected,
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

  setUserColumnConfigurationOnInit(userColumnConfig) {
    this.userColumnConfiguration = userColumnConfig
      ? JSON.parse(userColumnConfig)
      : null;
  }
  setUserColumnConfigurationByModule(moduleName, columnIdArray) {
    if (!this.userColumnConfiguration) this.userColumnConfiguration = {};
    this.userColumnConfiguration[moduleName] = columnIdArray;
  }
  setAllColumnConfigurations(allColumnConfigurations) {
    this.allColumnConfigurations = allColumnConfigurations;
  }
  setUserColumnConfigByModuleName(moduleName: string) {
    if (
      !this.userColumnConfiguration ||
      !this.userColumnConfiguration[moduleName]
    ) {
      this.selectedColumnConfigurations =
        this.getModuleDefaultColumnConfig(moduleName);
    } else {
      this.selectedColumnConfigurations = [];
      this.userColumnConfiguration[moduleName].forEach((columnId) => {
        const column = this.allColumnConfigurations.find(
          (column) => column.columnId === columnId
        );
        if (column) this.selectedColumnConfigurations.push(column);
      });
    }
    const dynamicTableConfiguration =
      this.rdfService.updateConfigOptionsFromColumns(
        this.getDynamicColumnsFromColumnConfig(
          this.getModuleDefaultDynamicTableConfig(moduleName),
          this.selectedColumnConfigurations
        )
      );
    this.moduleColumnConfiguration$.next(dynamicTableConfiguration);
    this.isLoadingColumns$.next(false);
  }
}
