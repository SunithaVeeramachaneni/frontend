import {
  Component, OnInit, ViewChild, ElementRef,
  Inject, NgZone, PLATFORM_ID
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LoadingController, ModalController } from '@ionic/angular';
import { MyModalPageComponent } from '../my-modal-page/my-modal-page.component';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Instruction } from '../../interfaces/instruction';
import { ErrorInfo } from '../../interfaces/error-info';
import { combineLatest, Subscription } from 'rxjs';

import { Base64HelperService } from '../../shared/base64-helper.service';
import { InstructionService } from '../workinstructions/instruction.service';
import { ToastService } from 'src/app/shared/toast';
import { isPlatformBrowser } from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { MultiDataSet, Label, Color, BaseChartDirective} from 'ng2-charts';
import { castColor } from '@amcharts/amcharts4/core';



@Component({
  selector: 'app-usedcar-insights',
  templateUrl: './usedcar-insights.page.html',
  styleUrls: ['./usedcar-insights.page.css']
})


export class UsedcarInsightsComponent {

  public newCarsByModelAndYearBarData = {}
  public newCarsByMakeDonutData = {}


  public barChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      enabled: true,
      callbacks: {
        label: function (tooltipItem, data) {
          let label = data.labels[tooltipItem.index];
          let count = data
            .datasets[tooltipItem.datasetIndex]
            .data[tooltipItem.index];
          return "New Cars Count in " + label + ": " + count;
        },
      },
    },
    plugins: {
      datalabels: {
        color: "white"
      },
    },
  };



  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartLabels: Label[];
  public barChartData: ChartDataSets[] = [
    {
      data: [],
      label: "",
      backgroundColor: 'rgba(139,33,238,0.9)',
      borderColor: 'rgba(108,25,185,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(139,33,238,0.4)',
      hoverBorderColor: 'rgba(108,25,185,1)',
    }
  ];

  public doughnutChartLabels: Label[] = ['new cars', 'old cars'];

  public doughnutChartData: MultiDataSet = [
    [0, 0]
  ];
  public doughnutChartType: ChartType = 'doughnut';


  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }

  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }

  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';


  public stackChartOptions: ChartOptions = {
    responsive: true
  }
  public stackChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public stackChartType: ChartType = 'bar';
  public stackChartLegend = true;
  public stackChartPlugins = [];

  public stackChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A', stack: 'a' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B', stack: 'a' }
  ];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private http: HttpClient, private zone: NgZone) { }


  fetchNewCarsByModelAndYear = () => {

    let modelName = "Renegade";
    this.http.get<any>(`https://invamdemo-dbapi.innovapptive.com/getNewCarsByModelNameAndYear?model_name=${modelName}`)
      .subscribe(response => {
        console.log(response);

        let cars = response;
        console.log(cars);
        if (cars && cars.length > 0) {

          const newCarsCount = cars.map(model => {
            console.log(model)
            return model.newCarsCount
          })


          console.log(newCarsCount);

          const years = cars.map(model => {
            console.log(model)
            return model._id.year
          })

          console.log(years);
          let carStatusObject = {
            years: years,
            carsCount: newCarsCount,
            model_name: "Renegade",

          }
          console.log("carsbarchart", carStatusObject)
          this.newCarsByModelAndYearBarData = carStatusObject
          this.barChartLabels = carStatusObject.years;
          this.barChartData[0].label = carStatusObject.model_name
          this.barChartData[0].data = carStatusObject.carsCount

        }

      });

  }

  fetchNewCarsByMakeName = () => {
    let model = 'Range Rover Evoque';
    let makeName = "Kia"
    this.http.get<any>(`https://invamdemo-dbapi.innovapptive.com/getNewCarsByYear?make_name=${makeName}`)
      .subscribe(response => {
        console.log(response);
        let newCars = 0;
        let oldCars = 0;
        response.map(carMake => {
          const { carsCount, _id: { is_new }} = carMake;
          if (is_new === 'True') {
            newCars += carsCount;
          } else if (is_new === 'False') {
            oldCars += carsCount;
          }
        });
        const carDetails = [newCars, oldCars];
        this.doughnutChartData = [carDetails];
     });
  }


  ngAfterViewInit() {
    this.fetchNewCarsByModelAndYear();
    this.fetchNewCarsByMakeName();
  }


}

