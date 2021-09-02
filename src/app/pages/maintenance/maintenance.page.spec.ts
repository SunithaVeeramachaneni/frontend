import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { BrowserModule, By } from "@angular/platform-browser";
import { isEqual } from "lodash";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, IonSearchbar, IonSelect } from '@ionic/angular';
import { WorkOrders } from '../../interfaces/work-order';
import { AppService } from "../../services/app.service";
import { expectedWorkOrders$ } from "./maintenance.mocks"
import { MaintenanceComponent } from "./maintenance.page";
import { MaintenanceService } from "./maintenance.service";
import { of } from 'rxjs';
import { HeaderModule } from '../../components/header/header.module';

describe('Maintenance Page', () => {
  let service: MaintenanceService;
  let fixture: ComponentFixture<MaintenanceComponent>;
  let component: MaintenanceComponent;
  let searchBar: any;
  let dateSegment: any;
  let dateButtons: any;
  let today: Date = new Date(1629337200000); //2021-08-19

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaintenanceService, AppService],
      declarations: [MaintenanceComponent, IonSelect],
      imports: [ReactiveFormsModule, FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatSelectModule,
        MatOptionModule,
        MatInputModule,
        HttpClientTestingModule,
        IonicModule,
        HeaderModule,
      ],
    });
    service = TestBed.inject(MaintenanceService);
    fixture = TestBed.createComponent(MaintenanceComponent)
    fixture.detectChanges();

    component = fixture.componentInstance;
    spyOn(service, 'getAllWorkOrders').and.returnValue(expectedWorkOrders$);
    spyOn(component, 'getToday').and.returnValue(today);
    // spyOn(component, 'filterDate');
    // spyOn(component, 'getWorkOrders');

    let debugEle = fixture.debugElement;
    let nativeEle = debugEle.nativeElement;

    // dateButtons = debugEle.queryAll(By.css('ion-segment-button'))
    dateButtons = nativeEle.querySelectorAll('segment-button')
    dateSegment = debugEle.query(By.css('ion-segment'))

    // searchBar = nativeEle.querySelectorAll('ion-searchbar')
    // dateFilter = nativeEle.querySelectorAll('.segment-group');
    dateButtons = nativeEle.querySelectorAll('ion-segment-button')



  });

  it('if "Today" is selected, it should show only the workOrders corresponding to today"s date', (async () => {
    let filteredWorkOrders: WorkOrders;
    let expectedWorkOrders: WorkOrders;

    let dateSegment = fixture.debugElement.queryAll(By.css('ion-segment-button'));
    dateSegment[0].nativeElement.dispatchEvent(new Event('click'));

    // component.ngOnInit();
    // dateButtons[0].click();
    // let event = {value:'today'};
    // dateSegment.triggerEventHandler('selectionChange', event);
    // const el = fixture.nativeElement.querySelector('ion-segment');
    // el.value = 'today';
    // el.dispatchEvent(new Event('input'));
    fixture.detectChanges();



    expect(component.selectDate.value).toEqual('today')
    console.log("This log:",component.selectDate.value);

    setTimeout(() => {
      console.log(component.selectDate.value)   //shows the latest first name
    })

    expectedWorkOrders$.subscribe((resp) => expectedWorkOrders = {
      'unassigned': [],
      'assigned': [],
      'inProgress': [resp.inProgress[0]],
      'completed': []
    }
    );
    


  }));

  it('if "This Week" is selected, it should show only the workOrders corresponding to this week', () => {
    let filteredWorkOrders: WorkOrders;
    let expectedWorkOrders: WorkOrders;

    // dateFilter[0].value = 'week';
    
    fixture.detectChanges();

    expectedWorkOrders$.subscribe((resp) => expectedWorkOrders = {
      'unassigned': [resp.unassigned[0]],
      'assigned': [resp.assigned[0]],
      'inProgress': [resp.inProgress[0]],
      'completed': []
    }
    );
    component.filteredWorkOrderList$.subscribe((resp) => filteredWorkOrders = resp);
    expect(isEqual(filteredWorkOrders, expectedWorkOrders)).toBeTrue();

  })


});