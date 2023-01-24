import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperatorRoundsContainerComponent } from './operator-rounds-container.component';

describe('OperatorRoundsContainerComponent', () => {
  let component: OperatorRoundsContainerComponent;
  let fixture: ComponentFixture<OperatorRoundsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperatorRoundsContainerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorRoundsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
