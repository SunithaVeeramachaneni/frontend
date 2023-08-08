import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUpdateDeleteProgressComponent } from './form-update-delete-progress.component';

describe('FormUpdateDeleteProgressComponent', () => {
  let component: FormUpdateDeleteProgressComponent;
  let fixture: ComponentFixture<FormUpdateDeleteProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormUpdateDeleteProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUpdateDeleteProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
