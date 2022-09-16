import { isObservable, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const Zone: any;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function waitFor(promise: Promise<any> | Observable<any>): Promise<any> {
  if (isObservable(promise)) {
    promise = promise.pipe(take(1)).toPromise();
  }

  if (window.crypto && window.crypto.getRandomValues) {
    const random =
      window.crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
    const macroTask = Zone.current.scheduleMacroTask(
      `WAITFOR-${random}`,
      () => {},
      {},
      () => {}
    );

    return promise.then((p) => {
      macroTask.invoke();
      return p;
    });
  } else
    throw new Error(
      'Your browser can not generate a secure random number, please change it to one that can (Google Chrome, IE, Firefox, Safari, Opera) or get the newest update.'
    );
}

export default waitFor;
