import { TestBed } from "@angular/core/testing";
import { NgZone } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import { TimeAgoPipe } from "./time-ago.pipe";

xdescribe("TimeAgoPipe", () => {
  let pipe: TimeAgoPipe;
  let changeDetRefSpy: ChangeDetectorRef;
  let ngZoneSpy: NgZone;

  beforeEach(() => {
    changeDetRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck']);
    ngZoneSpy = jasmine.createSpyObj('NgZone', ['runOutsideAngular', 'run']);
    TestBed.configureTestingModule({
      providers: [
        TimeAgoPipe,
        { provide: NgZone, useValue: ngZoneSpy },
        { provide: ChangeDetectorRef, useValue: changeDetRefSpy }
      ]
    });
    pipe = TestBed.inject(TimeAgoPipe);
  });

  it("should create", () => {
    expect(pipe).toBeTruthy();
  });
});
