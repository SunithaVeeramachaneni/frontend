import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {MyOverlayRef} from '../../myoverlay-ref';
import {FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, FormControl} from '@angular/forms';
import {NgxSpinnerService} from "ngx-spinner";
import {COVER_IMAGES} from "../../constants";
import {InstructionService} from '../../../services/instruction.service';
import Swal from 'sweetalert2';
import {CategoryService} from '../../../services/category.service';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { ErrorInfo } from '../../../../../interfaces';
import { Base64HelperService } from '../../../services/base64-helper.service';
import { ErrorHandlerService } from '../../../../../shared/error-handler/error-handler.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})

export class CategoryComponent implements OnInit, AfterViewInit {
  public files = [];
  public title = '';
  public categoryValidatedMsg = '';
  frmSubscribe: FormGroup;
  readonly coverImages = COVER_IMAGES;
  imageHeight = '';
  @ViewChild('image', {static: false}) image: ElementRef;
  @ViewChild('CatName') private elementRef: ElementRef;

  @HostListener('window:resize')
  onResize() {
    this.imageHeight = `${this.image.nativeElement.offsetHeight}px`;
  }

  constructor(private fb: FormBuilder,
              private ref: MyOverlayRef,
              private spinner: NgxSpinnerService,
              private _instructionSvc: InstructionService,
              private categoryService: CategoryService,
              private base64HelperService: Base64HelperService,
              private errorHandlerService: ErrorHandlerService) {
  }

  ngOnInit() {
    this.frmSubscribe = this.fb.group({
      cid: new FormControl(''),
      title: new FormControl('', [
        Validators.required, Validators.minLength(3), Validators.maxLength(48)], this.validateCategoryName.bind(this)),
      coverImage: new FormControl(this.coverImages[0])
    });
    const {CId: cid, Category_Name: title, Cover_Image: coverImage} = this.ref.data;
    this.categoryValidatedMsg = '';

    if (cid) {
      this.title = 'Edit Category';
      this.files = coverImage && coverImage.indexOf('assets') > -1 ? this.files : [coverImage];
      this.frmSubscribe.setValue({cid, title, coverImage});
    } else {
      this.title = 'Add New Category';
    }

    this.frmSubscribe.get('coverImage').valueChanges.subscribe(val => {
      const [coverImg] = this.files;
      if (coverImg && val !== coverImg) {
        this.frmSubscribe.patchValue({coverImage: coverImg});
      }
    });
  }

  ngAfterViewInit(): void {
    this.imageHeight = `${this.image.nativeElement.offsetHeight}px`;
    this.elementRef.nativeElement.focus();
  }

  get f() {
    return this.frmSubscribe.controls;
  }

  uploadFile(files: FileList) {
    if (this.files.length) {
      this.categoryService.setDeleteFiles(this.files[0]);
    }
    this.spinner.show();
    const file = files[0];
    const imageForm = new FormData();
    imageForm.append('image', file);
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };

    this._instructionSvc.uploadAttachments(imageForm, info).subscribe(
      resp => {
        const {image: uploadedImage} = resp;
        this.files = [uploadedImage];
        this.base64HelperService.getBase64Image(uploadedImage);
        this.categoryService.setDeleteFiles(uploadedImage);
        this.frmSubscribe.patchValue({coverImage: uploadedImage});
      },
      error => {
        Swal.fire("Sorry", this.errorHandlerService.getErrorMessage(error), 'error');
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  deleteAttachment(index: number) {
    this.categoryService.setDeleteFiles(this.files[index]);
    this.files.splice(index, 1);
    this.frmSubscribe.patchValue({coverImage: this.coverImages[0]});
  }

  onSubmit() {
    if (this.frmSubscribe.invalid) {
      return;
    }

    if (this.ref.data.Category_Name === this.frmSubscribe.value.title && this.ref.data.Cover_Image === this.frmSubscribe.value.coverImage) {
      this.categoryValidatedMsg = 'No changes made to the Category!';
    } else if (this.ref.data.Category_Name === this.frmSubscribe.value.title ||
      this.ref.data.Cover_Image === this.frmSubscribe.value.coverImage) {
      this.categoryValidatedMsg = '';
      this.ref.close(this.frmSubscribe.value);
    } else {
      this.ref.close(this.frmSubscribe.value);
    }
  }

  cancel() {
    this.ref.close(null);
  }

  getImageSrc = (source: string) => {
    return this.base64HelperService.getBase64ImageData(source);
  }

  getS3CoverImageHeight = () => {
    return {'height': this.imageHeight ? this.imageHeight : '100%'};
  }

  validateCategoryName({value}: AbstractControl): Observable<ValidationErrors | null> {
    return this._instructionSvc.getCategoriesByName(value)
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((categories) => {
          if (value !== this.ref.data.Category_Name && categories.length) {
            return {categoryNameExists: true};
          }
          return null;
        })
      );
  }
}
