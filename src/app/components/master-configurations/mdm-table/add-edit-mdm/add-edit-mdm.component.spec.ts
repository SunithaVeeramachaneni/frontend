import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMdmComponent } from './add-edit-mdm.component';

describe('AddEditMdmComponent', () => {
  let component: AddEditMdmComponent;
  let fixture: ComponentFixture<AddEditMdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditMdmComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditMdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
