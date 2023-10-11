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
import { QuestionInstructionMediaMap } from 'src/app/interfaces';

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
        data.form.pages = data.form.pages.map((page) => {
          let questionInstructionMediaMap: QuestionInstructionMediaMap[] = [];
          page.questions.forEach((question) => {
            questionInstructionMediaMap.push({
              questionId: question.id,
              instructionsMedia: {}
            });
          });
          page.questionInstructionMediaMap = questionInstructionMediaMap;
          return page;
        });
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
                subFormId: null,
                isCollapse: true
              })
            );
            this.store.dispatch(
              BuilderConfigurationActions.updatePageState({
                pageIndex: index,
                isOpen: true,
                subFormId: null,
                isCollapse: true
              })
            );
          } else {
            this.store.dispatch(
              BuilderConfigurationActions.updatePageState({
                pageIndex: index,
                isOpen: false,
                subFormId: null,
                isCollapse: true
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
      disableClose: true,
      data: {
        formData: this.formMetadata,
        formType: this.formMetadata.formType,
        type: 'edit'
      }
    });
  }

  ngOnDestroy() {
    this.formMetaDataSubscription.unsubscribe();
  }
}
