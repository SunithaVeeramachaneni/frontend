import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedTemplateListComponent } from './archived-template-list.component';

describe('ArchivedTemplateListComponent', () => {
  let component: ArchivedTemplateListComponent;
  let fixture: ComponentFixture<ArchivedTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedTemplateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
