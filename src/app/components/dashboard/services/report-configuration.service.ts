/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from '../../../shared/services/app.services';
import {
  TableColumn,
  ErrorInfo,
  ReportDetails,
  ReportConfiguration,
  GroupByCounts,
  AppChartConfig,
  AppDatasetField,
  Count,
  ChartDetail,
  FilterApplied,
  FilterOptions,
  CountField
} from '../../../interfaces';
import { environment } from '../../../../environments/environment';
import {
  ConfigOptions,
  Column
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { defaultCountFieldName } from 'src/app/app.constants';
import { fieldTypesMock } from 'src/app/forms/components/response-type/response-types.mock';

@Injectable({
  providedIn: 'root'
})
export class ReportConfigurationService {
  constructor(private appService: AppService) {}

  getReportDetails$ = (
    urlString: string,
    id: string,
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<ReportDetails> =>
    this.appService._getRespById(
      environment.dashboardApiUrl,
      urlString,
      id,
      info,
      queryParams
    );

  getReportData$ = (
    report: ReportConfiguration,
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<ReportDetails> => {
    const { displayToast, failureResponse = [] } = info;
    return this.appService
      ._postData(
        environment.dashboardApiUrl,
        'reports/reportData',
        report,
        { displayToast, failureResponse },
        queryParams
      )
      .pipe(map((reportData) => ({ reportData } as ReportDetails)));
  };

  downloadReport$ = (
    reportDownloadUrlStr: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService.downloadFile(
      environment.dashboardApiUrl,
      reportDownloadUrlStr,
      info
    );

  downloadWidgetReport$ = (
    reportDownloadUrlStr: string,
    data: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> =>
    this.appService.downloadWithPost(
      environment.dashboardApiUrl,
      reportDownloadUrlStr,
      info,
      data,
      'arraybuffer'
    );

  getGroupByCountDetails$ = (
    report: ReportConfiguration,
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<GroupByCounts[]> => {
    const { displayToast, failureResponse = [] } = info;
    return this.appService._postData(
      environment.dashboardApiUrl,
      'reports/groupByCountDetails',
      report,
      { displayToast, failureResponse },
      queryParams
    );
  };

  saveReport$ = (
    report: ReportConfiguration,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<ReportConfiguration> =>
    this.appService._postData(
      environment.dashboardApiUrl,
      'reports',
      report,
      info
    );

  updateReport$ = (
    report: ReportConfiguration,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<ReportConfiguration> =>
    this.appService.patchData(
      environment.dashboardApiUrl,
      `reports/${report.id}`,
      report,
      info
    );

  getReportDataCountById$ = (
    urlString: string,
    id: string,
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Count> =>
    this.appService._getRespById(
      environment.dashboardApiUrl,
      urlString,
      id,
      info,
      queryParams
    );

  getReportDataCount$ = (
    report: ReportConfiguration,
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Count> =>
    this.appService._postData(
      environment.dashboardApiUrl,
      'reports/recordCountByReport',
      report,
      info,
      queryParams
    );

  getFilterOptions$ = (
    report: ReportConfiguration,
    queryParams: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<FilterOptions> => {
    const { displayToast, failureResponse = {} } = info;
    return this.appService._postData(
      environment.dashboardApiUrl,
      'reports/filterOptions',
      report,
      { displayToast, failureResponse },
      queryParams
    );
  };

  formatReportData = (reportData, userEmailToName) => {
    reportData = reportData.map((data) => {
      if (data.taskType === 'NF') {
        if (data?.exception > 0 || data?.exception === 'True') {
          data.exception = 'True';
        } else if (data?.exception === 0 || data?.exception === 'False') {
          data.exception = 'False';
        } else {
          data.exception = '';
        }
      }
      if(data.assignedTo) data.assignedToDisplay = userEmailToName[data.assignedTo];
      if(data.raisedBy) data.raisedByDisplay = userEmailToName[data.raisedBy];
      if(data.roundSubmittedBy) data.roundSubmittedByDisplay = userEmailToName[data.roundSubmittedBy];
      if(data.taskCompletedBy) data.taskCompletedByDisplay = userEmailToName[data.taskCompletedBy];
      data.taskType = fieldTypesMock.fieldTypes.find((fieldType) => {
        return (
          fieldType.type === data.taskType ||
          fieldType.description === data.taskType
        );
      })?.description;
    });
  };

  getId = (id) => {
    const ids = new Set(['assignedTo', 'raisedBy', 'roundSubmittedBy', 'taskCompletedBy']);
    if(ids.has(id)) return `${id}Display`;
    return id;
  }

  updateConfigOptionsFromReportConfiguration(
    reportConfiguration: ReportConfiguration,
    configOptions: ConfigOptions,
    isGroupable: boolean = true
  ): ConfigOptions {
    const { tableDetails = [], groupBy: groupByColumns = [] } =
      reportConfiguration;
    let tableColumns: TableColumn[] = [];
    tableDetails.forEach(
      (table) => (tableColumns = tableColumns.concat(table.columns))
    );

    const allColumns: Column[] = tableColumns.map((column) => {
      const { order, visible, sticky, displayName, name: id, type } = column;
      return {
        id: this.getId(id),
        displayName,
        type,
        controlType: 'string',
        order,
        hasSubtitle: false,
        showMenuOptions: true,
        subtitleColumn: '',
        searchable: true,
        sortable: true,
        hideable: true,
        visible,
        movable: true,
        stickable: true,
        sticky,
        groupable: isGroupable,
        titleStyle: {},
        subtitleStyle: {},
        hasPreTextImage: false,
        hasPostTextImage: false
      };
    });
    return { ...configOptions, allColumns, groupByColumns };
  }

  updateConfigOptionsFromFiltersApplied(
    filtersApplied: FilterApplied[],
    configOptions: ConfigOptions
  ): ConfigOptions {
    const allColumns: Column[] = configOptions.allColumns;
    const filtersAppliedObj = filtersApplied.reduce((acc, val) => {
      acc[val.column] = val;
      return acc;
    }, {});
    let index = 0;
    const nonFilteredAndFilteredVisibleColumns = allColumns
      .map((column) => {
        if (filtersAppliedObj[column.id] && column.visible) {
          index++;
          return { ...column, order: index };
        } else if (!filtersAppliedObj[column.id]) {
          index++;
          return { ...column, order: index };
        }
      })
      .filter((column) => column);

    // adding filtered non visible column to nonFilteredAndFilteredVisibleColumns
    allColumns.forEach((column) => {
      if (filtersAppliedObj[column.id] && !column.visible) {
        nonFilteredAndFilteredVisibleColumns.push({
          ...column,
          visible: true,
          order: nonFilteredAndFilteredVisibleColumns.length + 1
        });
      }
    });

    return {
      ...configOptions,
      allColumns: nonFilteredAndFilteredVisibleColumns
    };
  }

  updateChartConfig = (
    reportConfiguration: ReportConfiguration,
    chartConfig: AppChartConfig,
    setDatasetField: boolean,
    setCountFieldName: boolean,
    renderChart: boolean = true
  ): AppChartConfig => {
    const {
      groupBy = [],
      tableDetails = [],
      chartDetails = {} as ChartDetail
    } = reportConfiguration;
    const {
      datasetFieldName = '',
      countFieldName = '',
      stackFieldName = '',
      type
    } = chartDetails;
    let tableColumns: TableColumn[] = [];
    tableDetails.forEach(
      (table) => (tableColumns = tableColumns.concat(table.columns))
    );
    let newDatasetFields: AppDatasetField[] = [];
    let newDatasetFieldName: string;
    let newCountFields: CountField[] = [
      {
        name: defaultCountFieldName,
        displayName: defaultCountFieldName,
        visible: false
      }
    ];
    let newCountFieldName: string;

    for (const column of tableColumns) {
      const { visible, type, name, displayName } = column;
      if (visible && type === 'number') {
        newCountFields.push({
          name,
          displayName: `Sum of ${displayName}`,
          visible: false
        });
      }
    }

    newCountFields = newCountFields.map((countField) => {
      const { name } = countField;
      if (name === countFieldName) {
        newCountFieldName = name;
        return { ...countField, visible: true };
      }
      return countField;
    });

    if (setCountFieldName && !newCountFieldName) {
      newCountFields[0].visible = true;
      newCountFieldName = newCountFields[0].name;
    }
    if(type !== 'table') {
      for (const groupField of groupBy) {
        const column = tableColumns.find(
          (tableColumn) => tableColumn.name === groupField
        );
        newDatasetFields.push({
          name: groupField,
          displayName: column?.displayName,
          type: column?.type,
          visible: false
        });
      }
    }

    newDatasetFields = newDatasetFields.map((datasetField) => {
      const { name } = datasetField;
      if (name === datasetFieldName) {
        newDatasetFieldName = name;
        return { ...datasetField, visible: true };
      }
      return datasetField;
    });
    let newStackFieldName;
    if (setDatasetField && newDatasetFields.length && !newDatasetFieldName) {
      newDatasetFields[0].visible = true;
      newDatasetFieldName = newDatasetFields[0].name;
    }

    if (!stackFieldName && newDatasetFields.length > 1) {
      newStackFieldName = newDatasetFields[1].name;
    } else newStackFieldName = stackFieldName;

    return {
      ...chartConfig,
      ...chartDetails,
      datasetFields: newDatasetFields,
      datasetFieldName: newDatasetFieldName,
      stackFieldName: newStackFieldName,
      countFields: newCountFields,
      countFieldName: newCountFieldName,
      renderChart
    };
  };
}
