import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  EventEmitter,
  Output
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { LoginService } from 'src/app/components/login/services/login.service';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of, combineLatest, Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  takeUntil,
  tap
} from 'rxjs/operators';

import { isEqual } from 'lodash-es';
import {
  FormMetadata,
  Page,
  ValidationError,
  HierarchyEntity
} from 'src/app/interfaces';

import {
  getFormMetadata,
  getFormDetails,
  getCreateOrEditForm,
  getFormSaveStatus,
  getFormPublishStatus,
  getIsFormCreated,
  getQuestionCounter,
  State,
  getNodeWiseQuestionsCount
} from 'src/app/forms/state/builder/builder-state.selectors';

import {
  BuilderConfigurationActions,
  GlobalResponseActions,
  HierarchyActions,
  QuickResponseActions,
  RoundPlanConfigurationActions,
  UnitOfMeasurementActions
} from 'src/app/forms/state/actions';
import { HeaderService } from 'src/app/shared/services/header.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ActivatedRoute, Router } from '@angular/router';
import { formConfigurationStatus } from 'src/app/app.constants';
import { MatDialog } from '@angular/material/dialog';
import { ImportTaskModalComponent } from '../import-task-modal/import-task-modal.component';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { FormService } from 'src/app/forms/services/form.service';
import { getSelectedHierarchyList } from 'src/app/forms/state';
import { HierarchyModalComponent } from 'src/app/forms/components/hierarchy-modal/hierarchy-modal.component';
@Component({
  selector: 'app-round-plan-configuration',
  templateUrl: './round-plan-configuration.component.html',
  styleUrls: ['./round-plan-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('previewSlide', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [animate('100ms ease-out', style({ opacity: 0 }))])
    ])
  ]
})
export class RoundPlanConfigurationComponent implements OnInit, OnDestroy {
  @ViewChild('name') formName: ElementRef;
  @Output() gotoNextStep = new EventEmitter<void>();
  public openAppSider$: Observable<any>;
  formConfiguration: FormGroup;
  formMetadata$: Observable<FormMetadata>;
  pages$: Observable<Page[]>;
  formDetails$: Observable<any>;
  authoredFormDetail$: Observable<any>;
  createOrEditForm$: Observable<boolean>;
  isDataResolved$: Observable<any>;
  formSaveStatus$: Observable<string>;
  formDetailPublishStatus$: Observable<string>;
  isFormCreated$: Observable<boolean>;
  questionCounter$: Observable<number>;
  formStatus: string;
  formDetailPublishStatus: string;
  isFormDetailPublished: string;
  formMetadata: FormMetadata;
  formListVersion: number;
  errors: ValidationError = {};
  formDetails: any;
  selectedHierarchyList: any;
  selectedFormName: string;
  selectedFormData: any;
  currentFormData: any;

  selectedNode: any;
  hierarchyMode$: Observable<any>;
  hierarchyMode: 'asset_hierarchy';
  selectedNodeInstances: any[];

  selectedNode$: Observable<any>;
  nodeWiseQuestionsCount$: Observable<any>;
  selectedNodeLoadStatus = false;
  isHierarchyLoaded = false;
  createOrEditForm: boolean;
  isPreviewActive = false;
  readonly formConfigurationStatus = formConfigurationStatus;
  authoredRoundPlanDetailSubscription: Subscription;
  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private headerService: HeaderService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormService,
    private dialog: MatDialog,
    private cdrf: ChangeDetectorRef,
    private operatorRoundsService: OperatorRoundsService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.selectedNode$ = this.operatorRoundsService.selectedNode$.pipe(
      tap((data) => {
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
      })
    );
    this.hierarchyMode$ = this.operatorRoundsService.hierarchyMode$.pipe(
      tap((data) => {
        this.hierarchyMode = data;
      })
    );

    this.nodeWiseQuestionsCount$ = this.store.select(
      getNodeWiseQuestionsCount()
    );

    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap((formMetadata) => {
        if (Object.keys(formMetadata).length) {
          const { name, description, id, formLogo, formStatus } = formMetadata;
          this.formMetadata = formMetadata;

          this.formConfiguration.patchValue(
            {
              name,
              description,
              id,
              formLogo,
              formStatus
            },
            { emitEvent: false }
          );
          const formName = name ? name : 'Untitled Form';
          this.headerService.setHeaderTitle(formName);
          this.breadcrumbService.set('@formName', {
            label: formName
          });
        }
      })
    );

    this.formConfiguration = this.fb.group({
      id: [''],
      formLogo: [''],
      name: new FormControl(
        {
          value: '',
          disabled: true
        },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ),
      description: [''],
      counter: [0],
      formStatus: [formConfigurationStatus.draft]
    });

    this.formConfiguration.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([previous, current]) => {
          if (!this.formConfiguration.invalid) {
            const {
              counter: prevCounter,
              id: prevId,
              formStatus: prevFormStatus,
              ...prev
            } = previous;
            const {
              counter: currCounter,
              id: currId,
              formStatus: currFormStatus,
              ...curr
            } = current;

            if (
              !isEqual(prev, curr) &&
              prev.name !== undefined &&
              curr.name !== undefined
            ) {
              const { moduleName, ...currentVal } = curr;
              this.store.dispatch(
                BuilderConfigurationActions.updateFormMetadata({
                  formMetadata: currentVal,
                  ...this.getFormConfigurationStatuses()
                })
              );
              this.store.dispatch(
                RoundPlanConfigurationActions.updateRoundPlan({
                  formMetadata: this.formMetadata,
                  formListDynamoDBVersion: this.formListVersion,
                  ...this.getFormConfigurationStatuses()
                })
              );
            }
          }
        })
      )
      .subscribe();

    this.questionCounter$ = this.store.select(getQuestionCounter).pipe(
      tap((counter) => {
        this.formConfiguration.patchValue(
          {
            counter
          },
          { emitEvent: false }
        );
      })
    );

    this.isFormCreated$ = this.store.select(getIsFormCreated).pipe(
      tap((isFormCreated) => {
        if (isFormCreated) {
          // This will cause some delay in redirection post creation of fresh form. This is only added here to reduce multiple form creations in development process
          // this.router.navigate(['/forms/edit', this.formConf.id.value]);
        }
      })
    );

    this.authoredFormDetail$ = combineLatest([
      this.store.select(getFormDetails),
      this.store.select(getSelectedHierarchyList)
    ]).pipe(
      tap(([formDetails, selectedHierarchyList]) => {
        const {
          formMetadata,
          formStatus,
          counter,
          pages,
          authoredFormDetailId,
          authoredFormDetailVersion,
          isFormDetailPublished,
          formDetailPublishStatus,
          formSaveStatus,
          formListDynamoDBVersion,
          authoredFormDetailDynamoDBVersion,
          skipAuthoredDetail
        } = formDetails;

        if (skipAuthoredDetail) {
          return;
        }

        const subFormsObj = {};
        let formKeys = Object.keys(formDetails);
        formKeys = formKeys.filter((k) => k.startsWith('pages_'));
        formKeys.forEach((key) => {
          subFormsObj[key] = formDetails[key];
        });
        this.formListVersion = formListDynamoDBVersion;
        this.formStatus = formStatus;
        this.formDetailPublishStatus = formDetailPublishStatus;
        const { id: formListId } = formMetadata;
        this.isFormDetailPublished = isFormDetailPublished;
        if (formListId) {
          if (authoredFormDetailId) {
            if (
              formSaveStatus !== formConfigurationStatus.saved &&
              formStatus !== formConfigurationStatus.published &&
              selectedHierarchyList &&
              (!isEqual(this.formDetails, formDetails) ||
                !isEqual(this.selectedHierarchyList, selectedHierarchyList))
            ) {
              this.store.dispatch(
                RoundPlanConfigurationActions.updateAuthoredRoundPlanDetail({
                  formStatus,
                  formDetailPublishStatus,
                  formListId,
                  counter,
                  pages: null,
                  subForms: subFormsObj,
                  authoredFormDetailId,
                  authoredFormDetailVersion,
                  authoredFormDetailDynamoDBVersion,
                  hierarchy: selectedHierarchyList
                })
              );
              if (
                formMetadata.lastModifiedBy !==
                this.loginService.getLoggedInUserName()
              ) {
                this.store.dispatch(
                  BuilderConfigurationActions.updateFormMetadata({
                    formMetadata: {
                      ...formMetadata,
                      lastModifiedBy: this.loginService.getLoggedInUserName()
                    },
                    ...this.getFormConfigurationStatuses()
                  })
                );
                this.store.dispatch(
                  RoundPlanConfigurationActions.updateRoundPlan({
                    formMetadata: {
                      ...formMetadata,
                      lastModifiedBy: this.loginService.getLoggedInUserName()
                    },
                    formListDynamoDBVersion: this.formListVersion,
                    ...this.getFormConfigurationStatuses()
                  })
                );
              }

              this.formDetails = formDetails;
              this.selectedHierarchyList = selectedHierarchyList;
            }
          } else {
            this.store.dispatch(
              RoundPlanConfigurationActions.createAuthoredRoundPlanDetail({
                formStatus,
                formDetailPublishStatus,
                formListId,
                counter,
                pages,
                subForms: subFormsObj,
                authoredFormDetailVersion,
                hierarchy: selectedHierarchyList
              })
            );
          }

          if (isFormDetailPublished) {
            this.store.dispatch(
              RoundPlanConfigurationActions.publishRoundPlan({
                hierarchy: selectedHierarchyList,
                formMetadata,
                formListId,
                pages,
                subForms: subFormsObj,
                authoredFormDetail: {
                  formStatus,
                  formListId,
                  counter,
                  pages,
                  authoredFormDetailVersion,
                  authoredFormDetailDynamoDBVersion,
                  authoredFormDetailId
                },
                formListDynamoDBVersion
              })
            );
          }
        }
      })
    );

    this.createOrEditForm$ = this.store.select(getCreateOrEditForm);

    this.formSaveStatus$ = this.store.select(getFormSaveStatus);

    this.formDetailPublishStatus$ = this.store
      .select(getFormPublishStatus)
      .pipe(
        tap(
          (formDetailPublishStatus) =>
            (this.formDetailPublishStatus = formDetailPublishStatus)
        )
      );

    this.isDataResolved$ = combineLatest([
      this.route.data,
      this.createOrEditForm$
    ]).pipe(
      tap(([data, createOrEditForm]) => {
        if (!createOrEditForm) {
          this.router.navigate(['/operator-rounds']);
        }
        const { componentMode } = data;
        const { formConfigurationState, hierarchyState } = data.form || {};

        if (createOrEditForm && componentMode === 'create')
          this.openHierarchyModal();

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
          this.formConf.counter.setValue(formConfigurationState.counter);
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
      })
    );
  }

  getImage = (imageName: string, active: boolean) =>
    active ? `icon-${imageName}-white` : `icon-${imageName}-blue`;

  togglePreview() {
    this.isPreviewActive = !this.isPreviewActive;
  }

  editFormName() {
    this.formConfiguration.get('name').enable();
    this.formName.nativeElement.focus();
  }

  getSize(value) {
    if (value && value === value.toUpperCase()) {
      return value.length;
    }
    return value.length - 1;
  }

  get formConf() {
    return this.formConfiguration.controls;
  }

  uploadFormImageFile(e) {
    // uploaded image  file code
  }

  publishFormDetail() {
    this.store.dispatch(
      BuilderConfigurationActions.updateFormPublishStatus({
        formDetailPublishStatus: formConfigurationStatus.publishing
      })
    );
    this.store.dispatch(
      BuilderConfigurationActions.updateIsFormDetailPublished({
        isFormDetailPublished: true
      })
    );
  }

  getFormConfigurationStatuses() {
    return {
      formStatus: formConfigurationStatus.draft,
      formDetailPublishStatus: formConfigurationStatus.draft,
      formSaveStatus: formConfigurationStatus.saving
    };
  }

  importTasks = () => {
    const dialogRef = this.dialog.open(ImportTaskModalComponent, {
      data: {
        selectedFormData: '',
        selectedFormName: '',
        openImportQuestionsSlider: false
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.selectedFormData = result.selectedFormData;
      this.selectedFormName = result.selectedFormName;
      this.authoredRoundPlanDetailSubscription =
        this.authoredFormDetail$.subscribe((pagesData) => {
          this.currentFormData = pagesData;
        });
      this.openAppSider$ = of(result.openImportQuestionsSlider);
      this.cdrf.markForCheck();
    });
  };

  cancelSlider(event) {
    this.openAppSider$ = of(event);
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.formConfiguration.get(controlName).touched;
    const errors = this.formConfiguration.get(controlName).errors;
    this.errors[controlName] = null;
    if (touched && errors) {
      Object.keys(errors).forEach((messageKey) => {
        this.errors[controlName] = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return !touched || this.errors[controlName] === null ? false : true;
  }

  ngOnDestroy(): void {
    if (this.authoredRoundPlanDetailSubscription) {
      this.authoredRoundPlanDetailSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(HierarchyActions.resetSelectedHierarchyState());
    this.store.dispatch(BuilderConfigurationActions.resetFormConfiguration());
    this.store.dispatch(UnitOfMeasurementActions.resetUnitOfMeasurementList());
    this.store.dispatch(QuickResponseActions.resetQuickResponses());
    this.store.dispatch(GlobalResponseActions.resetGlobalResponses());
  }

  hierarchyEventHandler(event: any) {
    const { hierarchy } = event;
    this.store.dispatch(
      HierarchyActions.updateSelectedHierarchyList({
        selectedHierarchy: hierarchy || []
      })
    );
    this.store.dispatch(
      BuilderConfigurationActions.updateFormStatuses({
        formStatus: formConfigurationStatus.draft,
        formDetailPublishStatus: formConfigurationStatus.draft,
        formSaveStatus: formConfigurationStatus.saving
      })
    );
    if (!hierarchy || !hierarchy.length) {
      this.operatorRoundsService.setSelectedNode(null);
      this.formService.setSelectedHierarchyList([]);
    } else {
      this.operatorRoundsService.setSelectedNode(hierarchy[0]);
      this.formService.setSelectedHierarchyList(hierarchy);
    }
  }

  openHierarchyModal = () => {
    this.dialog
      .open(HierarchyModalComponent, {
        disableClose: true
      })
      .afterClosed()
      .subscribe((selectedHierarchyList: HierarchyEntity[]) => {
        if (!selectedHierarchyList) return;
        this.store.dispatch(
          HierarchyActions.updateSelectedHierarchyList({
            selectedHierarchy: selectedHierarchyList
          })
        );
        this.store.dispatch(
          BuilderConfigurationActions.updateFormStatuses({
            formStatus: formConfigurationStatus.draft,
            formDetailPublishStatus: formConfigurationStatus.draft,
            formSaveStatus: formConfigurationStatus.saving
          })
        );
        this.formService.setSelectedHierarchyList(selectedHierarchyList);
      });
  };

  trackBySelectedNodeInstances(index: number, el: any): string {
    return el.id;
  }

  goToPDFBuilderConfiguration = () => {
    this.gotoNextStep.emit();
  };
}
