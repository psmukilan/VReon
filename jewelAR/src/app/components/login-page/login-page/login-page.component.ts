import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RegisterUser, UserContact, UserCredentials, UserInfo } from 'src/app/models/user-info';
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
  registerFormGroup!: FormGroup;
  userContactFormGroup!: FormGroup;
  loggedInUserId: string;
  unsubscribe = new Subject<void>();
  userCredentials: UserCredentials;
  isInvalidUser: Boolean = false;
  inLoginMode: Boolean = true;
  showContactUs: Boolean = false;
  logoImage!: string;
  isRegistrationSuccessful: Boolean = true;
  userContactSaved: Boolean = false;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) {
    this._loginService = loginService;
  }

  ngOnInit(): void {
    this.signInFormGroup = this.initForm();
    this.registerFormGroup = this.initRegisterForm();
    this.userContactFormGroup = this.initContactForm();
  }


  initForm() {
    return this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  initRegisterForm() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  initContactForm() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
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
          sessionStorage.setItem("IsAdmin", String(user.isAdmin));
          sessionStorage.setItem("loggedInUserName", String(user.name));
          sessionStorage.setItem("loggedInUserLogo", String(user.logoImage));
          this.router.navigate(['/home', { id: this.loggedInUserId }]);
        }
      });
    this.signInFormGroup.reset();
  }

  registerUser() {
    const formValues = this.registerFormGroup.value;
    var userToRegister = new RegisterUser();
    userToRegister.name = formValues.name;
    userToRegister.email = formValues.email;
    userToRegister.password = formValues.password;
    userToRegister.isJeweller = false;
    userToRegister.isAdmin = false;
    userToRegister.logoImage = this.logoImage;
    this._loginService
      .RegisterUser(userToRegister)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (user) => {
          this.loggedInUserId = user.id;
          sessionStorage.setItem("loggedInUserId", this.loggedInUserId);
          sessionStorage.setItem("IsJeweller", String(user.isJeweller));
          sessionStorage.setItem("IsAdmin", String(user.isAdmin));
          sessionStorage.setItem("loggedInUserName", String(user.name));
          sessionStorage.setItem("loggedInUserLogo", String(user.logoImage));
          this.router.navigate(['/home', { id: this.loggedInUserId }]);
        },
        error: (error) => { this.isRegistrationSuccessful = false; }
      });
  }

  loginDefaultUser() {
    this.loginService.GetDefaultUser().subscribe((jeweller) => {
      sessionStorage.setItem("loggedInUserId", jeweller.id);
      sessionStorage.setItem("IsJeweller", String(jeweller.isJeweller));
      sessionStorage.setItem("loggedInUserName", String(jeweller.name));
      sessionStorage.setItem("loggedInUserLogo", String(jeweller.logoImage));
      this.router.navigate(['/home', { id: jeweller.id }]);
    });
  }

  showRegistrationForm() {
    this.inLoginMode = false;
  }

  onLogoSelected(event: any) {
    let file = event.target.files[0];
    if (file) {
      var reader = new FileReader();

      reader.onload = this.handleFile.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleFile(event: any) {
    var binaryString = event.target.result;
    this.logoImage = btoa(binaryString);
  }

  showContactUsForm() {
    this.inLoginMode = false;
    this.showContactUs = true;
  }

  showLoginForm() {
    this.inLoginMode = true;
    this.showContactUs = false;
  }

  saveUserContact() {
    const formValues = this.userContactFormGroup.value;
    var userContact = new UserContact();
    userContact.name = formValues.name;
    userContact.email = formValues.email;
    userContact.phoneNumber = formValues.phoneNumber;

    this._loginService
      .SaveUserContact(userContact)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (user) => {
          this.userContactSaved = true;
        },
        error: (error) => { this.isRegistrationSuccessful = false; }
      });
  }
}
