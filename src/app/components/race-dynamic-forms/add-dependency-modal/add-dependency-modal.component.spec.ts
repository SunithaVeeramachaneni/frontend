import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDependencyModalComponent } from './add-dependency-modal.component';

describe('AddDependencyModalComponent', () => {
  let component: AddDependencyModalComponent;
  let fixture: ComponentFixture<AddDependencyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDependencyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDependencyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
