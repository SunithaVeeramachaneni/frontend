import {Component, OnInit, ViewChild} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {InstructionService} from '../services/instruction.service';
import Swal from 'sweetalert2';
import {ToastService} from '../../../shared/toast';
import { ErrorInfo } from '../../../interfaces/error-info';
import { Base64HelperService } from '../services/base64-helper.service';
import { DummyComponent } from '../../../shared/components/dummy/dummy.component';

@Component({
  selector: 'app-recents',
  templateUrl: './recents.component.html',
  styleUrls: ['./recents.component.css']
})
export class RecentsComponent implements OnInit {
  headerTitle = 'Recents';
  public recents = [];
  config: any = {
    id: 'recents',
    currentPage: 1,
    itemsPerPage: 6,
    directionLinks: false
  };
  search: string;
  order = 'updated_at';
  reverse = true;
  reverseObj: any = {updated_at: true};
  sortedCollection: any[];
  public authors = [];
  public CreatedBy = '';
  public EditedBy = '';

  @ViewChild('filteredResults', { static: false }) set recentWIs(recents: DummyComponent) {
    if (recents) {
      recents.value.map(instruction => {
        const { Cover_Image: coverImage } = instruction;
        if (coverImage.indexOf('assets') === -1 && !this.base64HelperService.getBase64ImageData(coverImage)) {
          this.base64HelperService.getBase64Image(coverImage);
        }
      });
    }
  }

  constructor(private spinner: NgxSpinnerService,
              private _toastService: ToastService,
              private _instructionSvc: InstructionService,
              private base64HelperService: Base64HelperService) {
  }

  ngOnInit(): void {
    this.getAllRecentInstructions();
    this.AuthorDropDown();
  }

  AuthorDropDown() {
    this._instructionSvc.getUsers().subscribe((users) => {
      this.authors = users.map(user => `${user.first_name} ${user.last_name}`);
    });
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    } else {
      this.order = value;
      this.reverse = false;
    }
    this.reverseObj = {[value]: this.reverse};
  }

  setFav(el) {
    const userName = JSON.parse(localStorage.getItem("loggedInUser"));
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
    this._instructionSvc.setFavoriteInstructions(el.Id, info).subscribe(
      ins => {
        el.IsFavorite = ins.IsFavorite;
        if (userName) {
          el.EditedBy = userName.first_name + " " + userName.last_name;
        }
      },
      error => this._instructionSvc.handleError(error)
    );
  }

  copyWI(ins) {
    console.log(ins);
    this.spinner.show();
    const userName = JSON.parse(localStorage.getItem("loggedInUser"));
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
    this._instructionSvc.copyWorkInstruction(ins.WI_Name, userName, info).subscribe(
      () => {
        this.spinner.hide();
        this._toastService.show({
          text: "Selected work instruction has been successfully copied",
          type: 'success'
        });
        this.getAllRecentInstructions();
      },
      error => {
        this.spinner.hide();
        this._instructionSvc.handleError(error);
      }
    );
  }


  removeWI(el) {
    const instructionType = el.Published ? 'published' : 'drafted';
    Swal.fire({
      title: 'Are you sure?',
      html: `Do you want to delete the work instruction <strong>'${el.WI_Name}'</strong> ?`,
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
              this.getAllRecentInstructions();
              this._toastService.show({
                text: "Work instuction '"+ el.WI_Name +"' has been deleted",
                type: 'success',
              });
            },
            err => {
              this.spinner.hide();
              this._instructionSvc.handleError(err);
            }
          );
      }
    });
  }

  getAllRecentInstructions() {
    this.spinner.show();
    this._instructionSvc.getRecentInstructions()
      .subscribe(
        workInstructions => {
          this.recents = workInstructions;
          this.spinner.hide();
        }
      );
  }

  getImageSrc = (source: string) => {
    return source && source.indexOf('assets') > -1 ? source : this.base64HelperService.getBase64ImageData(source);
  }
}
