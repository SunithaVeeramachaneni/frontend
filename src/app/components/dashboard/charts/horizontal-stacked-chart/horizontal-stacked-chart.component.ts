import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-horizontal-stacked-chart',
  templateUrl: './horizontal-stacked-chart.component.html',
  styleUrls: ['./horizontal-stacked-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HorizontalStackedChartComponent implements OnInit {
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
      type: 'scroll',
      orient: 'horizontal',
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    dataZoom: {
      show: true,
      type: 'inside',
      zoomOnMouseWheel: true,
      moveOnMouseMove: true,
      moveOnMouseWheel: false,
      preventDefaultMouseMove: true
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
      axisLabel: {
        interval: 0,
        overflow: 'truncate',
        ellipsis: '...',
        width: 60
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
      data: []
    },
    series: []
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

  constructor(private datePipe: DatePipe, private cdrf: ChangeDetectorRef) {}

  ngOnInit(): void {}

  prepareChartDetails = () => {
    if (this.chartData && this.chartConfig) {
      const {
        title,
        type = 'bar',
        isStacked = 'true',
        indexAxis = 'x',
        showLegends = false,
        showValues = false,
        datasetFields,
        countFields
      } = this.chartConfig;
      this.chartTitle = title;
      this.chartType = type;
      this.chartLegend = showLegends;

      this.chartOptions.xAxis.name = this.chartConfig.countFieldName;
      this.chartOptions.yAxis.name = this.chartConfig.datasetFieldName;
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
    const datasetObject = {};
    const distinct = [];
    const unique = [];
    const newOptions = { ...this.chartOptions };

    const stackFieldName = this.chartConfig.stackFieldName;
    const stackField = this.chartConfig.datasetFields.find(
      (item) => item.name === stackFieldName
    );
    this.chartData.forEach((data) => {
      if (!unique[data[this.datasetField.name]]) {
        distinct.push(data[this.datasetField.name]);
        unique[data[this.datasetField.name]] = 1;
      }
    });
    const datasetFieldMap = {};
    let i = 0;
    const newDistinct = distinct.sort().map((datasetField) => {
      datasetFieldMap[datasetField] = i++;
      return datasetField !== 'null' && this.datasetField.type === 'date'
        ? this.datePipe.transform(datasetField, 'short')
        : datasetField;
    });

    //this.chartOptions.yAxis.data = newDistinct;
    newOptions.yAxis.data = newDistinct;
    this.chartData.forEach((data) => {
      if (!datasetObject[data[stackFieldName]]) {
        datasetObject[data[stackFieldName]] = {};
        datasetObject[data[stackFieldName]]['countArray'] = new Array(
          distinct.length
        ).fill(0);
      }

      datasetObject[data[stackFieldName]].countArray[
        datasetFieldMap[data[this.datasetField.name]]
      ] += data.count;
    });

    const datasets = Object.keys(datasetObject).map((stackName, index) => {
      const newLabel =
        stackName !== 'null' && stackField.type === 'date'
          ? this.datePipe.transform(stackName, 'short')
          : stackName;
      const dataset = {
        name: newLabel,
        type: 'bar',
        stack: 'total',
        label: {
          show: false
        },
        emphasis: {
          focus: 'series'
        },
        data: datasetObject[stackName].countArray
      };
      return dataset;
    });

    newOptions.series = datasets;
    this.chartOptions = newOptions;
    this.cdrf.markForCheck();
    console.log(this.chartOptions);
  };
}
