import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import Swal from 'sweetalert2';
import { InstructionService } from '../services/instruction.service';
import { ToastService } from '../../../shared/toast';
import { ErrorInfo, Files, MediaFile } from '../../../interfaces';
import { FileInfo } from '../../../interfaces';
import { ErrorHandlerService } from '../../../shared/error-handler/error-handler.service';
import { ImportService } from '../services/import.service';
import { environment } from '../../../../environments/environment';
import { OverlayService } from '../modal/overlay.service';
import { ComponentType } from '@angular/cdk/portal';
import { BulkUploadComponent } from '../modal/templates/bulk-upload/bulk-upload.component';
import { WiCommonService } from '../services/wi-common.services';
import { map, mergeMap, tap, toArray } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { permissions, routingUrls } from '../../../app.constants';
import { CommonService } from '../../../shared/services/common.service';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class MediaFilesComponent implements OnInit {
  @ViewChild('cancel') cancel: ElementRef;
  headerTitle = 'Files';
  fileInfo: FileInfo;
  config: any = {
    id: 'files',
    currentPage: 1,
    itemsPerPage: 6,
    directionLinks: false
  };
  search: string;
  order = 'updatedAt';
  reverse = true;
  reverseObj: any = { updatedAt: true };
  bulkUploadComponent = BulkUploadComponent;
  editRows = [];
  currentRouteUrl$: Observable<string>;
  mediaFiles$: Observable<MediaFile[]>;
  readonly routingUrls = routingUrls;
  readonly permissions = permissions;

  constructor(
    private instructionSvc: InstructionService,
    private toastService: ToastService,
    private errorHandlerService: ErrorHandlerService,
    private importService: ImportService,
    private overlayService: OverlayService,
    private wiCommonService: WiCommonService,
    private commonService: CommonService,
    private headerService: HeaderService
  ) {}

  ngOnInit() {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() => this.headerService.setHeaderTitle(routingUrls.files.title))
    );
    this.getAllMediaFiles();
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    } else {
      this.order = value;
      this.reverse = false;
    }
    this.reverseObj = { [value]: this.reverse };
  }

  splitFileFromFolder(file: Files) {
    const str = file.Key;
    return str.split('/');
  }

  getAllMediaFiles() {
    this.mediaFiles$ = this.instructionSvc.getFiles('media', true).pipe(
      map((files) => {
        this.editRows = new Array(files.length).fill(false);
        const result: MediaFile[] = files.map((file) => {
          const splitFile = this.splitFileFromFolder(file);
          const fileNameWithExtension = splitFile[3];
          const fileName = splitFile[3].split('.').slice(0, -1).join('.');
          const filePath = file.Key.split('/').slice(1).join('/');
          const originalFileName = splitFile[3]
            .split('.')
            .slice(0, -1)
            .join('.');
          const updatedAt = file.LastModified;
          const fileType = file.MimeType.split('/')[0];
          return {
            fileNameWithExtension,
            fileName,
            filePath,
            originalFileName,
            updatedAt,
            fileType
          };
        });
        return result;
      })
    );
  }

  removeFile(el) {
    Swal.fire({
      title: 'Are you sure?',
      html:
        `You are deleting media file <strong>` +
        `${el.fileName}` +
        `from the repository, this audio/video cannot be played anymore from the Work Instruction!</strong> ?`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#888888',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Delete',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const info: ErrorInfo = {
          displayToast: true,
          failureResponse: 'throwError'
        };
        this.instructionSvc
          .deleteFile(el.filePath, info)
          .pipe(
            mergeMap(() =>
              this.instructionSvc
                .getAllInstructionsByFilePath(el.filePath, info)
                .pipe(
                  mergeMap((instructions) =>
                    from(instructions).pipe(
                      mergeMap((instruction) => {
                        instruction = {
                          ...instruction,
                          IsAudioOrVideoFileDeleted: true
                        };
                        return this.instructionSvc.updateWorkInstruction(
                          instruction,
                          info
                        );
                      })
                    )
                  ),
                  toArray()
                )
            )
          )
          .subscribe(() => {
            this.toastService.show({
              text:
                "File name '" +
                el.fileName +
                "' has been deleted from S3 repository",
              type: 'success'
            });
            this.getAllMediaFiles();
          });
      }
    });
  }

  bulkUploadDialog(
    content: TemplateRef<any> | ComponentType<any> | string,
    obj
  ) {
    this.overlayService.open(content, obj);
  }

  createWorkInstruction = (filePath: string) => {
    const formData = new FormData();
    formData.append('filePath', filePath);
    formData.append('userDetails', localStorage.getItem('loggedInUser'));
    this.importService
      .importFile(
        environment.wiApiUrl,
        'speech-to-text/download-converter',
        formData
      )
      .subscribe(
        (data) => {
          const { progress } = data;
          if (progress === 0) {
            this.bulkUploadDialog(this.bulkUploadComponent, {
              ...data,
              isAudioOrVideoFile: true,
              successUrl: '/work-instructions/files',
              failureUrl: '/work-instructions/files'
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
  };

  saveFile(file, index: number) {
    let { fileName, filePath, originalFileName } = file;
    fileName = fileName.trim();

    if (fileName === originalFileName) {
      this.toastService.show({
        text:
          "File name '" + fileName + "' not modified. Please update and try.",
        type: 'success'
      });
      return;
    }

    const filePathArr = filePath.split('/');
    const fileNameArr = filePathArr[filePathArr.length - 1].split('.');
    fileNameArr[0] = fileName;
    filePathArr[filePathArr.length - 1] = fileNameArr.join('.');
    const newFilePath = filePathArr.join('/');
    const renameFileInfo = {
      filePath,
      newFilePath
    };
    const info: ErrorInfo = {
      displayToast: true,
      failureResponse: 'throwError'
    };
    this.instructionSvc
      .renameFile(renameFileInfo, info)
      .pipe(
        mergeMap((renameFileInfo) =>
          this.instructionSvc
            .getAllInstructionsByFilePath(renameFileInfo.filePath, info)
            .pipe(
              mergeMap((instructions) =>
                from(instructions).pipe(
                  mergeMap((instruction) => {
                    instruction = { ...instruction, FilePath: newFilePath };
                    return this.instructionSvc.updateWorkInstruction(
                      instruction,
                      info
                    );
                  })
                )
              ),
              toArray()
            )
        )
      )
      .subscribe(() => {
        this.editRows[index] = false;
        this.toastService.show({
          text: "File name '" + fileName + "' updated successfully",
          type: 'success'
        });
        this.getAllMediaFiles();
      });
  }

  updateEditRow(index: number) {
    this.cancel?.nativeElement.click();
    this.editRows = this.editRows.map(() => false);
    this.editRows[index] = true;
  }
}
