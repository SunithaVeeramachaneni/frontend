import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { HeaderService } from '../../services/header.service';
import { logonUserDetails } from '../../services/header.service.mock';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let commonServiceSpy: CommonService;
  let fixture: ComponentFixture<HeaderComponent>;
  let headerServiceSpy: HeaderService;

  beforeEach(waitForAsync(() => {
    commonServiceSpy = jasmine.createSpyObj('CommonService', [], {
      minimizeSidebarAction$: of(false)
    });
    headerServiceSpy = jasmine.createSpyObj('HeaderService', ['getLogonUserDetails']);
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      providers: [
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy },
      ],
      imports:[
        IonicModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    (headerServiceSpy.getLogonUserDetails as jasmine.Spy)
      .withArgs()
      .and.returnValue(logonUserDetails)
      .and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
