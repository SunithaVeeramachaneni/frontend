import { Component, OnInit } from '@angular/core';
import { MyOverlayRef } from '../../myoverlay-ref';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {UserAccountService} from '../../../user-management/user-account.service';
import {AlertService} from '../../alert/alert.service';
import { InstructionService } from '../../../workInstructions-home/categories/workinstructions/instruction.service';
import { ErrorInfo } from '../../../../interfaces/error-info';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html'
})

export class UserRegistrationComponent implements OnInit {
  constructor(public ref: MyOverlayRef,
              private instructionService: InstructionService,
              private alertService: AlertService,
              private userAccService: UserAccountService) {}

  public submitted = false;
  public userValidatedMsg: string = '';
  public registerFormGroup: FormGroup;

  ngOnInit() {
    // do nothing
    this.registerFormGroup = new FormGroup({
      empId : new FormControl('', [Validators.required]),
      email : new FormControl('', [Validators.required, Validators.email]),
      firstname : new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastname : new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerFormGroup.controls; }

  public checkError = (controlName: string, errorName: string) => {
    return this.registerFormGroup.controls[controlName].hasError(errorName);
  }

  onRegistrationSubmit(  ) {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    if (this.registerFormGroup.invalid) {
      return;
    }
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
    this.instructionService.getUsersByEmail(this.registerFormGroup.value.email).subscribe((res) => {
        this.alertService.clear();
        if (res && res.length !== 0) {
          this.alertService.error('User already exists', {keepAfterRouteChange: true});
        } else {
          if (this.registerFormGroup.value) {
            this.userAccService.register(this.registerFormGroup.value, info).subscribe(() => {
              this.alertService.success('Registration is Successful! Please check registered email', {keepAfterRouteChange: true});
              this.userAccService.sendApproveMail(this.registerFormGroup.value, info).subscribe(() => {
                this.ref.close();
              },
              error => this.alertService.error(this.instructionService.getErrorMessage(error), {keepAfterRouteChange: true})
              );
            }, (error) => {
              this.alertService.error(this.instructionService.getErrorMessage(error), {keepAfterRouteChange: true});
            });
          }
        }
      });
    // this.ref.close(this.registerFormGroup.value);
  }

  close() {
    this.ref.close(null);
  }


}
