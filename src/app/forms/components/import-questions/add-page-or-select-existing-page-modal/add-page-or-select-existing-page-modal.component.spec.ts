import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPageOrSelectExistingPageModalComponent } from './add-page-or-select-existing-page-modal.component';

describe('AddPageOrSelectExistingPageModalComponent', () => {
  let component: AddPageOrSelectExistingPageModalComponent;
  let fixture: ComponentFixture<AddPageOrSelectExistingPageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPageOrSelectExistingPageModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPageOrSelectExistingPageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
