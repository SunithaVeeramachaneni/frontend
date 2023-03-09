import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, ReplaySubject } from 'rxjs';
import { APIService } from 'src/app/API.service';
import { map } from 'rxjs/operators';
import {
  ErrorInfo,
  LoadEvent,
  SearchEvent,
  TableEvent
} from './../../../../interfaces';
import { formatDistance } from 'date-fns';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  constructor() {}
}
