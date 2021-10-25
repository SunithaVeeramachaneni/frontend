import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { InstructionService } from './services/instruction.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ExcelService } from './services/excel.service';
import * as ExcelJs from 'exceljs/dist/exceljs.min.js';
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
import { routingUrls } from '../../app.constants';

@Component({
  selector: 'app-work-instructions',
  templateUrl: './work-instructions.page.html',
  styleUrls: ['./work-instructions.page.scss'],
})
export class WorkInstructionsPage implements OnInit, AfterViewChecked {
  public copyInstructionComponent = CopyInstructionComponent;
  public bulkUploadComponent = BulkUploadComponent;
  public myObject: object;
  public categoryId;
  showMore = false;
  public assignedObjectsList;
  public copyInstructionsData = {
    recents: null,
    favs: null
  };
  workbook = new ExcelJs.Workbook();
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
  headerTitle$: Observable<string>;
  workInstructions$: Observable<{favorites: Instruction[], drafts: Instruction[], recents: Instruction[]}>;
  readonly routingUrls = routingUrls;

  @ViewChild('recentDrafts', { static: false }) set drafts(drafts: DummyComponent) {
    if (drafts) {
      this.getBase64Images(drafts.value);
    }
  }

  @ViewChild('recentFavourites', { static: false }) set favourites(favourites: DummyComponent) {
    if (favourites) {
      this.getBase64Images(favourites.value);
    }
  }

  constructor(private spinner: NgxSpinnerService,
              private excelSrv: ExcelService,
              private _instructionSvc: InstructionService,
              private overlayService: OverlayService,
              private base64HelperService: Base64HelperService,
              private wiCommonService: WiCommonService,
              private errorHandlerService: ErrorHandlerService,
              private importService: ImportService,
              private commonService: CommonService,
              private breadcrumbService: BreadcrumbService,
              private cdrf: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$
      .pipe(
        tap(currentRouteUrl => {
          this.commonService.setHeaderTitle(routingUrls.workInstructions.title);
          if (currentRouteUrl === routingUrls.workInstructions.url) {
            this.breadcrumbService.set(routingUrls.workInstructions.url, { skip: true });
          } else {
            this.breadcrumbService.set(routingUrls.workInstructions.url, { skip: false });
          }
        })
      );
    this.headerTitle$ = this.commonService.headerTitleAction$;
    this.getAllFavsDraftsAndRecentIns();
  }

  ngAfterViewChecked(): void {
    this.cdrf.detectChanges();    
  }

  getBase64Images = (instructions: Instruction[]) => {
    instructions.map(instruction => {
      const { Cover_Image: coverImage, Id: path } = instruction;
      if (coverImage.indexOf('assets/') === -1 && !this.base64HelperService.getBase64ImageData(coverImage, path)) {
        this.base64HelperService.getBase64Image(coverImage, path);
      }
    });
  }

  setFav(event, el) {
    event.stopPropagation();
    const userName = JSON.parse(localStorage.getItem("loggedInUser"));
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
    this._instructionSvc.setFavoriteInstructions(el.Id, info).subscribe(
      ins => {
        el.IsFavorite = ins.IsFavorite;
        if (userName) {
          el.EditedBy = userName.first_name + " " + userName.last_name;
        }
        this.getAllFavsDraftsAndRecentIns();
      },
      error => this.errorHandlerService.handleError(error)
    );
  }

  exportAsXLSX(): void {
    this.workbook = new ExcelJs.Workbook();
    const SheetProperties = {
      defaultRowHeight: 100,
      tabColor: {argb: 'b2b2b2'}
    };
    const sheets = [
      this.workbook.addWorksheet('WorkInstruction_Sample_1', { properties: SheetProperties}),
      this.workbook.addWorksheet('WorkInstruction_Sample_2', { properties: SheetProperties})
    ];
    this.excelSrv.exportAsExcelFile(this.workbook, sheets, 'WorkInstruction_Sample_Template.xlsx');
  }

  getAllFavsDraftsAndRecentIns() {
    this.spinner.show();
    this.workInstructions$ = combineLatest([
      this._instructionSvc.getFavInstructions(),
      this._instructionSvc.getDraftedInstructions(),
      this._instructionSvc.getRecentInstructions()
    ]).pipe(
      map(([favorites, drafts, recents]: [Instruction[], Instruction[], Instruction[]]) => {
        this.copyInstructionsData.recents = recents;
        this.copyInstructionsData.favs = favorites;
        this.spinner.hide();
        return {favorites, drafts, recents}
      })
    );
  }

  bulkUploadDialog(content: TemplateRef<any> | ComponentType<any> | string, obj) {
    this.overlayService.open(content, obj);
  }

  copyWorkInstruction() {
    this.copyInstructionDialog(this.copyInstructionComponent, this.copyInstructionsData);
  }

  copyInstructionDialog(content: TemplateRef<any> | ComponentType<any> | string, obj) {
    const ref = this.overlayService.open(content, obj);
    ref.afterClosed$.subscribe(res => {
      this.getAllFavsDraftsAndRecentIns();
      this.searchCriteria = '';
    });
  }

  uploadFile(event) {
    this.spinner.show();
    let isAudioOrVideoFile = false;
    const file = event.target.files[0];
    if (file.type.indexOf('audio') > -1 || file.type.indexOf('video') > -1) {
      isAudioOrVideoFile = true;
    }
    const formData = new FormData();
    formData.append('file', file);

    if (isAudioOrVideoFile) {
      formData.append('userDetails', localStorage.getItem('loggedInUser'));
      this.importService.importFile(`${environment.wiApiUrl}speech-to-text/converter`, formData)
        .subscribe(
          data => {
            const { progress } = data;
            if (progress === 0) {
              this.spinner.hide();
              this.bulkUploadDialog(this.bulkUploadComponent, { ...data, isAudioOrVideoFile, successUrl: '/work-instructions/edit', failureUrl: '/work-instructions', s3Folder: '' });
            } else if (progress === 100) {
              this.wiCommonService.updateUploadInfo(data);
              this.importService.closeConnection();
            } else {
              this.wiCommonService.updateUploadInfo(data);
            }
          },
          error => {
            this.spinner.hide();
            this.wiCommonService.updateUploadInfo({ message: this.errorHandlerService.getErrorMessage(error, true), progress: 100, isError: true });
            this.errorHandlerService.handleError(error, true)
            this.importService.closeConnection();
          }
        );
    } else {
      const s3Folder = `bulkupload/${new Date().getTime()}`;
      formData.append('s3Folder', s3Folder);
      this._instructionSvc.uploadWIExcel(formData).subscribe(
        resp => {
          if (Object.keys(resp).length) {
            this.bulkUploadDialog(this.bulkUploadComponent, { ...resp, isAudioOrVideoFile, successUrl: '/work-instructions/drafts', failureUrl: '/work-instructions', s3Folder });
          }
          this.spinner.hide();
        }
      );
    }
  }

  resetFile(event: Event) {
    const file = event.target as HTMLInputElement;
    file.value = '';
  }

  getImageSrc = (source: string, path: string) => {
    return source && source.indexOf('assets/') > -1 ? source : this.base64HelperService.getBase64ImageData(source, path);
  }
}
