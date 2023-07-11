import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { JewelInfo } from 'src/app/models/jewel-info';
import { JewelProperties } from 'src/app/models/jewel-properties';
import { UserInfo } from 'src/app/models/user-info';
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

  loadExistingCategories(jeweller: UserInfo) {
    if(jeweller.assignedCategories && jeweller.assignedCategories.length){
      this.jewelOptionsFormGroup.controls['category'].setValue(jeweller.assignedCategories);
    }
  }

  initForm() {
    return this.formBuilder.group({
      jeweller: [, Validators.required],
      category: [, Validators.required],
    });
  }

  getJewellers() {
    this._loginService.GetJewellers().subscribe((jewellers) => {
      this.jewellers = jewellers;
    });
  }

  assignFormValues() {
    const formValues = this.jewelOptionsFormGroup.value;
    let jeweller = formValues.jeweller;
    jeweller.assignedCategories = formValues.category;
    return jeweller;
  }

  submit() {
    const jewellerToUpdate = this.assignFormValues();
    this._loginService.UpdateCategoriesForJeweller(jewellerToUpdate.id, jewellerToUpdate).subscribe();
    this.modalService.hide();
  }

  cancel() {
    this.modalService.hide();
  }
}
