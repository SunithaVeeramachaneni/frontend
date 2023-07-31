import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedFormListComponent } from './archived-form-list.component';

describe('ArchivedFormListComponent', () => {
  let component: ArchivedFormListComponent;
  let fixture: ComponentFixture<ArchivedFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedFormListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
