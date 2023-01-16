import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormMetadata } from 'src/app/interfaces';
import { getFormMetadata, getPagesCount, State } from '../../state';

@Component({
  selector: 'app-iphone',
  templateUrl: './iphone.component.html',
  styleUrls: ['./iphone.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IphoneComponent implements OnInit {
  formMetadata$: Observable<FormMetadata>;
  pagesCount$: Observable<number>;
  formMetadata: FormMetadata;
  currentPage = 1;
  totalPages = 0;

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap((formMetadata) => {
        this.formMetadata = formMetadata;
      })
    );

    this.pagesCount$ = this.store.select(getPagesCount);
    this.pagesCount$.subscribe((res) => {
      this.totalPages = res;
    })
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
}
