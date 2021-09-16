import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PlyrModule } from 'ngx-plyr';
import { AppMaterialModules } from '../../../material.module';

import { PlayerComponent } from './player.component';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerComponent ],
      imports: [
        IonicModule.forRoot(),
        PopoverModule,
        AppMaterialModules,
        PlyrModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
