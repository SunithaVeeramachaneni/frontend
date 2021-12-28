import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AppMaterialModules } from '../../../material.module';

import { CommonFilterComponent } from './common-filter.component';
import { CommonFilterService } from './common-filter.service';

describe('CommonFilterComponent', () => {
  let component: CommonFilterComponent;
  let fixture: ComponentFixture<CommonFilterComponent>;
  let commonFilterServiceSpy: CommonFilterService;

  beforeEach(waitForAsync(() => {
    commonFilterServiceSpy = jasmine.createSpyObj('CommonFilterService', ['searchFilter']);
    TestBed.configureTestingModule({
      declarations: [ CommonFilterComponent ],
      imports: [
        IonicModule.forRoot(),
        PopoverModule.forRoot(),
        FormsModule,
        AppMaterialModules
      ],
      providers: [
        { provide: CommonFilterService, useValue: commonFilterServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommonFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
