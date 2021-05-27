import { Component, Input } from '@angular/core';
import { FormControl, Validators,FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { HttpHeaders, HttpClient,HttpResponse  } from '@angular/common/http';
import {  catchError, map } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {SampleService} from '../../services/sample.service';

@Component({
  selector: 'app-my-modal-page',
  templateUrl: './my-modal-page.component.html',
  styleUrls: ['./my-modal-page.component.scss'],
})
export class MyModalPageComponent {
  public example : FormGroup;

  @Input() modelname : any;
  @Input() make : any;
  @Input() bodytype : any;
  @Input() city : any;
  @Input() engine : any;
  @Input() type: any;
  @Input() id:any;

  constructor(private modalCtrl: ModalController,
              private http:HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  dismissModal(){
    this.modalCtrl.dismiss(null,"cancel");
  }

  register(formValue) {
    if(this.type == "Add") {
      this.http.post("https://invamdemo-dbapi.innovapptive.com/car", formValue)
      .subscribe(data => {
        this.modalCtrl.dismiss();
       }, error => {
        console.log(error);
      })
    }
    else if(this.type == "Edit") {
      this.http.put(`https://invamdemo-dbapi.innovapptive.com/updateCar/${this.id}`,formValue)
      .subscribe(data => {
        this.modalCtrl.dismiss();
      }, error => {
        console.log(error);
      })
    }
  }

}
