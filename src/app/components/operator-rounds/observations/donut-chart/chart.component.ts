/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() set options(options) {
    this.chartConfigurations = options;
    if (options.renderChart) {
      this.prepareChartDetails();
    }
  }
  get options() {
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
    avoidLabelOverlap: true,
    label: {
      show: true,
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      formatter(param: any) {
        return param?.value;
      }
    },
    title: {
      text: '',
      subtext: '',
      left: 'center',
      top: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      itemWidth: 20,
      itemHeight: 20,
      top: '90%'
    },
    series: {
      name: '',
      type: 'pie',
      radius: [10, 40],
      color: [],
      data: [],
      labelLine: {
        show: true
      }
    }
  };

  private chartConfigurations: any;
  private _chartData: any;
  constructor() {}

  ngOnInit(): void {}

  prepareChartDetails = () => {
    if (this.chartData && this.options) {
      // const {} = this.options;
      const newOptions = { ...this.chartOptions };
      this.chartOptions = newOptions;
    }
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
