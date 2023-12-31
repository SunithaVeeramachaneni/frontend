/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormMetadata } from 'src/app/interfaces';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import {
  getFormMetadata,
  getPagesCount,
  State
} from '../../state/builder/builder-state.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-iphone-for-embedded-forms',
  templateUrl: './iphone-for-embedded-forms.component.html',
  styleUrls: ['./iphone-for-embedded-forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IphoneForEmbeddedFormsComponent implements OnInit {
  @Input() subFormId: any;
  @Input() moduleType: string;
  currentPage = 1;
  formMetadata$: Observable<FormMetadata>;
  formMetadata: FormMetadata;
  constructor(private cdrf: ChangeDetectorRef, private store: Store<State>) {}

  ngOnInit() {
    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap((formMetadata) => {
        this.formMetadata = formMetadata;
      })
    );
  }
}
