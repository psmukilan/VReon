import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserCredentials, UserInfo } from 'src/app/models/user-info';
import { LoginService } from 'src/app/services/login-service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  private _loginService;
  signInFormGroup!: FormGroup;
  loggedInUserId: string;
  unsubscribe = new Subject<void>();
  userCredentials: UserCredentials;
  isInvalidUser: Boolean = false;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) {
    this._loginService = loginService;
  }

  ngOnInit(): void {
    this.signInFormGroup = this.initForm();
  }


  initForm() {
    return this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginUser() {
    let formValues = this.signInFormGroup.value;
    const email = formValues.email;
    const password = formValues.password;
    this.userCredentials = this.signInFormGroup.value;
    this._loginService
      .ValidateUser(this.userCredentials)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((user: UserInfo) => {
        if (user == null) {
          this.isInvalidUser = true;
        }
        else {
          this.isInvalidUser = false;
          this.loggedInUserId = user.id;
          sessionStorage.setItem("loggedInUserId", this.loggedInUserId);
          sessionStorage.setItem("IsJeweller", String(user.isJeweller));
          this.router.navigate(['/home', { id: this.loggedInUserId }]);
        }
      });
    this.signInFormGroup.reset();
  }

  showRegistrationForm() {

  }
}
