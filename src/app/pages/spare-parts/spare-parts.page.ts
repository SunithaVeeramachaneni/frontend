import { Component, ViewChild} from '@angular/core';
import { SparepartsService } from './spareparts.service';
import { IonSelect } from '@ionic/angular';
import { data_test } from './spare-parts-data';
import { WorkOrder, WorkOrders } from '../../interfaces/scc-work-order';
import { combineLatest, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith, filter, tap } from 'rxjs/operators';
import { Technicians } from '../../interfaces/technicians';

@Component({
  selector: 'app-spare-parts',
  templateUrl: './spare-parts.page.html',
  styleUrls: ['./spare-parts.page.css'],
})
export class SparePartsComponent{

  public testData: any[] = [];

  public testData1 = [];

  public workOrderList$: Observable<WorkOrders>;
  public filteredWorkOrderList$: Observable<WorkOrders>;
  public filter: FormControl;
  public filter$: Observable<string>;
  public selectDate: FormControl;
  public selectDate$: Observable<string>;

  public workOrders: Observable<WorkOrder[]>
  public technicians$: Observable<Technicians>

  public selectedUser = '';
  headerTitle = "Spare Parts Control Center";
  public dateIcon = "../../../assets/spare-parts-icons/date.svg";
  public partsIcon = "../../../assets/spare-parts-icons/parts.svg";
  public priorityIcon = "../../../assets/spare-parts-icons/priority.svg";
  public assignIcon = "../../../assets/spare-parts-icons/assign.svg";
  public filterIcon = "../../../assets/spare-parts-icons/filter.svg";
  public profile1 = "../../../assets/spare-parts-icons/profilePicture1.svg";
  public profile2 = "../../../assets/spare-parts-icons/profilePicture2.svg";
  public profile3 = "../../../assets/spare-parts-icons/profilePicture3.svg";

  hideList = true;

  @ViewChild('select1') selectRef: IonSelect ;

  constructor(private _sparepartsSvc: SparepartsService) {}

  ngOnInit() {
    //this.testData = data.data;
    this.getWorkOrders();
    this.getTechnicians();
  }

  getTechnicians(){
    this.technicians$ =this._sparepartsSvc.getTechnicians();
  }
  getWorkOrders() {
    this.filter = new FormControl('');
    this.selectDate = new FormControl('week');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    this.selectDate$ = this.selectDate.valueChanges.pipe(startWith('week'));
    this.workOrderList$ = this._sparepartsSvc.getAllWorkOrders();
    this.filteredWorkOrderList$ = combineLatest([this.workOrderList$, this.filter$, this.selectDate$]).pipe(
      map(([workOrders, filterString, filterDate]) => {
        let filtered: WorkOrders = {kitsrequired:[], assingedforpicking:[], kittinginprogress:[], kitscomplete:[],kitspickedup:[]};
        for (let key in workOrders)
          filtered[key] = workOrders[key].filter(workOrder =>
            workOrder.workOrderID.toLowerCase().indexOf(filterString.toLowerCase()) !== -1 &&
            this.filterDate(workOrder.dueDate, filterDate)
            ) 
        return filtered;
      })
    );
  }

openSelect(){
  this.selectRef.open()
}

optionsFn(event, index) {
  console.log(event.target.value)
  console.log(index)
  this.selectedUser= event.target.value;
  if(event.target.value) {
    this.testData1.push(this.testData.splice(index, 1));
    console.log(this.testData);
    console.log(this.testData1);
  }
}

public filterDate(dueDate, filterDate){
  if(filterDate === 'today')
  return this.isToday(dueDate)
  if(filterDate === 'month')
  return this.isThisMonth(dueDate)
  if(filterDate === 'week')
  return this.isThisWeek(dueDate)
}


isThisWeek(someDate) {
  const todayObj = new Date();
  const todayDate = todayObj.getDate();
  const todayDay = todayObj.getDay();

  const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

  return someDate >= firstDayOfWeek && someDate <= lastDayOfWeek;
}


 public isThisMonth = (someDate) => {
  const today = new Date();
  return someDate.getMonth() == today.getMonth() &&
  someDate.getFullYear() == today.getFullYear()
}

public isToday = (someDate) => {
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}


}

