import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

export const slideInOut = trigger('slideInOut', [
  state(
    'in',
    style({
      transform: 'translate3d(0,0,0)',
      boxShadow: '-15px 0px 17px -7px rgb(0 0 0 / 46%)'
    })
  ),
  state(
    'out',
    style({
      transform: 'translate3d(100%, 0, 0)',
      boxShadow: 'none'
    })
  ),
  transition('in => out', animate('400ms ease-in-out')),
  transition('out => in', animate('400ms ease-in-out'))
]);
