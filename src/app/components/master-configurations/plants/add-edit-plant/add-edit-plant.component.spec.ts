import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPlantComponent } from './add-edit-plant.component';

describe('AddEditPlantComponent', () => {
  let component: AddEditPlantComponent;
  let fixture: ComponentFixture<AddEditPlantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditPlantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
