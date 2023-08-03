/* eslint-disable no-underscore-dangle */
import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieChartComponent implements OnInit, OnChanges {
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

  @Input() width;
  @Input() height;

  chartOptions: any = {
    title: {
      text: ''
    },
    grid: {
      left: '5%',
      right: '3%',
      bottom: '7%',
      containLabel: true
    },
    legend: {
      show: false,
      type: 'scroll',
      orient: 'horizontal',
      bottom: 0,
      textStyle: {
        overflow: 'truncate',
        width: 120,
        ellipsis: '...'
      },
      data: []
    },
    tooltip: {
      trigger: 'item'
    },
    series: {
      type: 'pie',
      radius: '65%',
      center: ['50%', '50%'],
      selectedMode: 'single',
      selectedOffset: 20,
      label: {
        show: false,
        formatter: '{d}%'
      },
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
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

  ngOnInit(): void {}

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
      this.countField = countFields.find((countField) => countField.visible);
      this.datasetField = datasetFields.find(
        (datasetField) => datasetField.visible
      );
      this.chartOptions.title.text = this.chartTitle;
      this.preparedChartData = this.prepareChartData();
      newOptions.series.data = this.preparedChartData.data;
      newOptions.legend.data = this.preparedChartData.labels;
      this.chartOptions = newOptions;
    }
  };

  prepareChartData = () => {
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

  ngOnChanges() {
    let newOption: EChartsOption = {
      ...this.chartOptions
    };
    if (this.width / this.height < 2) {
      newOption = {
        ...newOption,
        legend: {
          bottom: 'bottom',
          type: 'scroll'
        }
      };
    }

    if (this.width / this.height >= 2) {
      newOption = {
        ...newOption,
        legend: {
          orient: 'vertical',
          left: 20,
          type: 'scroll',
          top: 40,
          textStyle: {
            overflow: 'truncate',
            width: 100
          }
        }
      };
    }

    this.chartOptions = newOption;
  }
}
