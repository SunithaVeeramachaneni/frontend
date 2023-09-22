/* eslint-disable no-underscore-dangle */
import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  SimpleChanges
} from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DonutChartComponent implements OnInit, OnChanges {
  @Input() hasCustomColorScheme;
  @Output() chartClickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() set chartConfig(chartConfig) {
    this.chartConfigurations = chartConfig;
    if (this.hasCustomColorScheme && chartConfig.customColors) {
      this.colorsByStatus = chartConfig.customColors;
    }

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

  colorsByStatus: any = {};
  chartOptions: any = {
    title: {
      text: ''
    },
    grid: {
      left: '5%',
      right: '3%',
      bottom: '10%',
      containLabel: true
    },
    legend: {
      show: false,
      type: 'scroll',
      orient: 'horizontal',
      bottom: 'bottom',
      data: []
    },
    tooltip: {
      trigger: 'item'
    },
    series: {
      type: 'pie',
      radius: ['45%', '60%'],
      center: ['50%', '50%'],
      selectedMode: 'single',
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
  showTotalCount = true;
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
        type = 'pie',
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
      if (
        newOptions.series &&
        newOptions.series.label &&
        newOptions.series.label
      ) {
        newOptions.series.label.show = showValues;
      }
      newOptions.legend.show = showLegends;
      //this.chartOptions.indexAxis = indexAxis;
      this.countField = countFields.find((countField) => countField.visible);
      this.datasetField = datasetFields.find(
        (datasetField) => datasetField.visible
      );
      this.chartOptions.title.text = this.chartTitle;
      // this.chartOptions.plugins.datalabels.display = showValues
      //   ? 'auto'
      //   : false;
      //this.chartOptions.plugins.datalabels.align = 'end';
      this.preparedChartData = this.prepareChartData();
      newOptions.series.data = this.preparedChartData.data;
      newOptions.legend.data = this.preparedChartData.labels;
      if (this.showTotalCount) {
        if (!Array.isArray(newOptions.series)) {
          newOptions.series = [newOptions.series];
        } else {
          newOptions.series = [...newOptions.series];
        }
        newOptions.series.push({
          name: 'COUNT',
          type: 'pie',
          radius: [0, '35%'],
          label: {
            position: 'center'
          },
          data: [
            {
              value: this.preparedChartData.totalCount,
              name: `Total Count\n ${this.preparedChartData.totalCount}`
            }
          ]
        });
      }
      this.chartOptions = newOptions;
      this.chartOptions.series.forEach((series) => {
        series.itemStyle = {
          color: (param: any) =>
            this.colorsByStatus[param.name]
              ? this.colorsByStatus[param.name]
              : '#c8c8c8'
        };
      });
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

    let totalCount = 0;
    converted.forEach((c: any) => {
      totalCount = totalCount + c.value;
    });

    return {
      labels,
      data: converted,
      totalCount
    };
  };

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.firstChange && changes.chartConfig) {
      const currValue = changes.chartConfig.currentValue;
      if (currValue.customColors) {
        this.colorsByStatus = currValue.customColors;
      }
    }
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
    this.chartOptions.series.forEach((series) => {
      series.itemStyle = {
        color: (param: any) =>
          this.colorsByStatus[param.name]
            ? this.colorsByStatus[param.name]
            : '#c8c8c8'
      };
    });

    let legendData = [];
    this.chartOptions.series.forEach((s) => {
      if (s.name !== 'COUNT') {
        const seriesNames = s.data.map((d) => d.name);
        if (seriesNames && seriesNames.length) {
          legendData = legendData.concat(seriesNames);
        }
      }
    });

    this.chartOptions.legend.data = legendData;
  }
}
