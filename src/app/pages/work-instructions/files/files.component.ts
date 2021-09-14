import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { InstructionService } from '../services/instruction.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../../shared/toast';
import { ActivatedRoute } from '@angular/router';
import { ErrorInfo } from '../../../interfaces';
import { Base64HelperService } from '../services/base64-helper.service';
import { DummyComponent } from '../../../shared/components/dummy/dummy.component';
import { ErrorHandlerService } from '../../../shared/error-handler/error-handler.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})

export class MediaFilesComponent implements OnInit {
  headerTitle = 'Files';
  public wiMediaFiles = [];
  public mediaFile = {
    fileName: '',
    updated_at: ''
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
    private errorHandlerService: ErrorHandlerService) { }

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

  removeFile(el) {
    Swal.fire({
      title: 'Are you sure?',
      html: `Do you want to delete the media file <strong>'${el.fileName}'</strong> ?`,
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
        this._instructionSvc.deleteWorkInstruction$(el.Id, info)
          .subscribe(
            data => {
              this.spinner.hide();
              this.getAllMediaFiles();
              this._toastService.show({
                text: "Work instuction '" + el.WI_Name + "' has been deleted",
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
                  let splitFile = this.splitFileFromFolder(file)

                  this.mediaFile.fileName = splitFile[2];
                  this.mediaFile.updated_at = this.convertDateAndTime(splitFile[1]);
                  this.wiMediaFiles.push(this.mediaFile);
                  this.mediaFile = {
                    fileName: '',
                    updated_at: ''
                  }
                });
              });
          });
          this.spinner.hide();
        });
  }



}
