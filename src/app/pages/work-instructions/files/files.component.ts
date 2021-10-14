import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { InstructionService } from '../services/instruction.service';
import { NgxSpinnerService } from 'ngx-spinner';
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
import { routingUrls } from '../../../app.constants';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})

export class MediaFilesComponent implements OnInit {
  headerTitle = 'Files';
  fileInfo: FileInfo;
  config: any = {
    id: 'files',
    currentPage: 1,
    itemsPerPage: 6,
    directionLinks: false
  };
  search: string;
  order = 'updated_at';
  reverse = true;
  reverseObj: any = { updated_at: true };
  bulkUploadComponent = BulkUploadComponent;
  editRows = [];
  currentRouteUrl$: Observable<string>;
  mediaFiles$: Observable<MediaFile[]>;
  readonly routingUrls = routingUrls;
  @ViewChild('cancel') cancel: ElementRef;

  constructor(private spinner: NgxSpinnerService,
              private _instructionSvc: InstructionService,
              private _toastService: ToastService,
              private errorHandlerService: ErrorHandlerService,
              private importService: ImportService,
              private overlayService: OverlayService,
              private wiCommonService: WiCommonService,
              private commonService: CommonService) { }

  ngOnInit() {
    this.spinner.hide();
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$
      .pipe(
        tap(() => this.commonService.updateHeaderTitle(routingUrls.files.title))
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
    return str.split("/");
  }

  convertDateAndTime(file) {
    let dateAndTime = file.LastModified;

    let getDate = new Date(dateAndTime).toDateString();
    let dateString = getDate.split(" ");
  
    let getTime = new Date(dateAndTime).toTimeString();
    var timeString = getTime.substring(0,9);

    var res = dateString[2] + " " + dateString[1] + " " + dateString[3] + " | " + timeString;
    return res;  
  }

  getAllMediaFiles() {
    this.spinner.show();
    this.mediaFiles$ = this._instructionSvc.getAllFolders('media')
      .pipe(
        mergeMap(folders => {
          this.editRows = new Array(folders.length).fill(false);
          return from(folders)
            .pipe(
              mergeMap(folder => {
                return this._instructionSvc.getAllMediaFiles(folder.Prefix)
              })
            ) 
        }),
        toArray(),
        map(folderFiles => {
          let result: MediaFile[] = [];
          for(let files of folderFiles) {
            const res = files.map(file => {
              const splitFile = this.splitFileFromFolder(file);
              const fileNameWithExtension = splitFile[2];
              const fileName = splitFile[2].split('.').slice(0, -1).join('.');
              const fullFilePath = file.Key;
              const originalFileName = splitFile[2].split('.').slice(0, -1).join('.');
              const updated_at = this.convertDateAndTime(file);
              const fileType = file.MimeType.split('/')[0];
              return { fileNameWithExtension, fileName, fullFilePath, originalFileName, updated_at, fileType };
            });
            result = [...result, ...res];
          }
          this.spinner.hide();
          return result;
        })
      );
  }

  removeFile(el) {
    Swal.fire({
      title: 'Are you sure?',
      html: `You are deleting media file <strong>` + `${el.fileName}` +  `from the repository, this audio/video cannot be played anymore from the Work Instruction!</strong> ?`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#888888',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Delete',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const info: ErrorInfo = { displayToast: true, failureResponse: 'throwError' };
        this.spinner.show();
        this._instructionSvc.deleteFile(el.fullFilePath, info)
          .pipe(
            mergeMap(() => 
              this._instructionSvc.getAllInstructionsByFilePath(el.fullFilePath)
                .pipe(
                  mergeMap(instructions => {
                    return from(instructions)
                      .pipe(
                        mergeMap(instruction => {
                          instruction = { ...instruction, IsAudioOrVideoFileDeleted: true };
                          return this._instructionSvc.updateWorkInstruction(instruction)
                        })
                      )
                  }),
                  toArray()
                )
            )
          ).subscribe(
            () => {
              this.spinner.hide();
              this._toastService.show({
                text: "File name '" + el.fileName + "' has been deleted from S3 repository",
                type: 'success',
              });
              this.getAllMediaFiles();
            },
            () => this.spinner.hide()
          );
        }
    });
  }

  bulkUploadDialog(content: TemplateRef<any> | ComponentType<any> | string, obj) {
    this.overlayService.open(content, obj);
  }

  createWorkInstruction = (filePath: string) => {
    const formData = new FormData();
    formData.append('filePath', filePath);
    formData.append('userDetails', localStorage.getItem('loggedInUser'));
    this.importService.importFile(`${environment.wiApiUrl}speech-to-text/download-converter`, formData)
      .subscribe(
        data => {
          const { progress } = data;
          if (progress === 0) {
            this.spinner.hide();
            this.bulkUploadDialog(this.bulkUploadComponent, { ...data, isAudioOrVideoFile: true, successUrl: '/work-instructions/files', failureUrl: '/work-instructions/files' });
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
  }

  saveFile(file, index: number) {
    let { fileName, fullFilePath, originalFileName } = file;
    fileName = fileName.trim();

    if (fileName === originalFileName) {
      this._toastService.show({
        text: "File name '" + fileName + "' not modified. Please update and try.",
        type: 'success',
      });
      return;
    }

    let filePathArr = fullFilePath.split('/');
    let fileNameArr = filePathArr[filePathArr.length - 1].split('.');
    fileNameArr[0] = fileName;
    filePathArr[filePathArr.length - 1] = fileNameArr.join('.');
    const newFilePath = filePathArr.join('/');
    const renameFileInfo =  {
      filePath: fullFilePath,
      newFilePath
    };
    const info: ErrorInfo = { displayToast: true, failureResponse: 'throwError' };
    this.spinner.show();
    this._instructionSvc.renameFile(renameFileInfo, info)
      .pipe(
        mergeMap(renameFileInfo => 
          this._instructionSvc.getAllInstructionsByFilePath(renameFileInfo.filePath)
            .pipe(
              mergeMap(instructions => {
                return from(instructions)
                  .pipe(
                    mergeMap(instruction => {
                      instruction = { ...instruction, FilePath: newFilePath };
                      return this._instructionSvc.updateWorkInstruction(instruction)
                    })
                  )
              }),
              toArray()
            )
        )
      ).subscribe(
        () => {
          this.editRows[index] = false;
          this.spinner.hide();
          this._toastService.show({
            text: "File name '" + renameFileInfo.newFilePath + "' updated successfully",
            type: 'success',
          });
          this.getAllMediaFiles();
        },
        () => this.spinner.hide()
      );
  }

  updateEditRow(index: number) {
    this.cancel?.nativeElement.click();
    this.editRows = this.editRows.map(() => false);
    this.editRows[index] = true;
  }

}
