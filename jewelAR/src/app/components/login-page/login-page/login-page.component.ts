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
import { JewelProperties } from 'src/app/models/jewel-properties';

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
  isVReonAdmin: Boolean = false;
  jewelCategories = JewelProperties.categories;
  isLoginSubmitted: Boolean = false;
  isRegisterSubmitted: Boolean = false;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) {
    this._loginService = loginService;
  }

  ngOnInit(): void {
    let checkIfVReonAdmin = sessionStorage.getItem("IsVReonAdmin");
    this.isVReonAdmin = checkIfVReonAdmin == "true" ? true : false;
    this.signInFormGroup = this.initForm();
    this.registerFormGroup = this.initRegisterForm();
    this.userContactFormGroup = this.initContactForm();
  }

  initForm() {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  initRegisterForm() {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      vreonAdmin: [false],
      admin: [false],
      jeweller: [false],
      assignedCategories: ['', Validators.required]
    });
  }

  initContactForm() {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
    });
  }

  loginUser() {
    this.userCredentials = this.signInFormGroup.value;
    this.isLoginSubmitted = true;
    if (!this.signInFormGroup.get('email').errors?.['required'] &&
      !this.signInFormGroup.get('password').errors?.['required']) {
      this._loginService
        .ValidateUser(this.userCredentials)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((user: UserInfo) => {
          this.isLoginSubmitted = false;
          if (user == null) {
            this.isInvalidUser = true;
          }
          else {
            this.isInvalidUser = false;
            this.loggedInUserId = user.id;
            sessionStorage.setItem("loggedInUser", JSON.stringify(user));
            sessionStorage.setItem("loggedInUserId", this.loggedInUserId);
            sessionStorage.setItem("IsJeweller", String(user.isJeweller));
            sessionStorage.setItem("IsAdmin", String(user.isAdmin));
            sessionStorage.setItem("IsVReonAdmin", String(user.isVReonAdmin));
            sessionStorage.setItem("loggedInUserName", String(user.name));
            sessionStorage.setItem("loggedInUserLogo", String(user.logoImage));
            this.router.navigate(['/home', { id: this.loggedInUserId }]);
          }
        });
      this.signInFormGroup.reset();
    }
  }

  registerUser() {
    this.isRegisterSubmitted = true;
    if (this.registerFormGroup.valid) {
      const formValues = this.registerFormGroup.value;
      var userToRegister = new RegisterUser();
      userToRegister.name = formValues.name;
      userToRegister.email = formValues.email;
      userToRegister.password = formValues.password;
      userToRegister.isJeweller = formValues.jeweller;
      userToRegister.isAdmin = formValues.admin;
      userToRegister.isVReonAdmin = formValues.vreonAdmin;
      userToRegister.logoImage = this.logoImage;
      userToRegister.assignedCategories = formValues.assignedCategories;
      this._loginService
        .RegisterUser(userToRegister)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          next: (user) => {
            this.loggedInUserId = user.id;
            sessionStorage.setItem("loggedInUser", JSON.stringify(user));
            sessionStorage.setItem("loggedInUserId", this.loggedInUserId);
            sessionStorage.setItem("IsJeweller", String(user.isJeweller));
            sessionStorage.setItem("IsAdmin", String(user.isAdmin));
            sessionStorage.setItem("IsVReonAdmin", String(user.isVReonAdmin));
            sessionStorage.setItem("loggedInUserName", String(user.name));
            sessionStorage.setItem("loggedInUserLogo", String(user.logoImage));
            this.router.navigate(['/home', { id: this.loggedInUserId }]);
          },
          error: (error) => { this.isRegistrationSuccessful = false; }
        });
    }

  }

  loginDefaultUser() {
    this.loginService.GetDefaultUser().subscribe((jeweller) => {
      sessionStorage.setItem("loggedInUserId", jeweller.id);
      sessionStorage.setItem("IsJeweller", String(jeweller.isJeweller));
      sessionStorage.setItem("IsVReonAdmin", String(jeweller.isVReonAdmin));
      sessionStorage.setItem("IsAdmin", String(jeweller.isAdmin));
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
