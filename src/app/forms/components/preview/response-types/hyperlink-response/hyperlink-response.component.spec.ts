import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HyperlinkResponseComponent } from './hyperlink-response.component';

describe('HyperlinkResponseComponent', () => {
  let component: HyperlinkResponseComponent;
  let fixture: ComponentFixture<HyperlinkResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HyperlinkResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HyperlinkResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
