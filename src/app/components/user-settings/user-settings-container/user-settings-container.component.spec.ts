import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModules } from 'src/app/material.module';
import { CommonService } from 'src/app/shared/services/common.service';

import { UserSettingsContainerComponent } from './user-settings-container.component';

describe('UserSettingsContainerComponent', () => {
  let component: UserSettingsContainerComponent;
  let fixture: ComponentFixture<UserSettingsContainerComponent>;
  let commonServiceSpy: CommonService;

  beforeEach(async () => {
    commonServiceSpy = jasmine.createSpyObj('CommonService', [
      'setHeaderTitle'
    ]);

    await TestBed.configureTestingModule({
      declarations: [UserSettingsContainerComponent],
      imports: [RouterTestingModule, AppMaterialModules],
      providers: [{ provide: CommonService, useValue: commonServiceSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should set header title', () => {
      component.ngOnInit();

      expect(commonServiceSpy.setHeaderTitle).toHaveBeenCalledWith(
        'Your Settings'
      );
    });
  });
});
