import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFormListComponent } from './import-form-list.component';

describe('ImportFormListComponent', () => {
  let component: ImportFormListComponent;
  let fixture: ComponentFixture<ImportFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportFormListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
