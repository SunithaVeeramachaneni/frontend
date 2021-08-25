import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { CarouselComponent } from './carousel.component';
import { Base64HelperService } from '../../../../../../shared/base64-helper.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../../../../../../state/app.state';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;
  let base64HelperServiceSpy: Base64HelperService;
  let carouselDe: DebugElement;
  let carouselEl: HTMLElement;
  let store: MockStore<State>;

  beforeEach(async(() => {
    base64HelperServiceSpy = jasmine.createSpyObj('Base64HelperService', ['getBase64ImageData']);
    TestBed.configureTestingModule({
      declarations: [CarouselComponent],
      providers: [
        { provide: Base64HelperService, useValue: base64HelperServiceSpy },
        provideMockStore()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    carouselDe = fixture.debugElement;
    carouselEl = carouselDe.nativeElement;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
