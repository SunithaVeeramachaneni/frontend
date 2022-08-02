import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoginService } from 'src/app/components/login/services/login.service';
import { userInfo$ } from 'src/app/components/login/services/login.service.mock';
import { SharedModule } from '../shared.module';

@Component({
  template: `<div *appCheckUserHasPermission="['VIEW_DASHBOARDS']"></div>`
})
class TestCheckUserHasPermissionDirectiveComponent {}

describe('TestCheckUserHasPermissionDirectiveHostComponent', () => {
  let component: TestCheckUserHasPermissionDirectiveComponent;
  let fixture: ComponentFixture<TestCheckUserHasPermissionDirectiveComponent>;
  let loginServiceSpy: LoginService;

  beforeEach(async () => {
    loginServiceSpy = jasmine.createSpyObj('LoginService', [], {
      loggedInUserInfo$: userInfo$
    });

    await TestBed.configureTestingModule({
      declarations: [TestCheckUserHasPermissionDirectiveComponent],
      imports: [SharedModule],
      providers: [{ provide: LoginService, useValue: loginServiceSpy }]
    }).compileComponents();
  });

  it('should include div if permissions are present', () => {
    fixture = TestBed.createComponent(
      TestCheckUserHasPermissionDirectiveComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(1);
  });

  it('should not include div if permissions are not present', () => {
    fixture = TestBed.overrideComponent(
      TestCheckUserHasPermissionDirectiveComponent,
      {
        set: {
          template: `<div *appCheckUserHasPermission="['VIEW_DASHBOARDS_UNKOWN_PERMISSION']"></div>`
        }
      }
    ).createComponent(TestCheckUserHasPermissionDirectiveComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(0);
  });

  it('should include else template if permissions are not present', () => {
    fixture = TestBed.overrideComponent(
      TestCheckUserHasPermissionDirectiveComponent,
      {
        set: {
          template: `<div *appCheckUserHasPermission="['VIEW_DASHBOARDS_UNKOWN_PERMISSION']; else permissionNotAvailable"></div><ng-template #permissionNotAvailable><p>permissionNotAvailable</p></ng-template>`
        }
      }
    ).createComponent(TestCheckUserHasPermissionDirectiveComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('p')).length).toEqual(1);
  });

  it('should not include div if permissions are empty', () => {
    fixture = TestBed.overrideComponent(
      TestCheckUserHasPermissionDirectiveComponent,
      {
        set: {
          template: `<div *appCheckUserHasPermission="[]"></div>`
        }
      }
    ).createComponent(TestCheckUserHasPermissionDirectiveComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(0);
  });
});
