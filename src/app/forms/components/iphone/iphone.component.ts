import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormMetadata } from 'src/app/interfaces';
import {
  getFormMetadata,
  getPagesCount,
  State,
  getModuleName
} from '../../state/builder/builder-state.selectors';

@Component({
  selector: 'app-iphone',
  templateUrl: './iphone.component.html',
  styleUrls: ['./iphone.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IphoneComponent implements OnInit {
  @Input() subFormId: any;
  @Input() moduleType: string;
  @Input() assetLocationName: string;

  formMetadata$: Observable<FormMetadata>;
  pagesCount$: Observable<number>;
  formMetadata: FormMetadata;
  currentPage = 1;
  totalPages = 0;
  currentTime;
  isOpenBottomSheet = false;
  isHistoryVisible = false;
  isOpenHistoryBottomSheet = false;
  historyCount = '5';
  historyRecords = Array(5).fill(0);
  historyTableHeaders = [
    { id: 'iphoneDateLabel', translate: 'dateLabel' },
    { id: 'iphoneReadingLabel', translate: 'readingLabel' },
    { id: 'iphoneOperator', translate: 'operator' }
  ];
  moduleName$: Observable<string>;

  constructor(private store: Store<State>) {}

  changePageCount(pages) {
    this.totalPages = Number(pages);
    if (!(this.currentPage >= 1 && this.currentPage <= this.totalPages)) {
      this.currentPage = 1;
    }
  }

  ngOnInit(): void {
    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap((formMetadata) => {
        this.formMetadata = formMetadata;
      })
    );

    this.pagesCount$ = this.store.select(getPagesCount(this.subFormId)).pipe(
      tap((res) => {
        this.totalPages = res;
        this.currentPage = Math.min(this.currentPage, this.totalPages);
      })
    );
    this.getTime();

    this.moduleName$ = this.store.select(getModuleName);
  }

  getTime() {
    const d = new Date();
    this.currentTime = '' + d.getHours() + ':' + d.getMinutes();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  openBottomSheet(isOpenBottomSheet) {
    this.isOpenBottomSheet = isOpenBottomSheet.isOpen;
    this.isHistoryVisible = isOpenBottomSheet.isHistoryVisible;
    this.historyCount = isOpenBottomSheet?.historyCount?.toString();
  }

  closeBottomSheet() {
    this.isOpenBottomSheet = false;
  }

  openHistoryBottomSheet() {
    this.closeBottomSheet();
    this.isOpenHistoryBottomSheet = true;
  }

  closeHistoryBottomSheet() {
    this.isOpenHistoryBottomSheet = false;
  }
}
