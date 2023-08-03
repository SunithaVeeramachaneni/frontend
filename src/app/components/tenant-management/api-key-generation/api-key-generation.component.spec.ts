import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyGenerationComponent } from './api-key-generation.component';

describe('ApiKeyGenerationComponent', () => {
  let component: ApiKeyGenerationComponent;
  let fixture: ComponentFixture<ApiKeyGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiKeyGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiKeyGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
