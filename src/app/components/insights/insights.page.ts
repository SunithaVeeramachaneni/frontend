import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { ChartType } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip } from 'ng2-charts';

  import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexPlotOptions,ApexFill, ChartComponent
  } from "ng-apexcharts";
import { NONE_TYPE } from '@angular/compiler';

  export type ChartOptionsTwo = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
  };

  export type ChartOptionsOne = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    plotOptions: ApexPlotOptions;
    fill: ApexFill;
  };
@Component({
  selector: 'app-insights',
  templateUrl: './insights.page.html',
  styleUrls: ['./insights.page.scss'],
})
export class InsightsPage  {

  userImg = '/assets/images/User.svg';

  @ViewChild("chart") chart: ChartComponent;
  @ViewChild("chartone") chartone: ChartComponent;

  //public chartOptions: Partial<ChartOptions>;
  public chartOptionsOne: Partial<ChartOptionsOne>;
  public chartOptionsTwo: Partial<ChartOptionsTwo>;



    config:zingchart.graphset = {
        type: "venn",
        series: [
          { //Set 1
            values: [100],
            join: [5],
            "value-box":{
            }
          },
          { //Set 2
            values: [60],
            join: [5],
            "value-box":{
            }
          },
          { //Set 3
            values: [30],
            join: [5],
            //text:"e"
            "value-box":{
            }
          }
        ]
    }

  configone:zingchart.graphset = {
  type: "ring",
  title: {
    text: "$24k",
    "text-align": "left"
  },
  subtitle:{
    text: "Loss in Revenue",
    "text-align": "left"
  },
  plot: {
    //Use the "slice" attribute to adjust the size of the donut ring.
  },
  "legend": {
    "x": "5%",
    "y": "80%",
    "border-color": "none",
    "header": {
      visible: false,
      //"text": "",
      "font-family": "Georgia",
      "font-size": 12,
      "font-color": "#3333cc",
      "font-weight": "normal",

    },
},
  "series": [{
    "values": [20],
    text:"Nevada",
    "value-box":{
      visible:false
    }
  },
  {
    "values": [30],
    text: "Yanacocha",
    "value-box":{
      visible:false
    }
  },
  {
    "values": [10],
    text:"Merian",
    "value-box":{
      visible:false
    }
  },
  {
    "values": [40],
    text:"Others",
    "value-box":{
      visible:false
    }
  },
]
}



// configtwo:zingchart.graphset = {
//   type: 'gauge',
//   alpha: 1,
//   plot: {
//     "background-color": '#e53935',
//     "value-box":{
//       placement: 'center',
//       //default
//   }
//   },

//   plotarea: {
//     margin: '0 0 0 0'
//   },
//   scale: {
//     "size-factor": 1,

//   },
//   "scale-r": {
//     //aperture: 180,
//     // minValue: 300,
//     // maxValue: 850,
//     //step: 50,

//     tick: {
//       'line-color': "none",
//     },
//     values: '0:100:5',

//     center: {  //Pivot Point
//       size:5,
//       //visible: false
//     },
//     item: {
//       "font-size": 12,

//     },

//   },

//   tooltip: {
//     "border-radius": 5
//   },
//   series: [
//     {
//       values: [90],
//       text:"Target 90%"
//     }
//   ],

// }


   constructor(){
    //this.callPieChart();
    this.callRadarChart();
    //this.callDonutChart();

  }


//   callPieChart(){
//     this.chartOptions = {
//       series: [44, 55],
//       chart: {
//         width: 350,
//         type: "pie"
//       },
//       labels: ["New Cars", "Old Cars"],
//       responsive: [
//         {
//           breakpoint: 480,
//           options: {
//             chart: {
//               width: 200
//             },
//             legend: {
//               position: "bottom"
//             }
//           }
//         }
//       ]
//     };
//   }

  callRadarChart(){
    this.chartOptionsOne = {
      series: [76],
      chart: {
        type: "radialBar",
        offsetY: -20
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: "97%",
            margin: 5, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              opacity: 0.31,
              blur: 2
            }
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: -2,
              fontSize: "22px"
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91]
        }
      },
      labels: ["Average Results"]
    };
  }

  callDonutChart(){
    this.chartOptionsTwo = {
      series: [44, 55, 13, 43],
      chart: {
        type: "donut"
      },
      labels: ["Nevada", "California", "Merian", "Others"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
  }

