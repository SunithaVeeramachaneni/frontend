import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HyperlinkSideDrawerComponent } from './hyperlink-side-drawer.component';

describe('HyperlinkSideDrawerComponent', () => {
  let component: HyperlinkSideDrawerComponent;
  let fixture: ComponentFixture<HyperlinkSideDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HyperlinkSideDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HyperlinkSideDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
