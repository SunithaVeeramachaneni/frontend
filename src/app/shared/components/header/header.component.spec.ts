import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { AppMaterialModules } from '../../../material.module';
import { CommonService } from '../../services/common.service';
import { HeaderService } from '../../services/header.service';
import { logonUserDetails } from '../../services/header.service.mock';
import { HeaderComponent } from './header.component';
import { userData$ } from './header.component.mock';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let commonServiceSpy: CommonService;
  let fixture: ComponentFixture<HeaderComponent>;
  let headerServiceSpy: HeaderService;
  let oidcSecurityServiceSpy: OidcSecurityService;

  beforeEach(waitForAsync(() => {
    commonServiceSpy = jasmine.createSpyObj('CommonService', [], {
      minimizeSidebarAction$: of(false)
    });
    headerServiceSpy = jasmine.createSpyObj('HeaderService', ['getLogonUserDetails']);
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [], {
      userData$: userData$
    });

    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      providers: [
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy },
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy },
      ],
      imports:[
        IonicModule,
        AppMaterialModules,
        BreadcrumbModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    (headerServiceSpy.getLogonUserDetails as jasmine.Spy)
      .withArgs()
      .and.returnValue(logonUserDetails)
      .and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
