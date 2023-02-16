import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsBulkUploadComponent } from './assets-bulk-upload.component';

describe('AssetsBulkUploadComponent', () => {
  let component: AssetsBulkUploadComponent;
  let fixture: ComponentFixture<AssetsBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsBulkUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
