import { Component, OnInit, ViewChild } from '@angular/core';
import { MyOverlayRef } from '../../myoverlay-ref';
import { InstructionService } from '../../../services/instruction.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../../../../shared/toast';
import { ErrorInfo } from '../../../../../interfaces';
import { Base64HelperService } from '../../../services/base64-helper.service';
import { DummyComponent } from '../../../../../shared/components/dummy/dummy.component';
import { ErrorHandlerService } from '../../../../../shared/error-handler/error-handler.service';

@Component({
  selector: 'app-copy-instruction',
  templateUrl: './copy-instruction.component.html',
  styleUrls: ['./copy-instruction.component.scss']
})
export class CopyInstructionComponent implements OnInit {
  public recentsFavorites = 0;
  public search: string;
  public authors = [];
  public createdBy = '';
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

  @ViewChild('recents', { static: false }) set recents(
    recents: DummyComponent
  ) {
    if (recents) {
      recents.value.forEach((instruction) => {
        const { Cover_Image: coverImage, Id: path } = instruction;
        if (
          coverImage.indexOf('assets/') === -1 &&
          !this.base64HelperService.getBase64ImageData(coverImage, path)
        ) {
          this.base64HelperService.getBase64Image(coverImage, path);
        }
      });
    }
  }

  @ViewChild('favourites', { static: false }) set favourites(
    favourites: DummyComponent
  ) {
    if (favourites) {
      favourites.value.forEach((instruction) => {
        const { Cover_Image: coverImage, Id: path } = instruction;
        if (
          coverImage.indexOf('assets/') === -1 &&
          !this.base64HelperService.getBase64ImageData(coverImage, path)
        ) {
          this.base64HelperService.getBase64Image(coverImage, path);
        }
      });
    }
  }

  constructor(
    public ref: MyOverlayRef,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private instructionSvc: InstructionService,
    private base64HelperService: Base64HelperService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.filterByAuthors();
    this.recentsAndFavsObject = this.ref.data;
  }

  filterByAuthors() {
    this.instructionSvc.getUsers().subscribe((users) => {
      this.authors = users.map(
        (user) => `${user.first_name} ${user.last_name}`
      );
    });
  }

  cancel() {
    this.ref.close();
  }

  getImageSrc = (source: string, path: string) =>
    source && source.indexOf('assets/') > -1
      ? source
      : this.base64HelperService.getBase64ImageData(source, path);

  copyInstruction(title) {
    this.spinner.show();
    const userName = JSON.parse(localStorage.getItem('loggedInUser'));
    const info: ErrorInfo = {
      displayToast: false,
      failureResponse: 'throwError'
    };
    this.instructionSvc.copyWorkInstruction(title, userName, info).subscribe(
      () => {
        this.ref.close();
        this.spinner.hide();
        this.toastService.show({
          text: 'Selected work instruction has been successfully copied',
          type: 'success'
        });
      },
      (error) => {
        this.spinner.hide();
        this.errorHandlerService.handleError(error);
      }
    );
  }
}
