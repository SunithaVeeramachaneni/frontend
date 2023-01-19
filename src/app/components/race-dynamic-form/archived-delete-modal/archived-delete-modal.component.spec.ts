import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedDeleteModalComponent } from './archived-delete-modal.component';

describe('ArchivedDeleteModalComponent', () => {
  let component: ArchivedDeleteModalComponent;
  let fixture: ComponentFixture<ArchivedDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedDeleteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
