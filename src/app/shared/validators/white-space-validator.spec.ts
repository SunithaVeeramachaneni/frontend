import { AbstractControl } from '@angular/forms';
import { WhiteSpaceValidator } from './white-space-validator';

describe('WhiteSpaceValidator', () => {
  it('should create an instance', () => {
    expect(new WhiteSpaceValidator()).toBeTruthy();
  });

  it('should return validation error when form controller contains only spaces', () => {
    const control = { value: '   ' };

    const valiadation = WhiteSpaceValidator.noWhiteSpace(
      control as AbstractControl
    );

    expect(valiadation).toEqual({ noWhiteSpace: true });
  });

  it('should return null error when form controller contains data', () => {
    const control = { value: ' abc ' };

    const valiadation = WhiteSpaceValidator.noWhiteSpace(
      control as AbstractControl
    );

    expect(valiadation).toBeNull();
  });
});
