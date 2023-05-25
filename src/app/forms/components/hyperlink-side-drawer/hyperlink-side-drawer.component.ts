import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { ValidationError, Hyperlink } from 'src/app/interfaces';

@Component({
  selector: 'app-hyperlink-side-drawer',
  templateUrl: './hyperlink-side-drawer.component.html',
  styleUrls: ['./hyperlink-side-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HyperlinkSideDrawerComponent implements OnInit {
  @Output() hyperlinkHandler: EventEmitter<any> = new EventEmitter<any>();
  public hyperlinkForm: FormGroup;
  public errors: ValidationError = {};
  private question;
  @Input() set questionToBeHyperlinked(input: any) {
    this.question = input ? input : null;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const urlValidateRegex =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    this.hyperlinkForm = this.fb.group({
      displayText: new FormControl(''),
      hyperlink: new FormControl('', [
        Validators.required,
        Validators.pattern(urlValidateRegex)
      ])
    });

    if (this.question && this.isHyperlink(this.question.value)) {
      this.displayText.patchValue(this.question.value.title);
      this.hyperlink.patchValue(this.question.value.link);
    }
  }

  isHyperlink(hyperlink: any) {
    return (
      hyperlink &&
      hyperlink.link &&
      typeof hyperlink.title === 'string' &&
      typeof hyperlink.link === 'string'
    );
  }

  get displayText(): FormControl {
    return this.hyperlinkForm.get('displayText') as FormControl;
  }

  get hyperlink(): FormControl {
    return this.hyperlinkForm.get('hyperlink') as FormControl;
  }

  urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      try {
        new URL(control.value);
        return null;
      } catch (error) {
        return { isInvalidURL: true };
      }
    };
  }

  submitHyperlink = () => {
    this.hyperlinkHandler.emit({
      title: this.displayText.value,
      link: this.hyperlink.value
    } as Hyperlink);
  };

  cancelHyperlink = () => {
    if (this.question && this.isHyperlink(this.question.value)) {
      const { title, link } = this.question.value;
      this.hyperlinkHandler.emit({
        title,
        link
      } as Hyperlink);
    } else
      this.hyperlinkHandler.emit({
        title: '',
        link: ''
      } as Hyperlink);
  };

  processValidationErrors(controlName: string): boolean {
    const touched = this.hyperlinkForm.get(controlName).touched;
    const errors = this.hyperlinkForm.get(controlName).errors;
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
}
