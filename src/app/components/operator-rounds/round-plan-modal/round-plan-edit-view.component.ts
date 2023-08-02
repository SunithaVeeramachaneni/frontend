import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { RoundPlanModalComponent } from './round-plan-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state/app.state';
import {
  BuilderConfigurationActions,
  HierarchyActions
} from 'src/app/forms/state/actions';
import { ActivatedRoute } from '@angular/router';
import { getFormMetadata } from 'src/app/forms/state';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { FormService } from 'src/app/forms/services/form.service';

@Component({
  selector: 'app-round-plan-view',
  template: ``,
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundPlanEditViewComponent implements OnInit, OnDestroy {
  formMetadata: any;
  selectedNode: any;
  selectedNodeInstances: any[];
  selectedNode$: Observable<any>;
  selectedNodeLoadStatus = false;
  roundMetaDataSubscription: Subscription;
  selectedNodeSubscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private store: Store<State>,
    private route: ActivatedRoute,
    private operatorRoundsService: OperatorRoundsService,
    private formService: FormService,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.selectedNodeSubscription =
      this.operatorRoundsService.selectedNode$.subscribe((data) => {
        if (data && Object.keys(data).length) {
          this.selectedNode = data;
          this.selectedNodeLoadStatus = true;
          this.selectedNodeInstances =
            this.formService.getInstanceIdMappingsByUid(this.selectedNode.uid);
          this.cdrf.detectChanges();
          this.store.dispatch(
            BuilderConfigurationActions.initPage({
              subFormId: this.selectedNode.id
            })
          );
        } else {
          this.selectedNode = null;
          this.selectedNodeInstances = [];
          this.cdrf.detectChanges();
        }
      });

    this.route.data.subscribe((data) => {
      const { formConfigurationState, hierarchyState } = data.form || {};

      if (hierarchyState && Object.keys(hierarchyState).length) {
        const { selectedHierarchy } = hierarchyState;
        this.store.dispatch(
          HierarchyActions.updateSelectedHierarchyList({
            selectedHierarchy
          })
        );
      }

      if (
        formConfigurationState &&
        Object.keys(formConfigurationState).length
      ) {
        this.store.dispatch(
          BuilderConfigurationActions.updateFormConfiguration({
            formConfiguration: formConfigurationState
          })
        );

        if (this.selectedNode && this.selectedNode.id) {
          const subFormsObj = {};
          let formKeys = Object.keys(formConfigurationState);
          formKeys = formKeys.filter((k) => k.startsWith('pages_'));
          formKeys.forEach((key) => {
            subFormsObj[key] = formConfigurationState[key];
          });

          Object.keys(subFormsObj).forEach((subForm) => {
            subFormsObj[subForm].forEach((page, index) => {
              if (index === 0) {
                this.store.dispatch(
                  BuilderConfigurationActions.updatePageState({
                    pageIndex: index,
                    isOpen: false,
                    subFormId: this.selectedNode.id
                  })
                );
                this.store.dispatch(
                  BuilderConfigurationActions.updatePageState({
                    pageIndex: index,
                    isOpen: true,
                    subFormId: this.selectedNode.id
                  })
                );
              } else {
                this.store.dispatch(
                  BuilderConfigurationActions.updatePageState({
                    pageIndex: index,
                    isOpen: false,
                    subFormId: this.selectedNode.id
                  })
                );
              }
            });
          });
        }
      }
    });

    this.roundMetaDataSubscription = this.store
      .select(getFormMetadata)
      .subscribe((data) => {
        this.formMetadata = data;
      });

    this.dialog.open(RoundPlanModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: this.formMetadata
    });
  }

  ngOnDestroy() {
    this.roundMetaDataSubscription.unsubscribe();
    this.selectedNodeSubscription.unsubscribe();
  }
}