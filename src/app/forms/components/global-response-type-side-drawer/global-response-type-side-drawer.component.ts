import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  pairwise,
  debounceTime,
  distinctUntilChanged,
  tap
} from 'rxjs/operators';
import { isEqual } from 'lodash-es';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';

import { MCQResponseActions } from '../../state/actions';
import { getResponseSets } from '../../state';
@Component({
  selector: 'app-global-response-type-side-drawer',
  templateUrl: './global-response-type-side-drawer.component.html',
  styleUrls: ['./global-response-type-side-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalResponseTypeSideDrawerComponent implements OnInit {
  public responseForm: FormGroup;
  public isResponseFormUpdated = false;
  private globalResponse: any;

  @Input() set globalResponseToBeEdited(response: any) {
    this.globalResponse = response ? response : null;
  }

  constructor(
    private fb: FormBuilder,
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
      responses: this.fb.array([])
    });

    this.responses.valueChanges
      .pipe(
        pairwise(),
        debounceTime(500),
        distinctUntilChanged(),
        tap(([prev, curr]) => {
          if (isEqual(prev, curr)) this.isResponseFormUpdated = false;
          else if (curr.find((item) => !item.title))
            this.isResponseFormUpdated = false;
          else this.isResponseFormUpdated = true;
          this.cdrf.markForCheck();
        })
      )
      .subscribe();

    if (this.globalResponse) {
      JSON.parse(this.globalResponse.values).forEach((item) => {
        this.responses.push(
          this.fb.group({
            title: [item.title, [Validators.required, Validators.minLength(3)]],
            color: ''
          })
        );
      });
    }
  }

  addResponse() {
    this.responses.push(
      this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
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

  getResponseList() {
    return (this.responseForm.get('responses') as FormArray).controls;
  }

  deleteResponse = (idx: number) => {
    this.responses.removeAt(idx);
    this.responseForm.markAsDirty();
  };

  submitResponseSet = () => {
    if (this.globalResponse !== null) {
      this.store.dispatch(
        MCQResponseActions.updateGlobalResponseSet({
          id: this.globalResponse.id,
          name: this.name.value ? this.name.value : 'Untitled Response Set',
          responseType: 'globalResponse',
          isMultiColumn: false,
          values: JSON.stringify(this.responses.value),
          description: '',
          version: 1
        })
      );
    } else
      this.store.dispatch(
        MCQResponseActions.createGlobalResponseSet({
          name: this.name.value ? this.name.value : 'Untitled Response Set',
          responseType: 'globalResponse',
          isMultiColumn: false,
          values: JSON.stringify(this.responses.value),
          description: ''
        })
      );
  };
}
