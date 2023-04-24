import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAnswerResponseComponent } from './text-answer-response.component';

describe('TextAnswerResponseComponent', () => {
  let component: TextAnswerResponseComponent;
  let fixture: ComponentFixture<TextAnswerResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextAnswerResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAnswerResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
