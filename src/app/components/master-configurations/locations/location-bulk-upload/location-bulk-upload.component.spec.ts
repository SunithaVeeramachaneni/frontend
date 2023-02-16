import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationBulkUploadComponent } from './location-bulk-upload.component';

describe('LocationBulkUploadComponent', () => {
  let component: LocationBulkUploadComponent;
  let fixture: ComponentFixture<LocationBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationBulkUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
