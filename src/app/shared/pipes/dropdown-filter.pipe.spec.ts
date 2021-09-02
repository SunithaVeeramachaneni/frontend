import { TestBed } from '@angular/core/testing';
import { DropDownFilterPipe } from './dropdown-filter.pipe';

describe('DropDownFilterPipe', () => {
  let pipe: DropDownFilterPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DropDownFilterPipe] });
    pipe = TestBed.inject(DropDownFilterPipe);
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });
});
