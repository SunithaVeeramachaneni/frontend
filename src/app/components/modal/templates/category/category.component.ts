import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild,Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, FormControl} from '@angular/forms';
import {NgxSpinnerService} from "ngx-spinner";
import {COVER_IMAGES} from "../../constants";
import Swal from 'sweetalert2';
import {CategoryService} from '../../../workInstructions-home/categories/category.service';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { ErrorInfo } from '../../../../interfaces/error-info';
import { Base64HelperService } from '../../../../shared/base64-helper.service';

import { ModalController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { HttpClient,HttpErrorResponse,HttpHeaders  } from '@angular/common/http';

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
  @Input() CId : any;
  @Input() Category_Name : any;
  @Input() Cover_Image : any;

  constructor(private fb: FormBuilder,
              private spinner: NgxSpinnerService,
              private categoryService: CategoryService,
              private base64HelperService: Base64HelperService,
              public navCtrl: NavController,
              private modalCtrl: ModalController,private http: HttpClient,) {
  }



  dismissModal(){
    this.modalCtrl.dismiss(null,"cancel");
  }

  ngOnInit() {
    console.log(this.Category_Name)
    this.frmSubscribe = this.fb.group({
      cid: new FormControl(this.CId),
      title: new FormControl(this.Category_Name, [
        Validators.required, Validators.minLength(3), Validators.maxLength(48)]),
      coverImage: new FormControl(this.Cover_Image)
    });
    const {CId: cid} = this.CId;
    const {Category_Name: title} = this.Category_Name;
    const {Cover_Image: coverImage} = this.Cover_Image;
    this.categoryValidatedMsg = '';

    if (this.CId) {
      this.title = 'Edit Category';
      // this.files = coverImage && coverImage.indexOf('assets') > -1 ? this.files : [coverImage];
      // this.frmSubscribe.setValue({cid, title, coverImage});
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
      return;
    }
    this.spinner.show();
    const file = files[0];
    const imageForm = new FormData();
    imageForm.append('image', file);
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };

    // this._instructionSvc.uploadAttachments(imageForm, info).subscribe(
    //   resp => {
    //     const {image: uploadedImage} = resp;
    //     this.files = [uploadedImage];
    //     this.base64HelperService.getBase64Image(uploadedImage);
    //     this.categoryService.setDeleteFiles(uploadedImage);
    //     this.frmSubscribe.patchValue({coverImage: uploadedImage});
    //   },
    //   error => {
    //     Swal.fire("Sorry", this._instructionSvc.getErrorMessage(error), 'error');
    //     this.spinner.hide();
    //   },
    //   () => {
    //     this.spinner.hide();
    //   }
    // );
  }

  deleteAttachment(index: number) {
    this.categoryService.setDeleteFiles(this.files[index]);
    this.files.splice(index, 1);
    this.frmSubscribe.patchValue({coverImage: this.coverImages[0]});
  }

  onSubmit() {
    console.log("working")
    console.log(this.CId)
    if (this.frmSubscribe.invalid) {
      return;
    }

    else if(this.CId){
      const category = {
        "Category_Name": this.frmSubscribe.value.title,
        "Cover_Image": this.frmSubscribe.value.coverImage,
      };
      this.http.put(`http://localhost:3000/updateCategory/${this.CId}`, category)
      .subscribe(data => {
        console.log(data);
        this.dismissModal();
        this.http.get("http://localhost:3000/categories").subscribe(data=> {
          console.log(data);
        })
       }, error => {
        console.log(error);
      })
    }

    else {
      const category = {
        "Category_Name": this.frmSubscribe.value.title,
        "Cover_Image": this.frmSubscribe.value.coverImage,
      };
      this.http.post("http://localhost:3000/addCategory", category)
      .subscribe(data => {
        console.log(data);
        this.dismissModal();
        this.http.get("http://localhost:3000/categories").subscribe(data=> {
          console.log(data);
        })
       }, error => {
        console.log(error);
      })
    }
  }

  getImageSrc = (source: string) => {
    return this.base64HelperService.getBase64ImageData(source);
  }

  getS3CoverImageHeight = () => {
    return {'height': this.imageHeight ? this.imageHeight : '100%'};
  }

  // validateCategoryName({value}: AbstractControl): Observable<ValidationErrors | null> {
  //   return this._instructionSvc.getCategoriesByName(value)
  //     .pipe(
  //       debounceTime(500),
  //       distinctUntilChanged(),
  //       map((categories) => {
  //         if (value !== this.ref.data.Category_Name && categories.length) {
  //           return {categoryNameExists: true};
  //         }
  //         return null;
  //       })
  //     );
  // }
}
