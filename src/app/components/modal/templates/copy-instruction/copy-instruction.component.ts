import {Component, OnInit, ViewChild} from '@angular/core';
import {InstructionService} from "../../../workinstructions/instruction.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "../../../../shared/toast";
import { ErrorInfo } from '../../../../interfaces/error-info';
import { Base64HelperService } from '../../../../shared/base64-helper.service';
import { DummyComponent } from '../../../../shared/dummy/dummy.component';


@Component({
  selector: 'app-copy-instruction',
  templateUrl: './copy-instruction.component.html',
  styleUrls: ['./copy-instruction.component.css']
})
export class CopyInstructionComponent implements OnInit {
  public recentsFavorites = 0;
  public search: string;
  public authors = [];
  public CreatedBy: string = '';
  public favIns = [];
  public recentIns = [];
  public recentsAndFavsObject = {
    recents: null,
    favs: null
  };

  public recentsConfig: any = {
    id: 'recents',
    currentPage: 1,
    itemsPerPage: 5,
    directionLinks: false
  };

  public favConfig: any = {
    id: 'favorites',
    currentPage: 1,
    itemsPerPage: 5,
    directionLinks: false
  };

  @ViewChild('recents', { static: false }) set recents(recents: DummyComponent) {
    if (recents) {
      recents.value.map(instruction => {
        const { Cover_Image: coverImage } = instruction;
        if (coverImage.indexOf('assets') === -1 && !this.base64HelperService.getBase64ImageData(coverImage)) {
          this.base64HelperService.getBase64Image(coverImage);
        }
      });
    }
  }

  @ViewChild('favourites', { static: false }) set favourites(favourites: DummyComponent) {
    if (favourites) {
      favourites.value.map(instruction => {
        const { Cover_Image: coverImage } = instruction;
        if (coverImage.indexOf('assets') === -1 && !this.base64HelperService.getBase64ImageData(coverImage)) {
          this.base64HelperService.getBase64Image(coverImage);
        }
      });
    }
  }

  constructor(
              private spinner: NgxSpinnerService,
              private _toastService: ToastService,
              private _instructionSvc: InstructionService,
              private base64HelperService: Base64HelperService) {
  }

  ngOnInit(): void {
    this.filterByAuthors();
    // this.recentsAndFavsObject = this.ref.data;
  }

  filterByAuthors() {
    this._instructionSvc.getUsers().subscribe((users) => {
      this.authors = users.map(user => `${user.first_name} ${user.last_name}`);
    });
  }

  // close() {
  //   this.ref.close();
  // }

  getImageSrc = (source: string) => {
    return source && source.indexOf('assets') > -1 ? source :  this.base64HelperService.getBase64ImageData(source);
  }

  copyInstruction(title) {
    this.spinner.show();
    const userName = JSON.parse(localStorage.getItem("loggedInUser"));
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
    this._instructionSvc.copyWorkInstruction(title, userName, info).subscribe(
      () => {
        // this.ref.close();
        this.spinner.hide();
        this._toastService.show({
            text: "Selected Work instruction has been successfully copied!",
            type: 'success'
        });
      },
      error => {
        this.spinner.hide();
        this._instructionSvc.handleError(error);
      }
    );
  }
}
