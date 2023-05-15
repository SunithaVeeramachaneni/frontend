/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AssetHierarchyUtil } from 'src/app/shared/utils/assetHierarchyUtil';
import { ToastService } from 'src/app/shared/toast';
import { formConfigurationStatus } from 'src/app/app.constants';
import { FormMetadata } from 'src/app/interfaces';
import { getSelectedHierarchyList } from '../../state';
import {
  BuilderConfigurationActions,
  RoundPlanConfigurationActions
} from '../../state/actions';
import {
  getFormMetadata,
  State,
  getSubFormPages,
  getTotalTasksCountByHierarchy,
  getPDFBuilderConfiguration,
  getFormSaveStatus,
  getFormPublishStatus,
  getFormDetails
} from '../../state/builder/builder-state.selectors';
import { debounceTime, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/components/login/services/login.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-pdf-builder',
  templateUrl: './pdf-builder.component.html',
  styleUrls: ['./pdf-builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDFBuilderComponent implements OnInit {
  @ViewChild('myPDF', { static: false }) myPDF!: ElementRef;
  @ViewChild('content', { static: false }) content: ElementRef;

  loadPDFBuilderConfig$: Observable<any>;

  authoredFormDetail$: Observable<any>;
  formMetadata$: Observable<FormMetadata>;
  formSaveStatus$: Observable<string>;
  formDetailPublishStatus$: Observable<string>;

  formMetadata: FormMetadata;
  formListVersion: number;

  selectedHierarchy$: Observable<any>;
  selectedFlatHierarchy: any = [];
  totalQuestionsCount = 0;
  totalAssetsCount = 0;
  totalLocationsCount = 0;
  inDraftState = false;
  pdfBuilderConfigurationsForm: FormGroup = this.fb.group({
    formId: true,
    formTitle: true,
    subject: true,
    logo: true,
    questionCompleted: true,
    submittedOn: true,
    submittedBy: true,
    pdfGeneratedDate: true,
    customText: true,
    // customTextLabel: '',
    // customTextField: '',
    actions: true,
    issues: true,
    questions: true,
    incompleteQuestions: true,
    completedQuestions: true,
    capturedQuestions: true,
    photos: true,
    skippedQuestions: true
  });
  pdfBuilderConfigurationsFormCustomText: FormGroup = this.fb.group({
    customTextLabel: '',
    customTextField: ''
  });

  formStatus: string;
  isFormDetailPublished: string;
  formDetailPublishStatus: string;

  innovapptiveLogo =
    'data:image/png;base64,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';

  dummyImages = [];
  currentUserName = '';

  readonly formConfigurationStatus = formConfigurationStatus;

  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private router: Router,
    public assetHierarchyUtil: AssetHierarchyUtil,
    public dialogRef: MatDialogRef<PDFBuilderComponent>,
    private loginService: LoginService,
    private toast: ToastService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.currentUserName = this.loginService.getLoggedInUserName();
    this.authoredFormDetail$ = this.store.select(getFormDetails).pipe(
      tap((formDetails) => {
        const { formListDynamoDBVersion } = formDetails;
        this.formListVersion = formListDynamoDBVersion;
      })
    );
    this.formMetadata$ = this.store.select(getFormMetadata).pipe(
      tap((formMetadata) => {
        if (Object.keys(formMetadata).length) {
          this.formMetadata = formMetadata;
        }
      })
    );

    this.formSaveStatus$ = this.store.select(getFormSaveStatus);
    this.formDetailPublishStatus$ = this.store
      .select(getFormPublishStatus)
      .pipe(
        tap((formDetailPublishStatus) => {
          if (formDetailPublishStatus === 'Draft') this.inDraftState = true;
          this.formDetailPublishStatus = formDetailPublishStatus;
          if (formDetailPublishStatus === 'Published' && this.inDraftState) {
            if (this.data.moduleName === 'OPERATOR_ROUNDS') {
              this.toast.show({
                text: 'Round published successfully',
                type: 'success'
              });
              this.router.navigate(['/operator-rounds']);
              this.dialogRef.close();
            } else if (this.data.moduleName === 'RDF') {
              this.toast.show({
                text: 'Form published successfully',
                type: 'success'
              });
              this.router.navigate(['/forms']);
              this.dialogRef.close();
            }
          }
          if (
            this.inDraftState === false &&
            this.formDetailPublishStatus === 'Publishing'
          )
            this.inDraftState = true;
        })
      );

    if (this.data.moduleName && this.data.moduleName === 'OPERATOR_ROUNDS') {
      this.store.select(getSelectedHierarchyList).subscribe((data) => {
        this.selectedFlatHierarchy =
          this.assetHierarchyUtil.convertHierarchyToFlatList(data, 0);
        const hierarchyClone = JSON.parse(
          JSON.stringify(this.selectedFlatHierarchy)
        );
        this.totalAssetsCount = hierarchyClone.filter(
          (h) => h.type === 'asset'
        ).length;
        this.totalLocationsCount = hierarchyClone.filter(
          (h) => h.type !== 'asset'
        ).length;

        const nodeIds = hierarchyClone.map((node) => node.id);
        this.store
          .select(getTotalTasksCountByHierarchy(nodeIds))
          .subscribe((count) => {
            this.totalQuestionsCount = count;
          });
      });
    }

    this.pdfBuilderConfigurationsForm.valueChanges.subscribe((data) => {
      this.store.dispatch(
        BuilderConfigurationActions.updatePDFBuilderConfiguration({
          pdfBuilderConfiguration: {
            ...this.pdfBuilderConfigurationsFormCustomText.value,
            data
          }
        })
      );

      if (this.data.moduleName && this.data.moduleName === 'RDF') {
        this.store.dispatch(
          BuilderConfigurationActions.updateForm({
            formMetadata: this.formMetadata,
            formListDynamoDBVersion: this.formListVersion,
            ...this.getFormConfigurationStatuses()
          })
        );
      } else {
        this.store.dispatch(
          RoundPlanConfigurationActions.updateRoundPlan({
            formMetadata: this.formMetadata,
            formListDynamoDBVersion: this.formListVersion,
            ...this.getFormConfigurationStatuses()
          })
        );
      }
    });

    this.pdfBuilderConfigurationsFormCustomText.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((data) => {
        const { customTextField, customTextLabel } = data;
        this.store.dispatch(
          BuilderConfigurationActions.updatePDFBuilderConfiguration({
            pdfBuilderConfiguration: {
              ...this.pdfBuilderConfigurationsForm.value,
              customTextField,
              customTextLabel
            }
          })
        );

        if (this.data.moduleName && this.data.moduleName === 'RDF') {
          this.store.dispatch(
            BuilderConfigurationActions.updateForm({
              formMetadata: this.formMetadata,
              formListDynamoDBVersion: this.formListVersion,
              ...this.getFormConfigurationStatuses()
            })
          );
        } else {
          this.store.dispatch(
            RoundPlanConfigurationActions.updateRoundPlan({
              formMetadata: this.formMetadata,
              formListDynamoDBVersion: this.formListVersion,
              ...this.getFormConfigurationStatuses()
            })
          );
        }
      });
    this.loadPDFBuilderConfig$ = this.store
      .select(getPDFBuilderConfiguration)
      .pipe(
        tap((config) => {
          this.pdfBuilderConfigurationsForm.patchValue(config, {
            emitEvent: false
          }),
            this.pdfBuilderConfigurationsFormCustomText.patchValue(
              {
                customTextField: config?.customTextField || '',
                customTextLabel: config?.customTextLabel || ''
              },
              {
                emitEvent: false
              }
            );
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

  publish() {
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

  toggleSelectAll(event) {
    if (event.checked) {
      this.pdfBuilderConfigurationsForm.patchValue({
        formId: true,
        formTitle: true,
        subject: true,
        logo: true,
        questionCompleted: true,
        submittedOn: true,
        submittedBy: true,
        pdfGeneratedDate: true,
        customText: true,
        actions: true,
        issues: true,
        questions: true,
        incompleteQuestions: true,
        completedQuestions: true,
        capturedQuestions: true,
        photos: true,
        skippedQuestions: true
      });
    } else {
      this.pdfBuilderConfigurationsForm.patchValue({
        formId: false,
        formTitle: false,
        subject: false,
        logo: false,
        questionCompleted: false,
        submittedOn: false,
        submittedBy: false,
        pdfGeneratedDate: false,
        customText: false,
        actions: false,
        issues: false,
        questions: false,
        incompleteQuestions: false,
        completedQuestions: false,
        capturedQuestions: false,
        photos: false,
        skippedQuestions: false
      });
    }
  }
  toggleAllQuestions(event) {
    if (event.checked) {
      this.pdfBuilderConfigurationsForm.patchValue({
        questions: true,
        incompleteQuestions: true,
        completedQuestions: true,
        capturedQuestions: true,
        skippedQuestions: true
      });
    } else {
      this.pdfBuilderConfigurationsForm.patchValue({
        questions: false,
        incompleteQuestions: false,
        completedQuestions: false,
        capturedQuestions: false,
        skippedQuestions: false
      });
    }
  }
  toggleIncompleteQuestions(event) {
    if (event.checked) {
      this.pdfBuilderConfigurationsForm.patchValue({
        questions: true,
        incompleteQuestions: true
      });
    } else {
      this.pdfBuilderConfigurationsForm.patchValue({
        incompleteQuestions: false
      });
    }
  }
  toggleCompletedQuestions(event) {
    if (event.checked) {
      this.pdfBuilderConfigurationsForm.patchValue({
        questions: true,
        completedQuestions: true,
        capturedQuestions: true,
        photos: true,
        skippedQuestions: true
      });
    } else {
      this.pdfBuilderConfigurationsForm.patchValue({
        completedQuestions: false,
        capturedQuestions: false,
        photos: false,
        skippedQuestions: false
      });
    }
  }
  togglecapturedQuestions(event) {
    if (event.checked) {
      this.pdfBuilderConfigurationsForm.patchValue({
        questions: true,
        completedQuestions: true,
        capturedQuestions: true
      });
    } else {
      this.pdfBuilderConfigurationsForm.patchValue({
        capturedQuestions: false
      });
    }
  }
  toggleQuestionPhotos(event) {
    if (event.checked) {
      this.pdfBuilderConfigurationsForm.patchValue({
        photos: true
      });
    } else {
      this.pdfBuilderConfigurationsForm.patchValue({
        photos: false
      });
    }
  }
  toggleSkippedQuestions(event) {
    if (event.checked) {
      this.pdfBuilderConfigurationsForm.patchValue({
        questions: true,
        completedQuestions: true,
        skippedQuestions: true
      });
    } else {
      this.pdfBuilderConfigurationsForm.patchValue({
        skippedQuestions: false
      });
    }
  }
  areQuestionsIndeterminate() {
    const config = this.pdfBuilderConfigurationsForm.getRawValue();
    return (
      config.incompleteQuestions ||
      config.completedQuestions ||
      config.capturedQuestions ||
      config.photos ||
      config.skippedQuestions
    );
  }
  areCompletedQuestionsIndeterminate() {
    const config = this.pdfBuilderConfigurationsForm?.getRawValue();
    return config.capturedQuestions || config.photos || config.skippedQuestions;
  }
  isSelectAllIndeterminate() {
    const config = this.pdfBuilderConfigurationsForm?.getRawValue();
    return (
      config.formId ||
      config.formTitle ||
      config.subject ||
      config.logo ||
      config.questionCompleted ||
      config.submittedOn ||
      config.submittedBy ||
      config.pdfGeneratedDate ||
      config.customText ||
      config.actions ||
      config.issues ||
      config.questions ||
      config.incompleteQuestions ||
      config.completedQuestions ||
      config.capturedQuestions ||
      config.photos ||
      config.skippedQuestions
    );
  }

  getPagesOfNode(nodeId) {
    return this.store.select(getSubFormPages(nodeId));
  }
  getSectionsWithQuestionsOfPage(page) {
    return page.sections.map((section) => {
      section.questions = page.questions.filter(
        (q) => q.sectionId === section.id
      );
      return section;
    });
  }
  getSectionsCountByNode(allPages) {
    let count = 0;
    allPages.forEach((page) => {
      if (page.sections) {
        count += page.sections.length;
      }
    });
    return count;
  }
  getAllQuestionsCountByNode(allPages) {
    let count = 0;
    allPages.forEach((page) => {
      if (page.questions) {
        count += page.questions.length;
      }
    });
    return count;
  }

  getCurrentDate() {
    return format(new Date(), 'M/d/yy');
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
