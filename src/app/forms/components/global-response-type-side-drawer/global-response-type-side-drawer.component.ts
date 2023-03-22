import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators
} from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import {
  pairwise,
  debounceTime,
  distinctUntilChanged,
  tap
} from 'rxjs/operators';

import { isEqual } from 'lodash-es';

import { MCQResponseActions } from '../../state/actions';
import { LoginService } from 'src/app/components/login/services/login.service';

import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';

@Component({
  selector: 'app-global-response-type-side-drawer',
  templateUrl: './global-response-type-side-drawer.component.html',
  styleUrls: ['./global-response-type-side-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalResponseTypeSideDrawerComponent implements OnInit {
  @Output() globalResponseHandler: EventEmitter<any> = new EventEmitter<any>();
  public responseForm: FormGroup;
  public isResponseFormUpdated = false;
  private globalResponse: any;

  @Input() set globalResponseToBeEdited(response: any) {
    this.globalResponse = response ? response : null;
  }

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private cdrf: ChangeDetectorRef,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.responseForm = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        WhiteSpaceValidator.trimWhiteSpace
      ]),
      description: new FormControl(''),
      responses: this.fb.array([])
    });

    this.responseForm.valueChanges
      .pipe(
        pairwise(),
        debounceTime(500),
        distinctUntilChanged(),
        tap(([prev, curr]) => {
          if (isEqual(prev, curr) || !curr.name || curr.responses.length < 1)
            this.isResponseFormUpdated = false;
          else if (curr.responses.find((item) => !item.title))
            this.isResponseFormUpdated = false;
          else if (
            this.globalResponse &&
            this.globalResponse.name === curr.name.value &&
            isEqual(JSON.parse(this.globalResponse.values), curr.responses)
          )
            this.isResponseFormUpdated = false;
          else this.isResponseFormUpdated = true;
          this.cdrf.markForCheck();
        })
      )
      .subscribe();

    if (this.globalResponse) {
      this.name.patchValue(this.globalResponse.name);
      this.description.patchValue(this.globalResponse.description);
      JSON.parse(this.globalResponse.values).forEach((item) => {
        this.responses.push(
          this.fb.group({
            title: [item.title, [Validators.required]],
            color: ''
          })
        );
      });
    } else this.addResponse();
  }

  addResponse() {
    this.responses.push(
      this.fb.group({
        title: ['', [Validators.required]],
        color: ''
      })
    );
  }

  get responses(): FormArray {
    return this.responseForm.get('responses') as FormArray;
  }

  get name(): FormControl {
    return this.responseForm.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.responseForm.get('description') as FormControl;
  }

  getResponseList() {
    return (this.responseForm.get('responses') as FormArray).controls;
  }

  keytab(event) {
    const element = event.srcElement.nextElementSibling;

    if (element == null) return;
    else element.focus();
  }

  dropResponse = (event: CdkDragDrop<any>) => {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    this.responses.patchValue(event.container.data);
  };

  deleteResponse = (idx: number) => {
    this.responses.removeAt(idx);
    this.responseForm.markAsDirty();
  };

  submitResponseSet = () => {
    const responseSetPayload = {
      name: this.name.value ? this.name.value : 'Untitled Response Set',
      responseType: 'globalResponse',
      isMultiColumn: false,
      values: JSON.stringify(this.responses.value),
      description: this.description.value,
      createdBy: this.loginService.getLoggedInUserName()
    };
    if (this.globalResponse !== null) {
      this.store.dispatch(
        MCQResponseActions.updateGlobalResponseSet({
          id: this.globalResponse.id,
          version: this.globalResponse._version,
          ...responseSetPayload
        })
      );
    } else
      this.store.dispatch(
        MCQResponseActions.createGlobalResponseSet(responseSetPayload)
      );

    this.closeGlobalResponse();
  };

  closeGlobalResponse = () => {
    this.globalResponseHandler.emit({
      isGlobalResponseOpen: false,
      responseToBeEdited: null
    });
    this.cdrf.markForCheck();
  };
}
