import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularFormatResponseComponent } from './tabular-format-response.component';

describe('TabularFormatResponseComponent', () => {
  let component: TabularFormatResponseComponent;
  let fixture: ComponentFixture<TabularFormatResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabularFormatResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabularFormatResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
