import { of } from 'rxjs';
export const unreadCount$ = of({ data: 'dummy' });
export const openCollabWindow$ = of({
  data: { dummy: 'dummy' }
});
export const meeting$ = of({ data: 'dummy' });
export const getInstallationURL$ = ({}) => of('mock');
