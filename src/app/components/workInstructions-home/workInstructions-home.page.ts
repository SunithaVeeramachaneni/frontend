import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient,HttpErrorResponse,HttpHeaders  } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { MyModalPageComponent } from '../my-modal-page/my-modal-page.component';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';



@Component({
  selector: 'app-instruction-home',
  templateUrl: './workInstructions-home.page.html',
  styleUrls: ['./workInstructions-home.page.scss'],
})
export class WorkInstructionsHomeComponent implements OnInit {
  editImg = '/assets/images/edit.svg';
  deleteImg = '/assets/images/delete.svg';
  userImg = '/assets/images/User.svg';


  constructor(private http: HttpClient, private modalCtrl: ModalController
    ) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  cars:  [] ;

  async openModal(){
    //const carDetails = this.getCarsDetails(modelname);
    const modal = await this.modalCtrl.create({
      component: MyModalPageComponent,
      componentProps: {
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

  }

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/categories')
    .subscribe(response => {
      console.log(response);
      
    });
  }

}
function modelname(modelname: any) {
  throw new Error('Function not implemented.');
}

