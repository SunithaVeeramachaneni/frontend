/* eslint-disable no-underscore-dangle */
import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output
} from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent implements OnInit {
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
      type: 'category',
      axisLabel: {
        interval: 0,
        overflow: 'truncate',
        ellipsis: '...',
        width: 40,
        rotate: 50
      },
      axisLine: {
        show: true
      },
      axisTick: {
        alignWithLabel: true
      },
      splitLine: {
        show: false
      },
      name: '',
      nameLocation: 'middle',
      nameTextStyle: {
        lineHeight: 70
      },
      data: []
    },
    yAxis: {
      type: 'value',
      name: '',
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
      type: 'line'
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
  colors = ['#FF1800', '#CADC42', '#FF8941', '#49C178', '#9E9E9E'];
  private chartConfigurations: any;
  private _chartData: any;

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {}

  onChartClickHandler(event) {
    this.chartClickEvent.emit(event);
  }

  prepareChartDetails = () => {
    if (this.chartData && this.chartConfig) {
      const {
        title,
        type = 'line',
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
      this.chartConfig.datasetFields.filter((dataset) => {
        if (dataset.name === this.chartConfig.datasetFieldName) {
          newOptions.xAxis.name = dataset.displayName;
          newOptions.series.name = dataset.displayName;
        }
      });
      newOptions.yAxis.name = this.chartConfig.countFieldName;
      this.countField = countFields.find((countField) => countField.visible);
      this.datasetField = datasetFields.find(
        (datasetField) => datasetField.visible
      );
      this.chartOptions.title.text = this.chartTitle;
      this.preparedChartData = this.prepareChartData();
      newOptions.series.data = this.preparedChartData.data;
      newOptions.legend.data = this.preparedChartData.labels;
      if (!Array.isArray(newOptions.series)) {
        newOptions.series = [newOptions.series];
      } else {
        newOptions.series = [...newOptions.series];
      }
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

    newOptions.xAxis.data = Object.keys(sortedObject);

    const labels = Object.keys(sortedObject);
    const converted = Object.entries(sortedObject).map(([key, value]) => ({
      name: key,
      value
    }));

    return {
      labels,
      data: converted
    };
  };
}
