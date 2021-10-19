import { HttpErrorResponse } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SparePartsComponent } from './spare-parts.page';
import { SparepartsService } from './spareparts.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { ErrorInfo } from '../../interfaces';

import { CommonService } from '../../shared/services/common.service';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';

import { CommonFilterComponent } from '../../shared/components/common-filter/common-filter.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };

describe('SparePartsPage', () => {
    let component: SparePartsComponent;
    let fixture: ComponentFixture<SparePartsComponent>;
    let spinnerSpy: NgxSpinnerService;
    let sparePartsServiceSpy: SparepartsService;
    let commonServiceSpy: CommonService;
    let sparepartsDe: DebugElement;
    let sparepartsEl: HTMLElement;

    beforeEach(waitForAsync(() => {
        spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
        sparePartsServiceSpy = jasmine.createSpyObj('SparePartsService', [
          'getPickerList',
          'getAllWorkOrders',
          'assignTechnicianToWorkorder',
        ]);
        commonServiceSpy = jasmine.createSpyObj('CommonService', [
            'commonFilterAction$',
            'selectedDateAction$',
            'selectDate'
        ])
        TestBed.configureTestingModule({
            declarations: [
              SparePartsComponent,
              MockComponent(CommonFilterComponent),
              MockComponent(HeaderComponent)
            ],
            imports: [
                FormsModule,
                IonicModule
            ],
            providers: [
              { provide: NgxSpinnerService, useValue: spinnerSpy },
              { provide: SparepartsService, useValue: sparePartsServiceSpy },
            ]
          }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(SparePartsComponent);
        component = fixture.componentInstance;
        sparepartsDe = fixture.debugElement;
        sparepartsEl = sparepartsDe.nativeElement;
        spyOn(component, 'getWorkOrders');
        spyOn(component, 'getTechnicians');
        fixture.detectChanges();
        (sparePartsServiceSpy.getPickerList as jasmine.Spy)
          .withArgs(info)
          .and.returnValue(of())
          .and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should define varibales & set defaults', () => {
        expect(component.selectedUser).toBeDefined();
        expect(component.headerTitle).toEqual('Spare Parts Control Center');
        expect(component.dateIcon).toBeDefined();
        expect(component.partsIcon).toBeDefined();;
        expect(component.priorityIcon).toBeDefined();
        expect(component.assignIcon).toBeDefined();
        expect(component.filterIcon).toBeDefined();
        expect(component.filterArrowIcon).toBeDefined();
        expect(component.hideList).toBeTrue();
        expect(component.showOverdue).toBeDefined();
        expect(component.showOverdueList).toEqual(['Yes','No']);
        expect(component.priority).toBeDefined();
        expect(component.priorityList).toEqual(['Very High','High', 'Medium','Low']);
        expect(component.kitStatus).toBeDefined();
        expect(component.kitStatusList).toEqual(['Kit Ready', 'Parts Available','Waiting On Parts']);
        expect(component.workCenter).toBeDefined();
        expect(component.workCenterList).toEqual(['Mechanical', 'Electrical']);
        expect(component.assign).toBeDefined();
        expect(component.assignList).toEqual(['Kerry Smith', 'Amy Butcher','Carlos Arnal', 'Steve Austin']);
    });

    describe('ngOnInit', () => {

        it('should define function', () => {
            expect(component.ngOnInit).toBeDefined();
        });

        it('should set initilization data for component', () => {
            (component.getWorkOrders as jasmine.Spy).and.callThrough();
            (component.getTechnicians as jasmine.Spy).and.callThrough();
            component.ngOnInit();
            expect(component.getWorkOrders).toHaveBeenCalled();
            expect(component.getTechnicians).toHaveBeenCalled();
            expect(commonServiceSpy.commonFilterAction$).toHaveBeenCalled();
            expect(commonServiceSpy.selectedDateAction$).toHaveBeenCalled();
        });
    
        it('should define function', () => {
            expect(component.getTechnicians).toBeDefined();
        });

        it('should define function', () => {
            expect(component.openSelect).toBeDefined();
        });

        // it('should define function', () => {
        //     expect(component.filterDate).toBeDefined();
        // });

        // it('should define function', () => {
        //     expect(component.isThisWeek).toBeDefined();
        // });

        // it('should define function', () => {
        //     expect(component.isThisMonth).toBeDefined();
        // });

        // it('should define function', () => {
        //     expect(component.isToday).toBeDefined();
        // });

        // it('get all the workorders', () => {
        //   component.getWorkOrders();
        //   fixture.detectChanges();
        //   expect(sparePartsServiceSpy.getAllWorkOrders).toHaveBeenCalledWith(info);
        //   expect(spinnerSpy.show).toHaveBeenCalledWith();
        //   expect(spinnerSpy.hide).toHaveBeenCalledWith();
        // //   expect(component.wiFavList).toEqual(favorites);
        // });
    });

    describe('getWorkOrders', () => {
        it('should define function', () => {
            expect(component.getWorkOrders).toBeDefined();
        });
        it('to get all the workorders', () => {
            //const value= 'month';
            component.getWorkOrders();
            expect(sparePartsServiceSpy.getAllWorkOrders).toBeDefined();
           // expect(sparePartsServiceSpy.getAllWorkOrders).toHaveBeenCalledWith(value);
            expect(component.isOverdue).toHaveBeenCalled();
            expect(component.filterPriority).toHaveBeenCalled();
            expect(spinnerSpy.show).toHaveBeenCalledWith();
            expect(spinnerSpy.hide).toHaveBeenCalledWith();
        });
    });

    describe('assignTech', () => {
        it('should defined function', () => {
            expect(component.assignTech).toBeDefined();
        })
        it('should check the assigned technician', () => {
            // const tech = {
            //     USNAM:'980' ,
            //     ASSIGNEE: 'kavya',
            //     AUFNR:'897654',
            // }
            expect(sparePartsServiceSpy.assignTechnicianToWorkorder).toBeDefined();
            // expect(sparePartsServiceSpy.assignTechnicianToWorkorder).toHaveBeenCalledWith(tech);
            expect(component.getWorkOrders).toHaveBeenCalledWith();
        })
    })
      
    describe('dateChanged', () => {
        it('should define function', () => {
            expect(component.dateChanged).toBeDefined();
        });

        it('should change the date as per the filter', () => {
            const date = 'month';
            component.dateChanged(date);
            // fixture.detectChanges();
            expect(commonServiceSpy.selectDate).toBeDefined();
            // expect(commonServiceSpy.selectDate).toHaveBeenCalled();
            // expect(spinnerSpy.show).toHaveBeenCalledWith();
            // expect(spinnerSpy.hide).toHaveBeenCalledWith();
        });
    });

    describe('filterPriority', () => {
        it('should define function', () => {
            expect(component.filterPriority).toBeDefined();
        });

        it('should filter the priorities', () => {
            const priority = 'High';
            const priorityList = ['Very High','High', 'Medium','Low']; 
            component.filterPriority(priority, priorityList);
            fixture.detectChanges();
            expect(component.priorityList[1]).toEqual(priority);
            expect(component.priorityList).toContain(priority);
            expect(component.priorityList).toEqual(priorityList);
            expect(component.filterPriority(priority, priorityList)).toBe(false);
            expect(component.priorityList.length).toBe(4);
        });
    })

    describe('isOverdue', () => {
        it('should define function', () => {
            expect(component.isOverdue).toBeDefined();
        });
        it('should define function', () => {
            let dueDate = 1633960400000.;
            const overdue = 'No';
            const interval = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
            let startOfDay = Math.floor(Date.now() / interval) * interval;
            //let endOfDay = startOfDay + interval - 1;
            expect(overdue).toBe('No')
            expect(dueDate).toBeGreaterThan(startOfDay);
        });
    })
});


  