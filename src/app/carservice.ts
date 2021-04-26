import {Injectable} from "@angular/core";
import {SampleService} from '../app/services/sample.service';
import {combineLatest, forkJoin, from, of} from "rxjs";

export interface CarQuery {
  model: any,
  make:any,
  body_type:any,
  city:any,
  engine_type:any
}

@Injectable({providedIn: "root"})
export class carService {

  constructor(private _carService: SampleService) {
  }

  addCar(carDetails) {
    return this._carService._postData('addCar', carDetails);
  }

}
