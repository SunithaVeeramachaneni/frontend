/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-underscore-dangle */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { pieColors, wrenchTimeName } from 'src/app/app.constants';
import {
  AppChartConfig,
  AppChartData,
  AppDatasetField,
  CountField
} from 'src/app/interfaces';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent {
  @Input() set chartConfig(chartConfig: AppChartConfig) {
    this._chartConfig = chartConfig;
    if (chartConfig.renderChart) {
      this.prepareChartDetails();
    }
  }
  get chartConfig(): AppChartConfig {
    return this._chartConfig;
  }
  @Input() set chartData(chartData: AppChartData[]) {
    this._chartData = chartData;
    this.prepareChartDetails();
  }
  get chartData(): AppChartData[] {
    return this._chartData;
  }

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 50,
        top: 10,
        bottom: 10
      }
    },
    scales: {
      x: {
        title: {
          display: true
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'right'
      },
      title: {
        display: true,
        text: ''
      },
      tooltip: {
        enabled: true,
        footerAlign: 'right',
        callbacks: {
          label: (context) => {
            const count = +context.dataset.data[context.dataIndex];
            return `${this.countField.displayName}: ${+count.toFixed(2)}`;
          },
          beforeTitle: (context) => context[0].dataset.label,
          title: (context) => context[0].label,
          footer: (context) => {
            const numArr = context[0].dataset.data.map((val) => +val);
            const total = +numArr.reduce((acc, val) => acc + val, 0).toFixed(2);
            const count = +context[0].dataset.data[context[0].dataIndex];
            return `(${+((count / total) * 100).toFixed(2)}% of ${total})`;
          }
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        display: 'auto',
        formatter: (value, context) => {
          if (
            context.chart.config.type === 'doughnut' ||
            context.chart.config.type === 'pie'
          ) {
            const numArr = context.chart.data.datasets[0].data.map(
              (val) => +val
            );
            const total = +numArr.reduce((acc, val) => acc + val, 0).toFixed(2);
            const count =
              +context.chart.data.datasets[0].data[context.dataIndex];
            return `${+((count / total) * 100).toFixed(2)}%`;
          }
        }
      }
    }
  };
  chartTitle: string;
  chartType: ChartType;
  chartPlugins = [ChartDataLabels];
  chartLegend: boolean;
  preparedChartData: ChartData<ChartType>;
  datasetField: AppDatasetField;
  countField: CountField;
  private _chartConfig: AppChartConfig;
  private _chartData: AppChartData[];

  constructor() {}

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
      this.chartOptions.indexAxis = indexAxis;
      this.countField = countFields.find((countField) => countField.visible);
      this.datasetField = datasetFields.find(
        (datasetField) => datasetField.visible
      );
      this.chartOptions.plugins.title.text = this.chartTitle;
      this.chartOptions.plugins.datalabels.display = showValues
        ? 'auto'
        : false;
      this.chartOptions.plugins.datalabels.align = 'end';
      this.preparedChartData = this.prepareChartData();

      switch (type) {
        case 'bar':
        case 'line':
          if (isStacked) {
            this.chartOptions.scales['x']['stacked'] = true;
            this.chartOptions.scales['y']['stacked'] = true;
          }
          this.chartOptions.scales['x'].display = true;
          this.chartOptions.scales['y'].display = true;
          if (indexAxis === 'x') {
            this.chartOptions.scales['x']['title']['text'] =
              this.datasetField.displayName;
            this.chartOptions.scales['y']['title']['text'] =
              this.countField.displayName;
          } else {
            this.chartOptions.scales['x']['title']['text'] =
              this.countField.displayName;
            this.chartOptions.scales['y']['title']['text'] =
              this.datasetField.displayName;
          }

          if (type === 'line') {
            this.chartOptions.plugins.datalabels.align = 'right';
          }

          break;

        case 'pie':
        case 'doughnut':
          this.chartOptions.scales['x'].display = false;
          this.chartOptions.scales['y'].display = false;
          break;

        default:
        // do nothing;
      }
    }
  };

  prepareChartData = (): ChartData<ChartType> => {
    const { type = 'bar', isStacked } = this.chartConfig;
    if (isStacked) {
      const datasetObject = {};
      const distinct = [];
      const unique = [];

      const stackFieldName = this.chartConfig.stackFieldName;
      this.chartData.forEach((data) => {
        if (!unique[data[this.datasetField.name]]) {
          distinct.push(data[this.datasetField.name]);
          unique[data[this.datasetField.name]] = 1;
        }
      });
      const datasetFieldMap = {};
      let i = 0;
      distinct
        .sort()
        .forEach((datasetField) => (datasetFieldMap[datasetField] = i++));

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

      const colors = this.getRandomColors(Object.keys(datasetObject));
      const datasets = Object.keys(datasetObject).map((stackName, index) => {
        const dataset = {
          label: stackName,
          data: datasetObject[stackName].countArray,
          backgroundColor: colors[index],
          borderColor: colors[index],
          hoverBackgroundColor: colors[index],
          hoverBorderColor: colors[index],
          barPercentage: 1
        };
        return dataset;
      });

      return {
        labels: distinct,
        datasets
      };
    }
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
        acc[val] = +reducedObject[val].toFixed(2);
        return acc;
      }, {});

    switch (type) {
      case 'bar':
        return {
          labels: Object.keys(sortedObject),
          datasets: [
            {
              data: Object.values(sortedObject),
              label: this.datasetField.displayName,
              backgroundColor: '#4C5CB4',
              borderColor: '#4C5CB4',
              hoverBackgroundColor: '#4C5CB4',
              hoverBorderColor: '#4C5CB4',
              barPercentage: 1
            }
          ]
        };

      case 'line':
        return {
          labels: Object.keys(sortedObject),
          datasets: [
            {
              data: Object.values(sortedObject),
              label: this.datasetField.displayName,
              backgroundColor: '#4C5CB4',
              borderColor: '#4C5CB4',
              pointBackgroundColor: '#4C5CB4',
              pointBorderColor: '#4C5CB4',
              pointHoverBackgroundColor: '#4C5CB4',
              pointHoverBorderColor: '#4C5CB4'
            }
          ]
        };

      case 'pie':
      case 'doughnut':
        const labels = Object.keys(sortedObject);
        const index = labels.findIndex(
          (value) => value.toLowerCase() === wrenchTimeName.toLowerCase()
        );
        if (index !== -1) {
          const colors = this.getRandomColors(labels);
          const backgColors = this.getColors(labels, index, colors);
          const hoverBackgColors = this.getColors(labels, index, colors);

          return {
            labels,
            datasets: [
              {
                data: Object.values(sortedObject),
                label: this.datasetField.displayName,
                backgroundColor: backgColors,
                hoverBackgroundColor: hoverBackgColors,
                hoverBorderColor: hoverBackgColors,
                hoverOffset: 4
              }
            ]
          };
        } else {
          const colors = this.getRandomColors(labels);
          return {
            labels,
            datasets: [
              {
                data: Object.values(sortedObject),
                label: this.datasetField.displayName,
                backgroundColor: colors,
                hoverBackgroundColor: colors,
                hoverBorderColor: colors,
                hoverOffset: 4
              }
            ]
          };
        }

      default:
      // do nothing
    }
  };

  getColors = (labels: string[], index: number, color: string[]) =>
    labels.map((label, labelIndex) => {
      if (labelIndex === index) {
        return 'rgb(47, 202, 81)';
      } else {
        return color[labelIndex];
      }
    });

  getRandomColors = (labels: string[]) => {
    let colorIndex = 0;
    return labels.map(() => {
      if (colorIndex > pieColors.length - 1) {
        colorIndex = 0;
      }
      const color = pieColors[colorIndex];
      colorIndex++;
      return color;
    });
  };
}
