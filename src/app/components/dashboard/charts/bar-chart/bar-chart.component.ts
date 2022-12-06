import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent implements OnInit {
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
      show: true,
      bottom: 0
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        interval: 0,
        // rotate: 30,
        overflow: 'truncate',
        ellipsis: '...',
        width: 50
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
        lineHeight: 30
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
      this.chartTitle = title;
      this.chartType = type;
      this.chartLegend = showLegends;
      //this.chartOptions.indexAxis = indexAxis;
      this.chartOptions.xAxis.name = this.chartConfig.datasetFieldName;
      this.chartOptions.yAxis.name = this.chartConfig.countFieldName;
      this.chartOptions.series.name = this.chartConfig.datasetFieldName;
      this.countField = countFields.find((countField) => countField.visible);
      this.datasetField = datasetFields.find(
        (datasetField) => datasetField.visible
      );
      this.chartOptions.title.text = this.chartTitle;
      this.prepareChartData();
      // this.chartOptions.plugins.datalabels.display = showValues
      //   ? 'auto'
      //   : false;
      //this.chartOptions.plugins.datalabels.align = 'end';
      //this.preparedChartData = this.prepareChartData();
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
    newOptions.series.data = Object.values(sortedObject);
    this.chartOptions = newOptions;
  };
}
