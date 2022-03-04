import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { OverlayService } from './overlay.service';
import { CategoryComponent } from './templates/category/category.component';
import { Subject } from 'rxjs';

describe('OverlayService', () => {
  let overlaySpy: Overlay;
  let service: OverlayService;

  beforeEach(() => {
    overlaySpy = jasmine.createSpyObj('Overlay', ['create']);
    TestBed.configureTestingModule({
      providers: [{ provide: Overlay, useValue: overlaySpy }],
    });
    service = TestBed.inject(OverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('open', () => {
    it('should define function', () => {
      expect(service.open).toBeDefined();
    });

    it('should return overlay reference on open', () => {
      const configs = new OverlayConfig({
        hasBackdrop: true,
        panelClass: ['modal', 'is-active'],
        backdropClass: 'modal-background'
      });
      const categoryComponent = CategoryComponent;
      (overlaySpy.create as jasmine.Spy).and.returnValue({
        attach: () => ({}),
        backdropClick: () => new Subject<any>(),
      });
      spyOn(service, 'createInjector');
      const result = service.open(categoryComponent, {});
      expect(overlaySpy.create).toHaveBeenCalledWith(configs);
      expect(service.createInjector).toHaveBeenCalled();
    });
  });

  describe('createInjector', () => {
    it('should define function', () => {
      expect(service.createInjector).toBeDefined();
    });
  });
});
