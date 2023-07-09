import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { JewelInfo } from 'src/app/models/jewel-info';
import { JewelProperties } from 'src/app/models/jewel-properties';
import { LoginService } from 'src/app/services/login-service';

@Component({
  selector: 'app-admin-modal',
  templateUrl: './admin-modal.component.html',
  styleUrls: ['./admin-modal.component.css']
})
export class AdminModalComponent implements OnInit {
  title: string | undefined;
  jewelOptionsFormGroup: FormGroup;
  jewelCategories = JewelProperties.categories;
  private _loginService;
  jewellers: JewelInfo[];

  constructor(public modalService: BsModalService, private formBuilder: FormBuilder, private loginService: LoginService) {
    this._loginService = loginService;
   }

  ngOnInit(): void {
    this.jewelOptionsFormGroup = this.initForm();
    this.getJewellers();
  }

  initForm() {
    return this.formBuilder.group({
      jewellerName: [, Validators.required],
      category: [, Validators.required],
      purity: [, Validators.required],
    });
  }

  getJewellers() {
    this._loginService.GetJewellers().subscribe((jewellers) => {
      this.jewellers = jewellers;
    });
  }

  submit() {

  }

  cancel() {

  }
}
