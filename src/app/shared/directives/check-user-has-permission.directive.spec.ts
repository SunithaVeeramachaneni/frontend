import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonService } from '../services/common.service';
import { permissions$ } from '../services/common.service.mock';
import { SharedModule } from '../shared.module';

@Component({
  template: `<div *appCheckUserHasPermission="'VIEW_DASHBOARDS'"></div>`
})
class TestCheckUserHasPermissionDirectiveComponent {}

describe('TestDashboardConfigurationHostComponent', () => {
  let component: TestCheckUserHasPermissionDirectiveComponent;
  let fixture: ComponentFixture<TestCheckUserHasPermissionDirectiveComponent>;
  let commonServiceSpy: CommonService;

  beforeEach(async () => {
    commonServiceSpy = jasmine.createSpyObj('CommonService', [], {
      permissionsAction$: permissions$
    });

    await TestBed.configureTestingModule({
      declarations: [TestCheckUserHasPermissionDirectiveComponent],
      imports: [SharedModule],
      providers: [{ provide: CommonService, useValue: commonServiceSpy }]
    }).compileComponents();
  });

  it('should include div', () => {
    fixture = TestBed.createComponent(
      TestCheckUserHasPermissionDirectiveComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(1);
  });

  it('should not include div', () => {
    fixture = TestBed.overrideComponent(
      TestCheckUserHasPermissionDirectiveComponent,
      {
        set: {
          template: `<div *appCheckUserHasPermission="'VIEW_DASHBOARDS_UNKOWN_PERMISSION'"></div>`
        }
      }
    ).createComponent(TestCheckUserHasPermissionDirectiveComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(0);
  });

  it('should include div if permission is not present', () => {
    fixture = TestBed.overrideComponent(
      TestCheckUserHasPermissionDirectiveComponent,
      {
        set: {
          template: `<div *appCheckUserHasPermission="''"></div>`
        }
      }
    ).createComponent(TestCheckUserHasPermissionDirectiveComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(1);
  });
});
