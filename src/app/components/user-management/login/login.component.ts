import {Component, OnInit, TemplateRef} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {UserAccountService} from '../user-account.service';
import { first, tap } from 'rxjs/operators';
import {ComponentType} from '@angular/cdk/portal';
import {UserRegistrationComponent} from '../../modal/templates/user-registration/user-registration.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userAccService: UserAccountService,
  ) {}

  public submitted = false;
  public returnUrl: string;
  public loginFormGroup: FormGroup;
  public userRegSubscriptionComponent = UserRegistrationComponent;
  public passwordhide = true;
  public userValidatedMsg: string = '';
  public userRegDetailObject: any = {};

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required, Validators.minLength(8)])
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginFormGroup.controls; }

  public checkError = (controlName: string, errorName: string) => {
    return this.loginFormGroup.controls[controlName].hasError(errorName);
  }

  onSubmit(  ) {
    this.submitted = true;
    if (this.loginFormGroup.invalid) {
      return;
    }
    this.userAccService.login(this.f.email.value, this.f.password.value).subscribe(
      (userResp) => {
        if (userResp && userResp.length !== 0) {
          if (userResp[0].password === this.f.password.value) {
            userResp[0].password = window.btoa(userResp[0].password);
            localStorage.setItem('loggedInUser', JSON.stringify(userResp[0]));
            this.router.navigate([this.returnUrl]);
          } else {
              this.userValidatedMsg = 'Invalid Password!';
          }
        } else {
          this.userValidatedMsg = 'Invalid Email or Password!';
        }
      },
      error => {
        console.log(error);
      });
    }

  // open(content: TemplateRef<any> | ComponentType<any> | string, obj) {
  //   const ref = this.overlayService.open(content, obj);
  //   ref.afterClosed$.subscribe(res => {
  //     if (content === this.userRegSubscriptionComponent) {
  //       this.userRegDetailObject = res.data;
  //     }
  //   });
  // }
}

