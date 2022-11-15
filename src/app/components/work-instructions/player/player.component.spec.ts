import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlyrModule } from 'ngx-plyr';
import { AppMaterialModules } from '../../../material.module';
import { TenantService } from '../../tenant-management/services/tenant.service';

import { PlayerComponent } from './player.component';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let tenantServiceSpy: TenantService;

  beforeEach(waitForAsync(() => {
    tenantServiceSpy = jasmine.createSpyObj('TenantService', ['getTenantInfo']);

    TestBed.configureTestingModule({
      declarations: [PlayerComponent],
      imports: [AppMaterialModules, PlyrModule],
      providers: [
        {
          provide: TenantService,
          useValue: tenantServiceSpy
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
