import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDetailModalComponent } from './add-detail.component';

describe('AddDetailModalComponent', () => {
  let component: AddDetailModalComponent;
  let fixture: ComponentFixture<AddDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDetailModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
