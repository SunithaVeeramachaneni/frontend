import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  Column,
  ConfigOptions
} from '@innovapptive.com/dynamictable/lib/interfaces';
import { EChartsOption, graphic } from 'echarts';
import { AppChartConfig } from 'src/app/interfaces';

@Component({
  selector: 'app-exception-graph-view',
  templateUrl: './exception-graph-view.component.html',
  styleUrls: ['./exception-graph-view.component.scss']
})
export class ExceptionGraphViewComponent implements OnInit {
  chartConfig: AppChartConfig;
  chartOptions: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value',
      position: 'right',
      min: 0,
      max: 120
    },
    series: [
      {
        data: [40, 70, 20, 55, 0, 70, 60],
        type: 'line',
        color: '#007AFF',
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(0, 122, 255, 0.27)'
            },
            {
              offset: 1,
              color: 'rgba(231, 235, 240, 0.50)'
            }
          ])
        },
        markLine: {
          data: [
            {
              yAxis: 100,
              name: 'Max',
              itemStyle: {
                color: '#5856D6'
              }
            },
            {
              yAxis: 50,
              name: 'Min',
              itemStyle: {
                color: '#4295E1'
              }
            }
          ],
          label: {
            show: false
          },
          symbol: ['none', 'none']
        },
        itemStyle: {
          color: function (params) {
            const index = params.dataIndex;
            const value = params.data;
            if (value == 0) {
              return 'black';
            }
            return '#007AFF';
          }
        },
        symbolSize: 6
      }
    ]
  };

  columns: Column[] = [
    {
      id: 'date',
      displayName: 'Date',
      type: 'string',
      controlType: 'string',
      order: 1,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {},
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'readings',
      displayName: 'Readings',
      type: 'string',
      controlType: 'string',
      order: 2,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {},
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: true,
      hasPostTextImage: false
    },
    {
      id: 'operator',
      displayName: 'Operator',
      type: 'string',
      controlType: 'string',
      order: 3,
      searchable: false,
      sortable: false,
      hideable: false,
      visible: true,
      movable: false,
      stickable: false,
      sticky: false,
      groupable: false,
      titleStyle: {},
      hasSubtitle: true,
      showMenuOptions: false,
      subtitleColumn: '',
      subtitleStyle: {},
      hasPreTextImage: true,
      hasPostTextImage: false
    }
  ];
  configOptions: ConfigOptions = {
    tableID: 'exceptionsViewTable',
    rowsExpandable: false,
    enableRowsSelection: false,
    enablePagination: false,
    displayFilterPanel: false,
    displayActionsColumn: false,
    rowLevelActions: {
      menuActions: []
    },
    groupByColumns: [],
    pageSizeOptions: [10, 25, 50, 75, 100],
    allColumns: [],
    tableHeight: 'calc(48vh - 50px)',
    groupLevelColors: ['#e7ece8', '#c9e3e8', '#e8c9c957']
  };
  dataSource: MatTableDataSource<any>;

  constructor() {}

  ngOnInit() {
    const initalData = [
      {
        date: 'Jan 20, 2023 8:18 PM',
        readings: 'Skipped',
        operator: 'Kate Winslet'
      },
      {
        date: 'Jan 20, 2023 8:18 PM',
        readings: '118 Pa',
        operator: 'John William'
      },
      {
        date: 'Jan 20, 2023 8:18 PM',
        readings: '135 Pa',
        operator: 'Roger Moore'
      },
      {
        date: 'Jan 20, 2023 8:18 PM',
        readings: '123 Pa',
        operator: 'Alexndar Winslet'
      }
    ];
    this.configOptions.allColumns = this.columns;
    this.dataSource = new MatTableDataSource(initalData);
  }

  createGradient(): CanvasGradient | undefined {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const gradient = context?.createLinearGradient(0, 0, 0, 400);
    gradient?.addColorStop(0, 'rgba(0, 122, 255, 0.27)');
    gradient?.addColorStop(1, 'rgba(231, 235, 240, 0.50)');
    return gradient;
  }
}
