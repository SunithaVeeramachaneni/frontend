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

  mName = new FormControl('',Validators.required);


  constructor(private modalCtrl: ModalController,
    private http:HttpClient,public fb: FormBuilder,
    private _carService: SampleService) {
      this.example = this.fb.group({
        mdName: ['', Validators.required]
      });
    }
    public registerFormGroup: FormGroup;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  logForm(){
    console.log(this.example.value)
  }
  dismissModal(){
    this.modalCtrl.dismiss(null,"cancel");
  }
  onSub():Observable<any>{
    const car = {
      "model_name": "SK011212",
      "make_name": "SKODA",
      "body_type": "ABC",
      "city": "Chennai",
      "engine_type": "15"
    };

  var header = { "headers": {"Content-Type": "application/json"} };

 return this.http.post('https://invamdemo-dbapi.innovapptive.com/cars', car, header)
  .pipe(map((res: HttpResponse<any>) => {
    return res;
  }),
  // .toPromise().then(data => {
  //   return data;
  // }).catch(error => {
  //   console.log(error.status);
  // });
  catchError((error: any) => of([])));}
  onSubmit(){

   // const newModelName = this.modelname.value;
   // this.modalCtrl.dismiss(this.modelname,"submitted");
   let url = 'https://invamdemo-dbapi.innovapptive.com/cars';

  }

  register() {
    console.log("worked");

    const car = {
        "model_name": "SK011212",
        "make_name": "SKODA",
        "body_type": "ABC",
        "city": "Chennai",
        "engine_type": "15"
      };
      // this.http.post("https://invamdemo-dbapi.innovapptive.com/cars", car, this.httpOptions)
      // // .subscribe(data => {
      // //   console.log(data);
      // //  }, error => {
      // //   console.log(error);
      // // })
      // .pipe(map((res:any) =>{
      //   return res.data;
      // }),catchError(err=>of([])));

      return this._carService._postData('cars', car).pipe(map((res: any) => {
        return res.data;
      }), catchError(err => of([])));

}

// submitForm() {
//   var formData: any = new FormData();
//   formData.append("zxczc", this.form.get('mname').value);
//   formData.append("zxczxc", this.form.get('mkname').value);

//   this.http.post('https://invamdemo-dbapi.innovapptive.com/cars', formData).subscribe(
//     (response) => console.log(response),
//     (error) => console.log(error)
//   )
// }


}
