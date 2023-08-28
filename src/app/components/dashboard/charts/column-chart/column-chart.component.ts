/* eslint-disable no-underscore-dangle */
import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  EventEmitter,
  Output
} from '@angular/core';
import { colorsByStatus } from 'src/app/app.constants';

@Component({
  selector: 'app-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnChartComponent implements OnInit {
  @Input() hasCustomColorScheme;
  @Output() chartClickEvent: EventEmitter<any> = new EventEmitter<any>();

  @Input() set chartConfig(chartConfig) {
    this.chartConfigurations = chartConfig;
    if (chartConfig.renderChart) {
      this.prepareChartDetails();
    }
  }
  get chartConfig() {
    return this.chartConfigurations;
  }
  @Input() set chartData(chartData) {
    this._chartData = chartData;
    this.prepareChartDetails();
  }
  get chartData() {
    return this._chartData;
  }

  chartOptions: any = {
    title: {
      text: ''
    },
    grid: {
      left: '5%',
      right: '3%',
      bottom: '15%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    toolbox: {
      show: true,
      itemSize: 13,
      iconStyle: {
        borderColor: '#000'
      },
      feature: {
        restore: {},
        saveAsImage: {}
      }
    },
    legend: {
      show: false,
      bottom: 0,
      textStyle: {
        overflow: 'truncate',
        width: 120,
        ellipsis: '...'
      }
    },
    xAxis: {
      type: 'value',
      name: '',
      nameLocation: 'middle',
      nameTextStyle: {
        lineHeight: 30
      },
      axisLine: {
        show: true
      },
      axisTick: {
        alignWithLabel: true
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'category',
      name: '',
      axisLine: {
        show: true
      },
      axisTick: {
        alignWithLabel: true
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        interval: 0,
        overflow: 'truncate',
        ellipsis: '...',
        width: 60
      },
      data: []
    },
    dataZoom: {
      show: true,
      type: 'inside',
      zoomOnMouseWheel: true,
      moveOnMouseMove: true,
      moveOnMouseWheel: false,
      preventDefaultMouseMove: true
    },
    series: {
      name: '',
      label: {
        show: false
      },
      data: [],
      type: 'bar'
    }
  };

  chartTitle: string;
  chartType: string;
  //chartPlugins = [ChartDataLabels];
  chartLegend: boolean;
  options: any;
  preparedChartData: any;
  datasetField: any;
  countField: any;
  private chartConfigurations: any;
  private _chartData: any;

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    if (this.hasCustomColorScheme) {
      this.chartOptions.series.itemStyle = {
        color: (param: any) => colorsByStatus[param.name]
      };
    }
  }

  onChartClickHandler(event) {
    this.chartClickEvent.emit(event);
  }

  prepareChartDetails = () => {
    if (this.chartData && this.chartConfig) {
      const {
        title,
        type = 'bar',
        isStacked = 'false',
        indexAxis = 'x',
        showLegends = false,
        showValues = false,
        datasetFields,
        countFields
      } = this.chartConfig;
      const newOptions = { ...this.chartOptions };
      this.chartTitle = title;
      this.chartType = type;
      newOptions.series.label.show = showValues;
      newOptions.legend.show = showLegends;
      newOptions.xAxis.name = this.chartConfig.countFieldName;
      newOptions.yAxis.name = this.chartConfig.datasetFieldName;
      newOptions.series.name = this.chartConfig.countFieldName;
      this.countField = countFields.find((countField) => countField.visible);
      this.datasetField = datasetFields.find(
        (datasetField) => datasetField.visible
      );
      this.prepareChartData();
      this.chartOptions = newOptions;
    }
  };

  prepareChartData = () => {
    const newOptions = { ...this.chartOptions };
    const reducedObject: { [key: string]: number } = this.chartData.reduce(
      (acc, data) => {
        acc[data[this.datasetField.name]] = acc[data[this.datasetField.name]]
          ? acc[data[this.datasetField.name]]
          : 0;
        acc[data[this.datasetField.name]] += data.count;
        return acc;
      },
      {}
    );

    const sortedObject = Object.keys(reducedObject)
      .sort()
      .reduce((acc, val) => {
        const value =
          this.datasetField.type === 'date'
            ? this.datePipe.transform(val, 'short')
            : val;
        acc[value] = +reducedObject[val].toFixed(2);
        return acc;
      }, {});

    newOptions.yAxis.data = Object.keys(sortedObject);
    newOptions.series.data = Object.values(sortedObject);
    this.chartOptions = newOptions;
  };
}
