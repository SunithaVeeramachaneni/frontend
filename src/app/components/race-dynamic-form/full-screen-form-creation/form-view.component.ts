import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FullScreenFormCreationComponent } from '../full-screen-form-creation/full-screen-form-creation.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { State, getFormMetadata } from 'src/app/forms/state';
import { BuilderConfigurationActions } from 'src/app/forms/state/actions';

@Component({
  selector: 'app-form-view',
  template: ``,
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormViewComponent implements OnInit {
  formMetadata;

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

    this.route.params.subscribe((params) => {
      if (!params.id) {
        if (window.history.state.selectedTemplate) {
          this.store.dispatch(
            BuilderConfigurationActions.replacePagesAndCounter({
              pages: JSON.parse(
                window.history.state.selectedTemplate
                  .authoredFormTemplateDetails[0].pages
              ),
              counter: window.history.state.selectedTemplate.counter
            })
          );
        } else {
          this.store.select(getFormMetadata).subscribe((data) => {
            this.formMetadata = data;
          });
        }
      }
    });

    this.dialog.open(FullScreenFormCreationComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: this.formMetadata
    });
  }
}
