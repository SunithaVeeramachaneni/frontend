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
    fullFilePath:''
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
  public bulkUploadComponent = BulkUploadComponent;
 

  @ViewChild('filteredResults', { static: false }) set files(files: DummyComponent) {
    if (files) {
      files.value.map(file => {
        const { Cover_Image: coverImage } = file;
        if (coverImage.indexOf('assets') === -1 && !this.base64HelperService.getBase64ImageData(coverImage)) {
          this.base64HelperService.getBase64Image(coverImage);
        }
      });
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
                  this.mediaFile.fileName = splitFile[2].substring(0, splitFile[2].indexOf('.'));
                  this.mediaFile.updated_at = this.convertDateAndTime(splitFile[1]);
                  this.wiMediaFiles.push(this.mediaFile);
                  this.mediaFile = {
                    fileNameWithExtension:'',
                    fileName: '',
                    updated_at: '',
                    fullFilePath:''
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
        const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
        const filesTobeDeleted =  {
          files: []
        };
        console.log(el.fullFilePath);
        filesTobeDeleted.files.push(el.fullFilePath);
        console.log(filesTobeDeleted.files);
        this._instructionSvc.deleteFiles(filesTobeDeleted, info)
          .subscribe(
            data => {
              this.spinner.hide();
              this.getAllMediaFiles();
              this._toastService.show({
                text: "File" + el.fileName + "' has been deleted from S3 repository",
                type: 'success',
              });
            },
            err => {
              this.spinner.hide();
              this.errorHandlerService.handleError(err);
            }
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
          this.wiCommonService.updateUploadInfo({ message: error.message, progress: 100, isError: true });
          this.errorHandlerService.handleError(error)
          this.importService.closeConnection();
        }
      );
  }

}
