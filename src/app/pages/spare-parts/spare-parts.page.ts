import { Component, ViewChild} from '@angular/core';
import { SparepartsService } from './spareparts.service';
import { IonSelect } from '@ionic/angular';
import { data_test } from './spare-parts-data';
import { WorkOrder, WorkOrders } from '../../interfaces/scc-work-order';
import { combineLatest, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith, filter, tap } from 'rxjs/operators';
import { Technicians } from '../../interfaces/technicians';
import { DomSanitizer } from '@angular/platform-browser';


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

  public baseCode:any;

  public selectedUser = '';
  headerTitle = "Spare Parts Control Center";
  public dateIcon = "../../../assets/spare-parts-icons/date.svg";
  public partsIcon = "../../../assets/spare-parts-icons/parts.svg";
  public priorityIcon = "../../../assets/spare-parts-icons/priority.svg";
  public assignIcon = "../../../assets/spare-parts-icons/assign.svg";
  public profile1 = "../../../assets/spare-parts-icons/profilePicture1.svg";
  public profile2 = "../../../assets/spare-parts-icons/profilePicture2.svg";
  public profile3 = "../../../assets/spare-parts-icons/profilePicture3.svg";

  public filterIcon = "../../../assets/maintenance-icons/filterIcon.svg";
  public filterArrowIcon = "../../../assets/maintenance-icons/filter-arrow-icon.svg";


  hideList = true;

  @ViewChild('select1') selectRef: IonSelect ;

  public showOverdue: string = 'Yes';
 public showOverdueList: string[] = ['Yes', 'No'];

 public priority: string[] = ['High','Medium'];
 public priorityList: string[] = ['High', 'Medium','Low'];

 public kitStatus: string[] = ['Kit Ready','Parts Available'];
 public kitStatusList: string[] = ['Kit Ready', 'Parts Available','Waiting On Parts'];

 public workCenter: string[] = ['Mechanical'];
 public workCenterList: string[] = ['Mechanical', 'Medium','Low'];

 public assign: string[] = ['Kerry Smith'];
 public assignList: string[] = ['Kerry Smith', 'Amy Butcher','Carlos Arnal', 'Steve Austin'];

 showFilters = false;
 public imageUrl;


  constructor(private _sparepartsSvc: SparepartsService, private sanitizer:DomSanitizer) {}

  ngOnInit() {
    //this.testData = data.data;
    this.getWorkOrders();
    this.getTechnicians();
  }

  getTechnicians(){
    this.technicians$ =this._sparepartsSvc.getTechnicians();
  }

  public myFunction() {
    this.showFilters = !this.showFilters;
  }


  getWorkOrders() {
    this.filter = new FormControl('');
    this.selectDate = new FormControl('week');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    this.selectDate$ = this.selectDate.valueChanges.pipe(startWith('week'));
    this.workOrderList$ = this._sparepartsSvc.getAllWorkOrders();

    let base64Image='data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAkACQDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+2X9o79o/w/8AAHQLV5LVdc8Y66k//COeHRKYY2jgKpPqurToGe10u2kdY1VB9p1C4zbWoVI7y7s/0DgHgHHcb46oo1Hg8pwTh9fx/KpSUp3cMNhYNpVMTUinJt/u6FP95Vu5UqVb6DIMgr53XklJ0cJRa+sYi12m9VSpRekqskr6+7Tj70tXCM/5GP8AgpH/AMFvdV+DnjJfhffap4j+Jfxe1eOyu7f4aaHc6r4d8C6BBq0lnJp2n6jFo9rcteX+o6TcSvptvBaazqYBs5NZvIY9QSeb9U4l4n4F8JprJsh4dw+acQUKVKrisTi1Gc8JGSo1YTxuY14yrKriKM5V6eHwUYUabUJThQhKlGX3laWScOuGEwWBp18d7ivUi6lZylytc9aUJT55p80YUUoJuPuxVkfmfof/AAW6+N/ws+Jmgap8TfhJrXw98F6jd3C6vY+Hm8R6B4z8NwRR2s1tf6Xq2sTaFBrWpLBJ9qltnayidpJbbfZbIrofEYD6QFfNczazzJckzHhyaVOtl+GowxmJo05aOpSniqro4iSlCV6VaFGlUTceanZSMK+e4ylXUM4yqMcJUbh7CrhJKUYWi1aWIfLVk1d8rhCOttN1/XL+xj/wUxtvHvhbwV4j1/xSvxK+EvjeztrjQfiBGoOvaJbvLNazPqvlwi41iOwvo5LTWbe+Da5p81td7bi9e3Swk++4i8MOHeLMlp8T8AypYepiaE8VRwVJuOAzDlbVShTp1JWy7F05wqUvZx5cMq0PY1KdG8q8cs04UwGZYX+0Mj5aVSUXUVCLaoV7aOEFJ/7PVTTikrUnJcrjC7mv2/trm3vLe3vLSeK5tbqGK5trmCRZYLi3njWWGeGVCUkiljZZI5EJV0YMpIINfzPUp1KVSdKrCVOrSnKnUpzi4zhUhJxnCcXZxlGScZRaTTTT1PzCUZQlKEk4yi3GUZJqUZRdmmnqmmrNPVM/nL/aA+Id78UPi3438WTTNNay6xd6ZoEbkiO28P6RK9ho0KoMiLzLWFLu6EYw97dXU+GeVif714IyKlw5wtlGWU4KNaOEp4jGPrUx+Kiq+KlKVryUas3Spt3caNOlDaCR+95HgI5dleDw0UlNUo1Kz/mr1Up1W31tJ8kX0hGK2SR/LT+wBomrQ/F39o/48fGP4Y6/8W/jjpnxHNrqcd7od/bXfh/VLufX5L+1tLm50G9/sWyitrLTNPW8urHTo7HTIdNsZZbWFYzP/mj4lYjMcVneJp5ti54fMMVjcxrZiq7lCc8RCrGM6cqdaVOUI0ZOUadKaXs4ckYU1ZRUcA+3WJzzM8RgZYrH0sXh6FO9GcqlB1Z13VnC1OUoX5KUE1BNQVnKKbP2B/aRT4YfHvwZ4a+EnxQ/Z11280n4neBNO8S2OrQ6PcXmq+EtVvZJ4khju9O0O6m0jVNBAN3qtzNe6bHZWx/0k3FpNcrH+WYKpVwNWri8NjoUng6jUlzQXtYqzas6ilUhPqowmt5bK6/T8zw9LMsPHA4/L6uKw+MhrJ0qkpYWbj7s1JQ/c1aT155VIdIrmbcT8+f+CMdj8UfDXhr47+BdX+2zfB7wr40t0+H0+pWc0dxa6/e3etjxPo8d80dtBPd2NpaaLca9ZwQyQWl5f2c9rN5F8slz/oz9HTFZxiMrzqnVc5ZDSqYOeAlOnJQWPrKtPGww1ayjOKprD1MRTvN0p1KMvc9q+f8AGOEvrUIY7D1YSjQoV+Wm5J/xLyVSMW9HZRi5pbOUW7Nu/wDYt+yj+1N4e8LfCOx8KePL+eS+8NavqGlaLI09uZT4c8myvbCGRriaOQrZ3F5fWNqvzJDY2trbxkJCsaZeJnhvj8y4orZnktCKo5hhaGJxaUJ8v1/nrUa8oqnFxTq06NGtUekp1qlSpK7m5Pw+JuG6+JzSeJwUEoYilCrWXK7e3vOE2rK3vxhCcurnKUnq7n5b69pN3oOuazoeoIyX+i6rqOk3qPuDpd6deTWdyj7grblmhcNuVWyDkA8V/R+CxVLG4PCY2g06GLw1DFUWrWdLEUoVabVm1ZwmmrNrs2fpFGrGvRpVoawrUqdWDWzjUgpx/Bo+BPFvxS0rS/jn8QfBvwP8e+CtJ+Jt/ongmL4p2Bimyt3cS69beH9E8R65BptzaaFqHijTLafTra9tHv8AXLZNOa0u7bThdaZeD+AvpO5DkL42webYHFQxGJxmGnT4gwGHb5sFicPDCUYYuUowUHKvho4eNajCbrU50J1KvK68U+3KM/pU8fiMHhq+H+sUY4OjUnOM5wpVXWxE6NCtUS9lGc4zrpJynOEYu9K8YHVaj8S/jbYWeja8/wAQdGs7Pwpqg0LVxqWnWWnxz2N0rQT+F10mLQLa31KfU7O7uru51m71mNtEk06zvLG4EM08L/zZVynCYurTw2Cpxni8UlhsPy1JRhFVZOl7SrUrQp0lShzP95Nv4m26fLd/bZli8Vk+FjWxVfDQpVKsPaQ9rDESrTivaOnBU2nQWkHCLqRkm/epSjzo+ivAXg3w14F8NWWh+FdN03TtOdpNTuG0yCCGLU9T1Ii51DWJ3txtu7vUp2NxPeO0ss+VLSuApr/XDgrhnA8H8L5Pw/gGp0cBg6UKmI9zmxmJnFTxOLqSglGcq9VymmrpU+SEXywifn8eS3NThTgp2m/ZpKMm4q87rSTnbmcvtN36n078N/gp42+JGh3WueG7HUbqxtdVn0qWSziZ4hdwWdjeOjEMPnEN9AxH91lPeseIOL8n4fxlLB5hWoU61XDQxMY1ZJSdKdWtSi1fpz0Zr1TPJx+b4PL60aOInTjOVJVUpOz5ZSnBPZ6XhI8i/wCC90n7RP7KOhp+0h8APA2l6z8PPG1/Z6X8SvF8mn3eu3Pwt8a6neWmmaXqt7o0bR2NpoHjC4ngjg8Qaqmo6XbeKZZ9L1GGzl1rQBcfzXkfi5n+U8O4Ph/CUcJ7fBqdDD5liFKvWjhXJyoUoUJOND2mG5nShUq+1puhGnB0OaEqkvyiPGmbZbldLA4WjQbownCONq81SpTpp81OKou1O8FeMZz548qjF0+ZKUv5df2J/G/hzx38UfjDea/rdppviz4x6p4VuNRt7/7TfeI9c8VaXP4h1Gez0tbXazazoDT3Xih5UFkt1oAv9V0thexWsN1+Y8U5VVz7KcxzlV3UznLcVUzOup2lUxuGxVo5inHSLnCUKeKuotShGrFRvUgnz8B8UQwmfvKc6ftMBxPfD1MZN2dLNFWq1cBiHO14/WK+JrYa6adOvXoyvGNN2+1P2ovi1o/wt+EWuap4q+KsPj/VfE+k+LtM8FW2vXd5qtjaapc+HdRhu7O2itIriFNZbTrfUYJ7vWp7WTS9Mt9bBuo9Wv8ATNE174Tg7hV5zja+Pr0vqWUZSoYrF11Tk4YrEU+atg8ujJppfWalO9SN4QVGMpXdR0Iz/UOPeJ6XDOWwwzxdXNs4zKlWweVYevWU/qOGxEYYbG5ko3VvYUqqpUptTqSr1IxX7pYiUes/4JXftV6h8UtE+E/7Ldx8PfHF78QdQv8AVPD/AIKutMtNR8RPd2U2p3WsWSeKrV0bU/Ddto+i6nZPfa3cG60TTdNhmv8AWLjQtOsZ5l/sHw/8UcnyXJsLkWffWsNHAKvGhmTU8XTnSnWqV6dKvShF4ijKmqqoUVTp1qbhGCfsYqx8VwjxrgMHg8PlGYxq0nQ9qqOKgpV6MoTqVKsaUoQTq040ud0aXLGpT9nCN3TSsf3c/Ar4UWPwY+Gmg+BrWWK7vbVZtQ17UoozGuqa9qDCXULoKxLeTEFh0+y3Yk+wWVoJB5gcn8Q4z4mrcW8Q43OakZUqVRwoYLDylzPDYKguWhSbWnPK869a3u+3rVXH3Wj57Ocznm2YV8ZJOMJNQoU27+zoQ0hH1es59OecraWPT9W0nSte0vUNE13TNP1rRdXsrnTtV0jVrK21HS9T0+8ie3u7DULC8jmtL2yuoJHhubW5ilgnid45UZGKn5Y8rfR6p7o/l3/4KB/8EWv2IPgp4s8FftWfBDw945+D/jub4wfDiN/C3gjxPYL8N1vrrX9L0yTVIfDXiHw/r97byLFNHLBo8GtR+FbeW0tooPD0dl9otLj6fhvMK9PN8FzRo1o1a0MPWhWhzwrUMQ/YVqVaKlFVITpzaalrdRle6ufO51gqccDWnSnWoSpwnVpOlU5XSq0k61OpSk1KVOcakE04NWV0rK1vzX8RfsUfCH9pT9or4FfBPxxfeMdF8C38Wo+M7iz8GX3h7R5pPF3i2z+GOqaz4ikjv/DGsaZPfPceN79LOC602fTNOttM0a3sbCCOC+GofY8S5dgMgyPDUMowlLBUMbmWaV8RRp+0lCVTD4qrQpWdSc6ipxp06ajS5/ZR9nBQhGMVE8LL89zbijNquIzvHVcbiMJgsuwdGvJU4TjQdD2sk+SEYOc6jnOpV5fa1ZTnKpOcpXP69f2Qv2A/2W/2HfDt1onwA+HFromratb2tv4m8fa7cP4h+IXilLKCC2t49X8TXiLLBYRxWtuU0LQrfRvDsdxGb2LR0vZri4m/LKlapVd5vTpFaRXov1d35n3NHD0qCtTjr1k3zSet9W/N7Ky8j7LrI2D/2Q==';

  
    this.baseCode = this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
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

