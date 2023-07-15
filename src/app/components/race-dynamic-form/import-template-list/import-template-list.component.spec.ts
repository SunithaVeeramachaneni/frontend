import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTemplateListComponent } from './import-template-list.component';

describe('ImportTemplateListComponent', () => {
  let component: ImportTemplateListComponent;
  let fixture: ComponentFixture<ImportTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportTemplateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
