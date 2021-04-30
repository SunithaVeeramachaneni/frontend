import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NgxSlickJsModule } from 'ngx-slickjs';
import { Base64HelperService } from '../../../../shared/base64-helper.service';
import { State } from '../../../../state/app.state';
import { NgCarousel } from './ngcarousel.component';

describe('NgCarousel', () => {
  let component: NgCarousel;
  let fixture: ComponentFixture<NgCarousel>;
  let base64HelperServiceSpy: Base64HelperService;
  let ngCarouselDe: DebugElement;
  let ngCarouselEl: HTMLElement;
  let store: MockStore<State>

  beforeEach(async(() => {
    base64HelperServiceSpy = jasmine.createSpyObj('Base64HelperService', ['getBase64ImageData']);
    TestBed.configureTestingModule({
      declarations: [NgCarousel],
      imports: [
        NgxSlickJsModule.forRoot({
          links: {
            jquery: "https://code.jquery.com/jquery-3.4.0.min.js",
            slickJs: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js",
            slickCss: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css",
            slickThemeCss: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"
          }
        })
      ],
      providers: [
        { provide: Base64HelperService, useValue: base64HelperServiceSpy },
        provideMockStore()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(NgCarousel);
    component = fixture.componentInstance;
    ngCarouselDe = fixture.debugElement;
    ngCarouselEl = ngCarouselDe.nativeElement;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
