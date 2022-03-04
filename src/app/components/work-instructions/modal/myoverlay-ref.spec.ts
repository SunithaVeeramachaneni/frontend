import { Subject } from 'rxjs';
import { MyOverlayRef } from './myoverlay-ref';
import { CategoryComponent } from './templates/category/category.component';

describe('MyOverlayRef', () => {
  let myOverlayRefClass: MyOverlayRef;
  const overlaySpy = jasmine.createSpyObj('OverlayRef', {
    backdropClick: new Subject<any>(),
    dispose: () => ({}),
  });
  const categoryComponent = CategoryComponent;
  beforeEach(() => {
    myOverlayRefClass = new MyOverlayRef(overlaySpy, categoryComponent, {});
  });

  it('should define variable and private function', () => {
    expect(myOverlayRefClass.afterClosed$).toBeDefined();
  });

  xit('should subscribe to backdropClick on MyOverlayRef object creation', () => {
    spyOn<any>(myOverlayRefClass, '_close');
    overlaySpy.backdropClick.next({});
    expect(myOverlayRefClass['_close']).toHaveBeenCalledWith(
      'backdropClick',
      null
    );
  });

  describe('close', () => {
    it('should define function', () => {
      expect(myOverlayRefClass.close).toBeDefined();
    });

    it('should call _close method', () => {
      spyOn<any>(myOverlayRefClass, '_close');
      const data = { cid: 122 };
      myOverlayRefClass.close(data);
      expect(myOverlayRefClass['_close']).toHaveBeenCalledWith('close', data);
    });
  });

  describe('_close', () => {
    it('should define function', () => {
      expect(myOverlayRefClass['_close']).toBeDefined();
    });

    it('should send new value and complete the afterClosed$ observable', () => {
      const data = { cid: 122 };
      const type = 'close';
      spyOn(myOverlayRefClass.afterClosed$, 'next');
      spyOn(myOverlayRefClass.afterClosed$, 'complete');
      myOverlayRefClass['_close'](type, data);
      myOverlayRefClass.afterClosed$.subscribe((afterClosedData) =>
        expect(afterClosedData).toEqual({ type, data })
      );
      expect(overlaySpy.dispose).toHaveBeenCalledWith();
      expect(myOverlayRefClass.afterClosed$.next).toHaveBeenCalledWith({ type, data });
      expect(myOverlayRefClass.afterClosed$.complete).toHaveBeenCalledWith();
    });
  });
});
