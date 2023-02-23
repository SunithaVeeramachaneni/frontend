import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of, combineLatest } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  tap
} from 'rxjs/operators';

import { isEqual } from 'lodash-es';
import {
  PageEvent,
  QuestionEvent,
  SectionEvent,
  FormMetadata,
  Page,
  Question,
  Section,
  ValidationError
} from 'src/app/interfaces';

import {
  getFormMetadata,
  getFormDetails,
  getCreateOrEditForm,
  getFormSaveStatus,
  getFormPublishStatus,
  getIsFormCreated,
  getQuestionCounter,
  State
} from 'src/app/forms/state/builder/builder-state.selectors';

import {
  BuilderConfigurationActions,
  RoundPlanConfigurationActions
} from 'src/app/forms/state/actions';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { HeaderService } from 'src/app/shared/services/header.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ActivatedRoute, Router } from '@angular/router';
import { formConfigurationStatus } from 'src/app/app.constants';
import { MatDialog } from '@angular/material/dialog';
import { ImportTaskModalComponent } from '../import-task-modal/import-task-modal.component';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { RoundPlanConfigurationService } from 'src/app/forms/services/round-plan-configuration.service';
import { getSelectedHierarchyList } from 'src/app/forms/state';

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
  public openAppSider$: Observable<any>;
  formConfiguration: FormGroup;
  formMetadata$: Observable<FormMetadata>;
  pageIndexes$: Observable<number[]>;
  pages$: Observable<Page[]>;
  formDetails$: Observable<any>;
  sectionIndexes$: Observable<any>;
  sectionIndexes: any;
  sectionIds$: Observable<any>;
  questionIds$: Observable<any>;
  questionIndexes$: Observable<any>;
  authoredFormDetail$: Observable<any>;
  createOrEditForm$: Observable<boolean>;
  formSaveStatus$: Observable<string>;
  formDetailPublishStatus$: Observable<string>;
  isFormCreated$: Observable<boolean>;
  questionCounter$: Observable<number>;
  questionIndexes: any;
  formStatus: string;
  formDetailPublishStatus: string;
  isFormDetailPublished: string;
  formMetadata: FormMetadata;
  formListVersion: number;
  errors: ValidationError = {};
  formDetails: any;
  selectedFormName: string;
  selectedFormData: any;
  currentFormData: any;

  selectedNode: any;
  selectedNode$: Observable<any>;
  selectedNodeLoadStatus = false;
  isHierarchyLoaded = false;

  isPreviewActive = false;

  readonly formConfigurationStatus = formConfigurationStatus;

  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private headerService: HeaderService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private roundPlanConfigurationService: RoundPlanConfigurationService,
    private dialog: MatDialog,
    private cdrf: ChangeDetectorRef,
    private operatorRoundsService: OperatorRoundsService
  ) {}

  ngOnInit(): void {
    this.selectedNode$ = this.operatorRoundsService.selectedNode$.pipe(
      tap((data) => {
        if (Object.keys(data).length) {
          this.selectedNode = data;
          this.selectedNodeLoadStatus = true;
          this.cdrf.detectChanges();
          this.store.dispatch(
            BuilderConfigurationActions.initPage({
              subFormId: this.selectedNode.id
            })
          );
        }
      })
    );

    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap((formMetadata) => {
        if (Object.keys(formMetadata).length) {
          const { name, description, id, formLogo, formStatus } = formMetadata;
          this.formMetadata = formMetadata;
          this.operatorRoundsService.setSelectedNode(formMetadata.hierarchy[0]);

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

            if (!isEqual(prev, curr)) {
              this.store.dispatch(
                BuilderConfigurationActions.updateFormMetadata({
                  formMetadata: curr,
                  ...this.getFormConfigurationStatuses()
                })
              );

              this.store.dispatch(
                BuilderConfigurationActions.updateForm({
                  formMetadata: this.formMetadata,
                  formListDynamoDBVersion: this.formListVersion
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
          subForms,
          authoredFormDetailId,
          authoredFormDetailVersion,
          isFormDetailPublished,
          formDetailId,
          formDetailPublishStatus,
          formSaveStatus,
          formListDynamoDBVersion,
          formDetailDynamoDBVersion,
          authoredFormDetailDynamoDBVersion
        } = formDetails;

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
              formSaveStatus !== 'Saved' &&
              formStatus !== 'Published' &&
              !isEqual(this.formDetails, formDetails)
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
                  authoredFormDetailDynamoDBVersion,
                  hierarchy: selectedHierarchyList
                })
              );
              // const pagesWithoutBlankQuestions =
              //   this.getPagesWithoutBlankQuestions(pages);
              // if (
              //   (!this.formDetails &&
              //     !isEqual(pages, pagesWithoutBlankQuestions)) ||
              //   (this.formDetails &&
              //     !isEqual(this.formDetails.pages, pagesWithoutBlankQuestions))
              // ) {

              // } else {
              //   // dispatches the action to trigger the reducer directly, causing a state update
              //   // without calling the effect that saves the form to DynamoDB.
              //   this.store.dispatch(
              //     RoundPlanConfigurationApiActions.updateAuthoredRoundPlanDetailSuccess(
              //       {
              //         authoredFormDetail: null,
              //         formSaveStatus: formConfigurationStatus.saved
              //       }
              //     )
              //   );
              // }
              this.formDetails = formDetails;
            }
          } else {
            this.store.dispatch(
              RoundPlanConfigurationActions.createAuthoredRoundPlanDetail({
                formStatus,
                formDetailPublishStatus,
                formListId,
                counter,
                pages,
                subForms,
                ...subFormsObj,
                authoredFormDetailVersion,
                hierarchy: selectedHierarchyList
              })
            );
          }

          if (isFormDetailPublished && formDetailId) {
            this.store.dispatch(
              RoundPlanConfigurationActions.updateRoundPlanDetail({
                formMetadata,
                formListId,
                pages,
                subForms,
                ...subFormsObj,
                formDetailId,
                formDetailDynamoDBVersion,
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
          } else if (isFormDetailPublished && !formDetailId) {
            this.store.dispatch(
              RoundPlanConfigurationActions.createRoundPlanDetail({
                formMetadata,
                formListId,
                pages,
                subForms,
                ...subFormsObj,
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

    this.createOrEditForm$ = this.store.select(getCreateOrEditForm).pipe(
      tap((createOrEditForm) => {
        if (!createOrEditForm) {
          this.router.navigate(['/operator-rounds']);
        }
      })
    );

    this.formSaveStatus$ = this.store.select(getFormSaveStatus);

    this.formDetailPublishStatus$ = this.store
      .select(getFormPublishStatus)
      .pipe(
        tap(
          (formDetailPublishStatus) =>
            (this.formDetailPublishStatus = formDetailPublishStatus)
        )
      );

    this.route.data.subscribe((data) => {
      if (data.form && Object.keys(data.form).length) {
        this.formConf.counter.setValue(data.form.counter);
        this.store.dispatch(
          BuilderConfigurationActions.updateFormConfiguration({
            formConfiguration: data.form
          })
        );

        if (this.selectedNode && this.selectedNode.id) {
          const subFormsObj = {};
          let formKeys = Object.keys(data.form);
          formKeys = formKeys.filter((k) => k.startsWith('pages_'));
          formKeys.forEach((key) => {
            subFormsObj[key] = data.form[key];
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

    // this.route.params.subscribe((params) => {
    //   if (!params.id) {
    //     this.formMetadata$ = this.store.select(getFormMetadata).pipe(
    //       tap((formMetadata) => {
    //         if (Object.keys(formMetadata).length) {
    //           const { hierarchy } = formMetadata;
    //           this.selectedNode = hierarchy[0] || [];
    //         }
    //       })
    //     );
    //   } else {
    //     // this.roundPlanConfigurationService.addPage(
    //     //   0,
    //     //   1,
    //     //   1,
    //     //   this.sectionIndexes,
    //     //   this.formConf.counter.value,
    //     //   this.selectedNode.id
    //     // );
    //   }
    // });
  }

  getImage = (imageName: string, active: boolean) =>
    active
      ? `assets/rdf-forms-icons/${imageName}-white.svg`
      : `assets/rdf-forms-icons/${imageName}-blue.svg`;

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

  pageEventHandler(event: PageEvent) {
    const { pageIndex, type } = event;
    switch (type) {
      case 'add':
        {
          this.roundPlanConfigurationService.addPage(
            pageIndex,
            1,
            1,
            this.sectionIndexes,
            this.formConf.counter.value,
            this.selectedNode.id
          );
        }
        break;

      case 'delete':
        this.store.dispatch(
          BuilderConfigurationActions.deletePage({
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: this.selectedNode.id
          })
        );
        break;
    }
  }

  sectionEventHandler(event: SectionEvent) {
    const { pageIndex, sectionIndex, section, type } = event;
    switch (type) {
      case 'add':
        {
          this.roundPlanConfigurationService.addSections(
            pageIndex,
            1,
            1,
            sectionIndex,
            this.sectionIndexes,
            this.formConf.counter.value,
            this.selectedNode.id
          );
        }
        break;

      case 'update':
        this.store.dispatch(
          BuilderConfigurationActions.updateSection({
            section,
            sectionIndex,
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: this.selectedNode.id
          })
        );
        break;

      case 'delete':
        this.store.dispatch(
          BuilderConfigurationActions.deleteSection({
            sectionIndex,
            sectionId: section.id,
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: this.selectedNode.id
          })
        );
        break;
    }
  }

  questionEventHandler(event: QuestionEvent) {
    const { pageIndex, questionIndex, sectionId, question, type } = event;
    switch (type) {
      case 'add':
        {
          this.roundPlanConfigurationService.addQuestions(
            pageIndex,
            sectionId,
            1,
            questionIndex,
            this.formConf.counter.value,
            this.selectedNode.id
          );
        }
        break;

      case 'update':
        this.store.dispatch(
          BuilderConfigurationActions.updateQuestion({
            question,
            questionIndex,
            sectionId,
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: this.selectedNode.id
          })
        );
        break;

      case 'delete':
        this.store.dispatch(
          BuilderConfigurationActions.deleteQuestion({
            questionIndex,
            sectionId,
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: this.selectedNode.id
          })
        );
        break;
    }
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

  dropSection(event: CdkDragDrop<any>, pageIndex: number) {
    const data = event.container.data.slice();

    if (event.previousContainer === event.container) {
      moveItemInArray(data, event.previousIndex, event.currentIndex);
      const sectionPositionMap = {};
      data.forEach((section: Section, index) => {
        sectionPositionMap[section.id] = index + 1;
      });
      this.store.dispatch(
        BuilderConfigurationActions.updatePageSections({
          pageIndex,
          data: sectionPositionMap,
          ...this.getFormConfigurationStatuses(),
          subFormId: this.selectedNode.id
        })
      );
    }
  }

  drop(event: CdkDragDrop<any>, pageIndex, sectionId) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      event.container.data.forEach((question: Question, index) => {
        this.store.dispatch(
          BuilderConfigurationActions.updateQuestionBySection({
            question: Object.assign({}, question, {
              position: index + 1,
              sectionId
            }),
            sectionId,
            pageIndex,
            ...this.getFormConfigurationStatuses(),
            subFormId: this.selectedNode.id
          })
        );
      });
    } else {
      const questionId = event.previousContainer.data[event.previousIndex].id;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.store.dispatch(
        BuilderConfigurationActions.transferQuestionFromSection({
          questionId,
          currentIndex: event.currentIndex,
          previousIndex: event.previousIndex,
          sourceSectionId: event.previousContainer.id,
          destinationSectionId: event.container.id,
          pageIndex,
          ...this.getFormConfigurationStatuses(),
          subFormId: this.selectedNode.id
        })
      );
    }
  }

  // getQuestionsOfSection(pageIndex, sectionIndex) {
  //   let sectionQuestions;
  //   this.store
  //     .select(getSectionQuestions(pageIndex, sectionIndex))
  //     .subscribe((v) => (sectionQuestions = v));
  //   return sectionQuestions;
  // }

  // getSectionsOfPage(pageIndex) {
  //   let pageSections;
  //   this.store
  //     .select(getPage(pageIndex))
  //     .subscribe((v) => (pageSections = v?.sections));
  //   return pageSections;
  // }

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
    this.store.dispatch(BuilderConfigurationActions.resetFormConfiguration());
  }

  addQuestion(pageIndex, sectionIndex, questionIndex) {
    this.roundPlanConfigurationService.addQuestions(
      pageIndex,
      sectionIndex,
      1,
      questionIndex,
      this.formConf.counter.value,
      this.selectedNode.id
    );
  }

  hierarchyEventHandler(event: any) {
    const { hierarchy } = event;
    const {
      counter: currCounter,
      formStatus: currFormStatus,
      ...formMetadata
    } = this.formConfiguration.value;
    this.store.dispatch(
      BuilderConfigurationActions.updateFormMetadata({
        formMetadata: { ...formMetadata, hierarchy },
        ...this.getFormConfigurationStatuses()
      })
    );
    this.store.dispatch(
      RoundPlanConfigurationActions.updateRoundPlan({
        formMetadata: { ...formMetadata, hierarchy: JSON.stringify(hierarchy) },
        formListDynamoDBVersion: this.formListVersion
      })
    );
  }

  getPagesWithoutBlankQuestions(pages: Page[]) {
    const pagesCopy = JSON.parse(JSON.stringify(pages));
    return pagesCopy.map((page) => {
      // if all questions of a page are blank, leave the first question behind. Otherwise filter as normal.
      if (
        page.questions.filter((question) => question.name.trim().length !== 0)
          .length === 0
      ) {
        page.questions = page.questions.slice(0, 1);
      } else {
        page.questions = page.questions.filter(
          (question) => question.name.trim().length !== 0
        );
      }
      return page;
    });
  }
}
