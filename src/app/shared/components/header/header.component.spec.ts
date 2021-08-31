import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let commonServiceSpy: CommonService;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {
    commonServiceSpy = jasmine.createSpyObj('CommonService', [], {
      minimizeSidebarAction$: of(false)
    });
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      providers: [
        { provide: CommonService, useValue: commonServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
