import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { of } from 'rxjs';
import { AppMaterialModules } from '../../../material.module';
import { ErrorHandlerService } from '../../../shared/error-handler/error-handler.service';
import { HeaderService } from '../../../shared/services/header.service';
import { SharedModule } from '../../../shared/shared.module';
import { ToastService } from '../../../shared/toast';
import { OverlayService } from '../modal/overlay.service';
import { PlayerComponent } from '../player/player.component';
import { ImportService } from '../services/import.service';
import { InstructionService } from '../services/instruction.service';
import { WiCommonService } from '../services/wi-common.services';
import { mediaFiles, mediaFolders } from './file.component.mock';

import { MediaFilesComponent } from './files.component';

describe('MediaFilesComponent', () => {
  let component: MediaFilesComponent;
  let fixture: ComponentFixture<MediaFilesComponent>;
  let instructionServiceSpy: InstructionService;
  let toasterServiceSpy: ToastService;
  let errorHandlerServiceSpy: ErrorHandlerService;
  let importServiceSpy: ImportService;
  let overlayServiceSpy: OverlayService;
  let wiCommonServiceSpy: WiCommonService;
  let headerServiceSpy: HeaderService;
  let filesDe: DebugElement;
  let filesEl: HTMLElement;

  beforeEach(waitForAsync(() => {
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'getAllFolders',
      'getAllMediaFiles',
      'deleteFiles',
      'getAllInstructionsByFilePath',
      'updateWorkInstruction',
      'updateFile'
    ]);
    toasterServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', ['getErrorMessage', 'handleError']);
    importServiceSpy = jasmine.createSpyObj('ImportService', ['importFile', 'closeConnection']);
    overlayServiceSpy = jasmine.createSpyObj('OverlayService', ['open']);
    wiCommonServiceSpy = jasmine.createSpyObj('WiCommonService', ['updateUploadInfo']);
    headerServiceSpy = jasmine.createSpyObj('HeaderService', ['getLogonUserDetails']);

    TestBed.configureTestingModule({
      declarations: [ MediaFilesComponent, PlayerComponent ],
      imports: [
        IonicModule.forRoot(),
        AppMaterialModules,
        SharedModule,
        NgxPaginationModule,
        OrderModule,
        Ng2SearchPipeModule,
        FormsModule,
        PopoverModule
      ],
      providers: [
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: ToastService, useValue: toasterServiceSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceSpy },
        { provide: ImportService, useValue: importServiceSpy },
        { provide: OverlayService, useValue: overlayServiceSpy },
        { provide: WiCommonService, useValue: wiCommonServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MediaFilesComponent);
    component = fixture.componentInstance;
    filesDe = fixture.debugElement;
    filesEl = filesDe.nativeElement;

    (instructionServiceSpy.getAllFolders as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(mediaFolders))
      .and.callThrough();

    (instructionServiceSpy.getAllMediaFiles as jasmine.Spy)
      .withArgs(mediaFolders[0])
      .and.returnValue(of(mediaFiles))
      .and.callThrough();
      
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
