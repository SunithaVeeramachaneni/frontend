import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { InstructionService } from '../services/instruction.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../../shared/toast';
import { ActivatedRoute } from '@angular/router';
import { ErrorInfo } from '../../../interfaces';
import { FileInfo } from '../../../interfaces';
import { Base64HelperService } from '../services/base64-helper.service';
import { DummyComponent } from '../../../shared/components/dummy/dummy.component';
import { ErrorHandlerService } from '../../../shared/error-handler/error-handler.service';
import { ImportService } from '../services/import.service';
import { environment } from '../../../../environments/environment';
import { OverlayService } from '../modal/overlay.service';
import { ComponentType } from '@angular/cdk/portal';
import { BulkUploadComponent } from '../modal/templates/bulk-upload/bulk-upload.component';
import { WiCommonService } from '../services/wi-common.services';
import { mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})

export class MediaFilesComponent implements OnInit {
  headerTitle = 'Files';
  fileInfo: FileInfo;
  public wiMediaFiles = [];
  public mediaFile = {
    fileNameWithExtension: '',
    fileName: '',
    updated_at: '',
    fullFilePath:'',
    originalFileName: ''
  }
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

  @ViewChild('filteredResults', { static: false }) set files(files: DummyComponent) {
    if (files) {
      /* files.value.map(file => {
        const { Cover_Image: coverImage } = file;
        if (coverImage.indexOf('assets') === -1 && !this.base64HelperService.getBase64ImageData(coverImage)) {
          this.base64HelperService.getBase64Image(coverImage);
        }
      }); */
    }
  }

  constructor(private spinner: NgxSpinnerService,
              private _instructionSvc: InstructionService,
              private _toastService: ToastService,
              private route: ActivatedRoute,
              private base64HelperService: Base64HelperService,
              private errorHandlerService: ErrorHandlerService,
              private importService: ImportService,
              private overlayService: OverlayService,
              private wiCommonService: WiCommonService) { }

  ngOnInit() {
    this.getAllMediaFiles();
    this.route.queryParamMap.subscribe(params => {
      this.search = params.get('search');
    });
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

  getFileTypeAndPath(file) {
    var str = file.Key;
    var res = { 'filePath': str, 'fileType' : 'audio'};
    return res;
  }

  splitFileFromFolder(file) {
    var str = file.Key;
    var res = str.split("/");
    return res;
  }

  convertDateAndTime(dateAndTime) {
    let dt = dateAndTime.substring(0, 8)   // Returns "Date"
    let time = dateAndTime.substring(8)   // Returns "Time"
    let hours = dateAndTime.substring(8,10);
    let mins = dateAndTime.substring(10,12);
    let secs = dateAndTime.substring(12,14);
    let timeForm = hours + ':' + mins + ':' + secs;

    let year = dt.substr(0, 4);
    let month = dt.substr(4, 2);
    let day = dt.substr(6, 2);
    let dateForm = month + '-' + day + '-' + year
    let monthAndYr = new Date(dateForm).toLocaleString('en-us', { month: 'short', year: 'numeric' });
    //return day + ' ' + monthAndYr;
    return day + ' ' + monthAndYr + ' | ' + timeForm;
  }

  fullPath(file){
    var res = file.Key;
    return res;
  }


  getAllMediaFiles() {
    this.wiMediaFiles = [];
    this.spinner.show();
    this._instructionSvc.getAllFolders()
      .subscribe(
        folders => {
          this.editRows = new Array(folders.length).fill(false);
          folders.forEach(folder => {
          this._instructionSvc.getAllMediaFiles(folder).subscribe(
              files => {
                files.forEach(file => {
                  this.fileInfo = this.getFileTypeAndPath(file);
                  console.log(this.fileInfo);
                  let fullPath = this.fullPath(file);
                  let splitFile = this.splitFileFromFolder(file);
                  this.mediaFile.fullFilePath = fullPath;
                  this.mediaFile.fileNameWithExtension = splitFile[2];
                  this.mediaFile.fileName = splitFile[2].split('.').slice(0, -1).join('.');
                  this.mediaFile.originalFileName = splitFile[2].split('.').slice(0, -1).join('.');
                  this.mediaFile.updated_at = this.convertDateAndTime(splitFile[1]);
                  this.wiMediaFiles.push(this.mediaFile);
                  this.mediaFile = {
                    fileNameWithExtension:'',
                    fileName: '',
                    updated_at: '',
                    fullFilePath:'',
                    originalFileName: ''
                  }
                });
              });
          });
          this.spinner.hide();
        });
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
        this.spinner.show();
        const info: ErrorInfo = { displayToast: true, failureResponse: 'throwError' };
        
        this._instructionSvc.deleteFiles({ files: [el.fullFilePath] }, info)
          .pipe(
            mergeMap(() => 
              this._instructionSvc.getAllInstructionsByFilePath(el.fullFilePath, info)
                .pipe(
                  mergeMap(instructions =>
                    from(instructions)
                      .pipe(
                        mergeMap(instruction => {
                          instruction = { ...instruction, IsAudioOrVideoFileDeleted: true };
                          return this._instructionSvc.updateWorkInstruction(instruction, info)
                        })
                      )
                  )
                )
            )
          ).subscribe(
            () => {
              this.spinner.hide();
              this._toastService.show({
                text: "File name " + el.fileName + "' has been deleted from S3 repository",
                type: 'success',
              });
              this.wiMediaFiles = this.wiMediaFiles.filter(mediaFile => mediaFile.fullFilePath !== el.fullFilePath);
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
          this.wiCommonService.updateUploadInfo({ message: this.errorHandlerService.getErrorMessage(error), progress: 100, isError: true });
          this.errorHandlerService.handleError(error)
          this.importService.closeConnection();
        }
      );
  }

  saveFile(file, index: number) {
    const { fileName, fullFilePath, originalFileName } = file;

    if (fileName === originalFileName) {
      this._toastService.show({
        text: "File name" + fileName + "' not modified. Please update and try.",
        type: 'success',
      });
      return;
    }

    let filePathArr = fullFilePath.split('/');
    let fileNameArr = filePathArr[filePathArr.length - 1].split('.');
    fileNameArr[0] = fileName;
    filePathArr[filePathArr.length - 1] = fileNameArr.join('.');
    const newFilePath = filePathArr.join('/');
    const updateFileInfo =  {
      filePath: fullFilePath,
      newFilePath
    };
    const info: ErrorInfo = { displayToast: true, failureResponse: 'throwError' };

    this.spinner.show();
    this._instructionSvc.updateFile(updateFileInfo, info)
      .pipe(
        mergeMap(updateFileInfo => 
          this._instructionSvc.getAllInstructionsByFilePath(updateFileInfo.filePath, info)
            .pipe(
              mergeMap(instructions => 
                from(instructions)
                  .pipe(
                    mergeMap(instruction => {
                      instruction = { ...instruction, FilePath: newFilePath };
                      return this._instructionSvc.updateWorkInstruction(instruction, info)
                    })
                  )
              )
            )
        )
      ).subscribe(
        () => {
          this.editRows[index] = false;
          this.spinner.hide();
          this._toastService.show({
            text: "File name" + updateFileInfo.newFilePath + "' updated successfully",
            type: 'success',
          });
          this.wiMediaFiles = this.wiMediaFiles.map(mediaFile => {
            if (mediaFile.fullFilePath === fullFilePath) {
              let { fileName, fullFilePath, originalFileName } = mediaFile;
              fullFilePath = fullFilePath.replace(originalFileName, fileName);
              return { ...mediaFile, fullFilePath, originalFileName: fileName };
            } else {
              return mediaFile
            }
          });
        },
        () => this.spinner.hide()
      );
  }

  updateEditRow(index: number) {
    this.editRows = this.editRows.map(() => false);
    this.editRows[index] = true;
  }

}
