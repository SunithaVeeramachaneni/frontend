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


export class UsedcarInsightsComponent implements OnInit {

  userImg = '/assets/images/User.svg';
  public newCarsByModelAndYearBarData = {};
  public newCarsByMakeDonutData = {};
  makeNames = ['Kia', 'Mazda', 'Jeep', 'Nissan', 'Hyundai', 'Lexus'];
  modelNames = ['Renegade', 'Discovery', 'Traverse', 'MAZDA3', 'CX-5', 'Equinox'];
  barChartModel: string;
  doughnutMakeName: string;
  lineChartMakeName: string;
  stackChartMakeName: string;

  respBarChart;
  respDonutChart;
  respLineChart;
  respStackChart;

  cachedBarChart ='';
  cachedDonutChart = '';
  cachedLineChart = '';
  cachedStackChart ='';


  public barChartOptions: ChartOptions = {
    title: {
      text: 'Count of new cars by model and year',
      display: true
    },
    responsive: true,
    tooltips: {
      enabled: true,
      callbacks: {
        label: (tooltipItem, data) => {
          const label = data.labels[tooltipItem.index];
          const count = data
            .datasets[tooltipItem.datasetIndex]
            .data[tooltipItem.index];
          return `${this.barChartModel}: ${count}`;
        },
      },
    },
    plugins: {
      datalabels: {
        color: 'white'
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
      label: '',
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
  public doughnutChartOptions: ChartOptions = {
    title: {
      text: 'Count of new cars by make',
      display: true
    },
    responsive: true
  };


  public lineChartData: ChartDataSets[] = [{
    data: [],
    label: ''
  }];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    title: {
      text: 'Count of cars by model',
      display: true
    },
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      /* xAxes: [{}],
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
      ] */
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
  public lineChartPlugins = [];


  public stackChartOptions: ChartOptions = {
    title: {
      text: 'Count of makes by year',
      display: true
    },
    responsive: true
  };
  public stackChartLabels: Label[] = [];
  public stackChartType: ChartType = 'bar';
  public stackChartLegend = false;
  public stackChartPlugins = [];

  public stackChartData: ChartDataSets[] = [];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private http: HttpClient,
              private zone: NgZone,
              private loadingController: LoadingController) { }


  fetchNewCarsByModelAndYear = async (modelName: string) => {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
    let start = window.performance.now();
    this.http.get<any>(`https://invamdemo-dbapi.innovapptive.com/getNewCarsByModelNameAndYear?model_name=${modelName}`)
      .subscribe(response => {
        loading.dismiss();
        console.log(response);
        if(response.cachedData == true){
          this.cachedBarChart = "Cached Data";
        }
        else {
          this.cachedBarChart = "Uncached Data";
        }
        let cars = response.data;
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
            model_name: modelName,

          }
          console.log("carsbarchart", carStatusObject)
          this.newCarsByModelAndYearBarData = carStatusObject
          this.barChartLabels = carStatusObject.years;
          this.barChartData[0].label = carStatusObject.model_name
          this.barChartData[0].data = carStatusObject.carsCount
          let end = window.performance.now();
          let time= Math.round(end - start);
          this.respBarChart = time;
        }

      },
      error => loading.dismiss()
    );

  }

  fetchNewCarsByMakeName = async (makeName: string) => {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
    let start = window.performance.now();
    this.http.get<any>(`https://invamdemo-dbapi.innovapptive.com/getNewCarsByYear?make_name=${makeName}`)
      .subscribe(response => {
        loading.dismiss();
        let newCars = 0;
        let oldCars = 0;
        if(response.cachedData == true){
          this.cachedDonutChart = "Cached Data";
        }
        else {
          this.cachedDonutChart = "Uncached Data";
        }
        if(response && response.data) {
          response.data.map(carMake => {
            const { carsCount, _id: { is_new }} = carMake;
            if (is_new === 'True') {
              newCars += carsCount;
            } else if (is_new === 'False') {
              oldCars += carsCount;
            }
            const carDetails = [newCars, oldCars];
            this.doughnutChartData = [carDetails];
            let end = window.performance.now();
            let time = Math.round(end-start);
            this.respDonutChart= time;
          });
        }    
     },
     error => loading.dismiss()
     );
  }

  fetchAllModelNameByMakeName = async (makeName) => {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
    let start = window.performance.now();
    this.http.get<any>(`https://invamdemo-dbapi.innovapptive.com/getMakeNameAndModelName?make_name=${makeName}`)
      .subscribe(
        response => {
          loading.dismiss();
          let labels = [];
          let data = [];
          if(response.cachedData == true){
            this.cachedLineChart = "Cached Data";
          }
          else {
            this.cachedLineChart = "Uncached Data";
          }
          if(response && response.data){
            response.data.map(modelDetails => {
              const { modelCount, _id: { model_name } } = modelDetails;
              labels = [...labels, model_name];
              data = [...data, modelCount];
            });
            this.lineChartData[0] = {...this.lineChartData[0], data, label: makeName};
            this.lineChartLabels = labels;
            let end = window.performance.now();
            let time= Math.round(end - start);
            this.respLineChart = time;
          }
        },
        error => loading.dismiss()
      );
  }

  fetchCountByMakeNameAndYear = async (makeName) => {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
    let start = window.performance.now();
    this.http.get<any>(`https://invamdemo-dbapi.innovapptive.com/getCountByMakeNameAndYear?make_name=${makeName}`)
      .subscribe(
        response => {
          loading.dismiss();
          let yearWiseModels = {};
          let models = {};
          if(response.cachedData == true){
            this.cachedStackChart = "Cached Data";
          }
          else {
            this.cachedStackChart = "Uncached Data";
          }
          if(response && response.data){
            response.data.map(modelDetails => {
              const { count, _id: { year, model_name } } = modelDetails;
              if (year) {
                models = {...models, [model_name]: 1};
                yearWiseModels[year] = yearWiseModels[year] ? yearWiseModels[year] : {};
                yearWiseModels = { ...yearWiseModels, [year]: { ...yearWiseModels[year], [model_name]: count }};
              }
            });
            const modelNames = Object.keys(models);
            const years = Object.keys(yearWiseModels);
            this.stackChartLabels = years;
            this.stackChartData = modelNames.map(modelName => {
              const data = years.map(year => {
                return  yearWiseModels[year][modelName] ? yearWiseModels[year][modelName] : 0;
              });
              return { data, label: modelName, stack: 'a' };  
            });
            let end = window.performance.now();
            let time = Math.round(end - start);
            this.respStackChart = time;
          }
        },
        error => loading.dismiss()
      );
  }

  chartClicked({ event, active }: { event?: MouseEvent, active?: {}[] }): void {
    // impl
  }

  chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  ngOnInit(): void {
    const [ initialModelName ] = this.modelNames;
    const [ initialMakeName ] = this.makeNames;
    this.barChartModel = initialModelName;
    this.doughnutMakeName = initialMakeName;
    this.lineChartMakeName = initialMakeName;
    this.stackChartMakeName = initialMakeName;
    this.lineChartData[0].label = this.lineChartMakeName;
    this.barChartData[0].label = this.barChartModel;
    this.fetchNewCarsByModelAndYear(this.barChartModel);
    this.fetchNewCarsByMakeName(this.doughnutMakeName);
    this.fetchAllModelNameByMakeName(this.lineChartMakeName);
    this.fetchCountByMakeNameAndYear(this.stackChartMakeName);
  }
}

