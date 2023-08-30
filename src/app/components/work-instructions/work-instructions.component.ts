/* eslint-disable @typescript-eslint/naming-convention */
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { InstructionService } from './services/instruction.service';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ComponentType } from '@angular/cdk/portal';
import { BulkUploadComponent } from './modal/templates/bulk-upload/bulk-upload.component';
import { OverlayService } from './modal/overlay.service';
import { CopyInstructionComponent } from './modal/templates/copy-instruction/copy-instruction.component';
import { Instruction, ErrorInfo } from '../../interfaces';
import { Base64HelperService } from './services/base64-helper.service';
import { DummyComponent } from '../../shared/components/dummy/dummy.component';
import { WiCommonService } from './services/wi-common.services';
import { ErrorHandlerService } from '../../shared/error-handler/error-handler.service';
import { ImportService } from './services/import.service';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../shared/services/common.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { permissions, routingUrls } from '../../app.constants';
import { HeaderService } from 'src/app/shared/services/header.service';
import { downloadFile } from 'src/app/shared/utils/fileUtils';
import { MatDialog } from '@angular/material/dialog';
import { WorkInstructionHeaderModalComponent } from './work-instruction-header-modal/work-instruction-header-modal.component';

@Component({
  selector: 'app-work-instructions',
  templateUrl: './work-instructions.component.html',
  styleUrls: ['./work-instructions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkInstructionsComponent
  implements OnInit, AfterViewChecked, OnDestroy
{
  public copyInstructionComponent = CopyInstructionComponent;
  public bulkUploadComponent = BulkUploadComponent;
  public myObject: any;
  public categoryId;
  showMore = false;
  public assignedObjectsList;
  public copyInstructionsData = {
    recents: null,
    favs: null
  };
  recentsConfig: any = {
    id: 'recents',
    currentPage: 1,
    itemsPerPage: 5,
    directionLinks: false
  };
  favConfig: any = {
    id: 'favorites',
    currentPage: 1,
    itemsPerPage: 5,
    directionLinks: false
  };
  search: string;
  public authors = [];
  public CreatedBy = '';
  searchCriteria = '';
  currentRouteUrl$: Observable<string>;
  workInstructions$: Observable<{
    favorites: Instruction[];
    drafts: Instruction[];
    recents: Instruction[];
  }>;
  readonly routingUrls = routingUrls;
  readonly permissions = permissions;
  private fetchWISubscription: Subscription;

  @ViewChild('recentDrafts', { static: false }) set drafts(
    drafts: DummyComponent
  ) {
    if (drafts) {
      this.getBase64Images(drafts.value);
    }
  }

  @ViewChild('recentFavourites', { static: false }) set favourites(
    favourites: DummyComponent
  ) {
    if (favourites) {
      this.getBase64Images(favourites.value);
    }
  }

  constructor(
    private instructionSvc: InstructionService,
    private overlayService: OverlayService,
    private base64HelperService: Base64HelperService,
    private wiCommonService: WiCommonService,
    private errorHandlerService: ErrorHandlerService,
    private importService: ImportService,
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService,
    private cdrf: ChangeDetectorRef,
    private headerService: HeaderService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap((currentRouteUrl) => {
        if (currentRouteUrl === routingUrls.workInstructions.url) {
          this.headerService.setHeaderTitle(
            routingUrls.workInstructionsHome.title
          );
          this.breadcrumbService.set(routingUrls.workInstructions.url, {
            skip: true
          });
        } else {
          this.breadcrumbService.set(routingUrls.workInstructions.url, {
            skip: false
          });
        }
      })
    );
    this.fetchWISubscription = this.wiCommonService.fetchWIAction$.subscribe(
      () => this.getAllFavsDraftsAndRecentIns()
    );
  }

  ngAfterViewChecked(): void {
    this.cdrf.detectChanges();
  }

  getBase64Images = (instructions: Instruction[]) => {
    instructions.forEach((instruction) => {
      const { Cover_Image: coverImage, Id: path } = instruction;
      if (
        coverImage.indexOf('assets/') === -1 &&
        !this.base64HelperService.getBase64ImageData(coverImage, path)
      ) {
        this.base64HelperService.getBase64Image(coverImage, path);
      }
    });
  };

  setFav(event, el) {
    event.stopPropagation();
    const userName = JSON.parse(localStorage.getItem('loggedInUser'));
    const info: ErrorInfo = {
      displayToast: false,
      failureResponse: 'throwError'
    };
    this.instructionSvc.setFavoriteInstructions(el.Id, info).subscribe(
      (ins) => {
        el.IsFavorite = ins.IsFavorite;
        if (userName) {
          el.EditedBy = userName.first_name + ' ' + userName.last_name;
        }
        this.getAllFavsDraftsAndRecentIns();
      },
      (error) => this.errorHandlerService.handleError(error)
    );
  }

  exportAsXLSX(): void {
    this.instructionSvc
      .getAllBusinessObjects()
      .pipe(
        mergeMap((businessObjects) => {
          let objects = [];
          for (const businessObject of businessObjects) {
            objects = [...objects, businessObject.FIELDDESCRIPTION];
          }
          return this.instructionSvc
            .downloadSampleInstructionTemplate({
              businessObjects: objects
            })
            .pipe(
              tap((data) =>
                downloadFile(data, 'WorkInstruction_Sample_Template')
              )
            );
        })
      )
      .subscribe();
  }

  getAllFavsDraftsAndRecentIns() {
    this.workInstructions$ = combineLatest([
      this.instructionSvc.getFavInstructions(),
      this.instructionSvc.getDraftedInstructions(),
      this.instructionSvc.getRecentInstructions()
    ]).pipe(
      map(
        ([favorites, drafts, recents]: [
          Instruction[],
          Instruction[],
          Instruction[]
        ]) => {
          this.copyInstructionsData.recents = recents;
          this.copyInstructionsData.favs = favorites;
          return { favorites, drafts, recents };
        }
      )
    );
  }

  bulkUploadDialog(
    content: TemplateRef<any> | ComponentType<any> | string,
    obj
  ) {
    this.overlayService.open(content, obj);
  }

  copyWorkInstruction() {
    this.copyInstructionDialog(
      this.copyInstructionComponent,
      this.copyInstructionsData
    );
  }

  copyInstructionDialog(
    content: TemplateRef<any> | ComponentType<any> | string,
    obj
  ) {
    const ref = this.overlayService.open(content, obj);
    ref.afterClosed$.subscribe((res) => {
      this.getAllFavsDraftsAndRecentIns();
      this.wiCommonService.fetchCategories();
      this.searchCriteria = '';
    });
  }

  uploadFile(event) {
    let isAudioOrVideoFile = false;
    const file = event.target.files[0];
    if (file.type.indexOf('audio') > -1 || file.type.indexOf('video') > -1) {
      isAudioOrVideoFile = true;
    }
    const formData = new FormData();
    formData.append('file', file);

    if (isAudioOrVideoFile) {
      formData.append('userDetails', localStorage.getItem('loggedInUser'));
      this.importService
        .importFile(environment.wiApiUrl, 'speech-to-text/converter', formData)
        .subscribe(
          (data) => {
            const { progress } = data;
            if (progress === 0) {
              this.bulkUploadDialog(this.bulkUploadComponent, {
                ...data,
                isAudioOrVideoFile,
                successUrl: '/work-instructions/edit',
                failureUrl: '/work-instructions',
                s3Folder: ''
              });
            } else if (progress === 100) {
              this.wiCommonService.updateUploadInfo(data);
              this.importService.closeConnection();
            } else {
              this.wiCommonService.updateUploadInfo(data);
            }
          },
          (error) => {
            this.wiCommonService.updateUploadInfo({
              message: this.errorHandlerService.getErrorMessage(error, true),
              progress: 100,
              isError: true
            });
            this.errorHandlerService.handleError(error, true);
            this.importService.closeConnection();
          }
        );
    } else {
      const s3Folder = this.getS3Folder(new Date().getTime());
      formData.append('s3Folder', s3Folder);
      this.instructionSvc.uploadWIExcel(formData).subscribe((resp) => {
        if (Object.keys(resp).length) {
          this.bulkUploadDialog(this.bulkUploadComponent, {
            ...resp,
            isAudioOrVideoFile,
            successUrl: '/work-instructions/drafts',
            failureUrl: '/work-instructions',
            s3Folder
          });
        }
      });
    }
  }

  resetFile(event: Event) {
    const file = event.target as HTMLInputElement;
    file.value = '';
  }

  getImageSrc = (source: string, path: string) =>
    source && source.indexOf('assets/') > -1
      ? source
      : this.base64HelperService.getBase64ImageData(source, path);

  getS3Folder = (time: number) => `bulkupload/${time}`;

  ngOnDestroy(): void {
    if (this.fetchWISubscription) {
      this.fetchWISubscription.unsubscribe();
    }
  }
  openHeaderModel() {
    const dialogRef = this.dialog.open(WorkInstructionHeaderModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose: true
    });
  }
}
