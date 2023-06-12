import { NumberRangeMetadata } from './form-configuration';

export interface ResponseTypeOpenState {
  isOpen: boolean;
  response: any;
}

export interface RangeSelectorState {
  isOpen: boolean;
  questionId: string;
  rangeMetadata: NumberRangeMetadata;
}

export interface SliderSelectorState {
  isOpen: boolean;
  questionId: string;
  value: any;
}
