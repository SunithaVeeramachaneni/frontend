import { NumberRangeMetadata } from './form-configuration';

export interface ResponseTypeOpenState {
  isOpen: boolean;
  response: any;
}

export interface RangeSelectorState {
  isOpen: boolean;
  rangeMetadata: NumberRangeMetadata;
}
