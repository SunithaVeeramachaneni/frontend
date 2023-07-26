import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormModalComponent } from './form-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { State, getFormMetadata } from 'src/app/forms/state';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-edit-view',
  template: ``,
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormEditViewComponent implements OnInit, OnDestroy {
  formMetadata;
  formMetaDataSubscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private store: Store<State>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      if (data.form && Object.keys(data.form).length) {
        this.store.dispatch(
          BuilderConfigurationActions.updateFormConfiguration({
            formConfiguration: data.form
          })
        );

        data.form.pages.forEach((page, index) => {
          if (index === 0) {
            this.store.dispatch(
              BuilderConfigurationActions.updatePageState({
                pageIndex: index,
                isOpen: false,
                subFormId: null
              })
            );
            this.store.dispatch(
              BuilderConfigurationActions.updatePageState({
                pageIndex: index,
                isOpen: true,
                subFormId: null
              })
            );
          } else {
            this.store.dispatch(
              BuilderConfigurationActions.updatePageState({
                pageIndex: index,
                isOpen: false,
                subFormId: null
              })
            );
          }
        });
      }
    });

    this.formMetaDataSubscription = this.store
      .select(getFormMetadata)
      .subscribe((data) => {
        this.formMetadata = data;
      });

    this.dialog.open(FormModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: {
        formData: this.formMetadata,
        type: 'edit'
      }
    });
  }

  ngOnDestroy() {
    this.formMetaDataSubscription.unsubscribe();
  }
}
