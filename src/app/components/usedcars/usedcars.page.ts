import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient,HttpErrorResponse,HttpHeaders  } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { MyModalPageComponent } from '../my-modal-page/my-modal-page.component';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';



@Component({
  selector: 'app-usedcars',
  templateUrl: './usedcars.page.html',
  styleUrls: ['./usedcars.page.scss'],
})
export class UsedcarsPage implements OnInit {
  editImg = '/assets/images/edit.svg';
  deleteImg = '/assets/images/delete.svg';
  userImg = '/assets/images/User.svg';
  responseTime;
  cachedData='';
  constructor(private http: HttpClient, private modalCtrl: ModalController) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  cars: any[];

  async openAddModal(){
    const modal = await this.modalCtrl.create({
      component: MyModalPageComponent,
      componentProps: {
        type:"Add",
        modelname : "Range Rover Velar",
        make : "Land Rover",
        bodytype : "Sedan",
        city : "San Juan",
        engine : "I4"
      }
    });
    await modal.present();

    const data = await modal.onWillDismiss();
    console.log(data);
    this.cars =[];
    this.getAllUsedCars();
  }

  async openEditModal(car){
    console.log(car);
    const modal = await this.modalCtrl.create({
      component: MyModalPageComponent,
      componentProps: {
        type:"Edit",
        id: car.id,
        modelname : car.model,
        make : car.make,
        bodytype : car.body_type,
        city : car.city,
        engine : car.engine_type
      }
    });
    await modal.present();

    const data = await modal.onWillDismiss();
    console.log(data);
    this.cars = [];
    this.getAllUsedCars();

  }

  async deleteCar(car) {
    this.http.delete(`https://invamdemo-dbapi.innovapptive.com/deleteCar/${car.id}`).subscribe(data => {
      console.log(data);
      this.cars= this.cars.filter(i => i.id !== car.id);
      this.http.get<any>('https://invamdemo-dbapi.innovapptive.com/cars')
      .subscribe(response => {
        console.log(response);
      })
    })
  }



  // async getCarsDetails(model){
  //   this.http.get<any>('https://invamdemo-dbapi.innovapptive.com/cars')
  //   .subscribe(response => {
  //     console.log(response);
  //     // if(Object.keys(response).length) {
  //     //   this.cars = response.usedcars ? response.usedcars : [];
  //        console.log(response.usedcars[1]['model']);
  //     // }
  //     const model = this.cars['model'];
  //     console.log(model);
  //   });
  //   return model;

  // }

  getAllUsedCars() {
    let start = window.performance.now();
    this.http.get<any>('https://invamdemo-dbapi.innovapptive.com/cars')
    .subscribe(response => {
      console.log(response)
      if(response.cachedData == true) {
           this.cachedData = "Cached Data";
      }
      else {
        this.cachedData = "Uncached Data";
      }
      if(response && response.data && response.data.usedcars) {
        this.cars = response.data.usedcars ? response.data.usedcars : [];
        //var resp =  localStorage.getItem("response");
        let end = window.performance.now();
        let time = Math.round(end-start);
        this.responseTime = time;
        console.log(this.cars);
      }
    });
  }

  ngOnInit() {
    this.getAllUsedCars();
  }

}
function modelname(modelname: any) {
  throw new Error('Function not implemented.');
}

