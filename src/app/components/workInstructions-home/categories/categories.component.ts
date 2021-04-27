import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { HttpClient,HttpErrorResponse,HttpHeaders  } from '@angular/common/http';
import { Base64HelperService } from '../../../shared/base64-helper.service';

@Component({
  selector: 'app-categories',
  templateUrl: 'categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, AfterViewInit, AfterViewChecked {
  p: number = 1;
  count: number = 4;
  config: any = {
    id: 'categories',
    currentPage: 1,
    itemsPerPage: 6,
    directionLinks: false
  };
  @Input() recents;
  @Input() favorites;
  private _searchCriteria: string;
  @Input() set searchCriteria(value: string) {
    this._searchCriteria = value;
  }
  get searchCriteria(): string {
    return this._searchCriteria;
  }
  public categoriesList = [];
  public wiList = [];
  public CatName = '';
  public categoryDetail = {
    CId: '',
    Category_Name: '',
    Drafts_Count: 0,
    Published_Count: 0,
    Cover_Image: ''
  };
  public wiDetail = {
    Category_Id: '',
    WI_Name: '',
    IsFavorite: false,
    CreatedBy: '',
    EditedBy: '',
    Published: false
  };

  public categoryDetailObject = null;
  public workInstructionsDetailObject = null;
  public imageHeight = '';
  private image: ElementRef;
  @ViewChild('image', { static: false }) set content(content: ElementRef) {
    this.image = content;
    if (this.image) {
      this.imageHeight = `${this.image.nativeElement.offsetHeight}px`;
    }
  }
  @HostListener('window:resize')
  onResize() {
    if (this.image) {
      this.imageHeight = `${this.image.nativeElement.offsetHeight}px`;
    }
  }

  constructor(private http: HttpClient, private cdrf: ChangeDetectorRef, private base64HelperService: Base64HelperService) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getAllCategories() {
    this.http.get<any>('http://localhost:3000/categories')
    .subscribe(categories => {
      console.log(categories);
      for (let catCnt = 0; catCnt <= categories.length; catCnt++) {
        this.categoryDetail = {
          CId: '',
          Category_Name: '',
          Drafts_Count: 0,
          Published_Count: 0,
          Cover_Image: ''
        };
        if (categories[catCnt]) {
          const { Cover_Image: coverImage } = categories[catCnt];
          if (coverImage.indexOf('assets') === -1 && !this.base64HelperService.getBase64ImageData(coverImage)) {
            this.base64HelperService.getBase64Image(coverImage);
          }
          this.categoryDetail.Category_Name = categories[catCnt].Category_Name;
          this.categoryDetail.CId = categories[catCnt].Category_Id;
          this.categoryDetail.Cover_Image = categories[catCnt].Cover_Image;
          this.categoriesList.push(this.categoryDetail);
        }
      }
    });
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  ngAfterViewInit(): void {
    this.categoriesList = [...this.categoriesList, {
      "CId": "4d08pHYBr",
      "Category_Name": "Dummy",
      "Drafts_Count": 0,
      "Published_Count": 0,
      "Cover_Image": "assets/img/brand/category-placeholder.png"
    }];
    this.cdrf.detectChanges();
  }

  ngAfterViewChecked(): void {
    if (this.image) {
      this.imageHeight = `${this.image.nativeElement.offsetHeight}px`;
    }
  }

 


  getS3CoverImageStyles = (source: string) => {
    if (source && source.indexOf('assets') > -1) {
      return {};
    } else {
      return {'object-fit': 'cover', 'border-radius': '3px', 'height': this.imageHeight ? this.imageHeight : '100%'};
    }
  }

}
