import { isObservable, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const Zone: any;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function waitFor(promise: Promise<any> | Observable<any>): Promise<any> {
  if (isObservable(promise)) {
    promise = promise.pipe(take(1)).toPromise();
  }
  const macroTask = Zone.current.scheduleMacroTask(
    `WAITFOR-${Math.random()}`,
    () => {},
    {},
    () => {}
  );

  return promise.then((p) => {
    macroTask.invoke();
    return p;
  });
}

export default waitFor;
