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
    console.log(chartConfig);
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
      this.preparedChartData = this.prepareChartData();

      switch (type) {
        case 'bar':
        case 'line':
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
    const { backgroundColors, type = 'bar' } = this.chartConfig;
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
        acc[val] = reducedObject[val];
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
              backgroundColor: backgroundColors[0],
              borderColor: backgroundColors[0],
              hoverBackgroundColor: backgroundColors[0],
              hoverBorderColor: backgroundColors[0],
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
              backgroundColor: backgroundColors[0],
              borderColor: backgroundColors[0],
              pointBackgroundColor: backgroundColors[0],
              pointBorderColor: backgroundColors[0],
              pointHoverBackgroundColor: backgroundColors[0],
              pointHoverBorderColor: backgroundColors[0]
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
          const backgColors = this.getColors(
            labels,
            index,
            'rgb(248, 209, 72)'
          );
          const hoverBackgColors = this.getColors(
            labels,
            index,
            'rgb(255, 57, 0)'
          );
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

  getColors = (labels: string[], index: number, color: string) =>
    labels.map((label, labelIndex) => {
      if (labelIndex === index) {
        return 'rgb(47, 202, 81)';
      } else {
        return color;
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
