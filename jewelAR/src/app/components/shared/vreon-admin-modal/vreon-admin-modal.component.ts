import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { JewelInfo } from 'src/app/models/jewel-info';
import { JewelProperties } from 'src/app/models/jewel-properties';
import { UserInfo } from 'src/app/models/user-info';
import { LoginService } from 'src/app/services/login-service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent} from '@angular/material/chips';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-admin-modal',
  templateUrl: './vreon-admin-modal.component.html',
  styleUrls: ['./vreon-admin-modal.component.css'],
})

export class VreonAdminModalComponent implements OnInit {
  title: string | undefined;
  jewelOptionsFormGroup: FormGroup;
  jewelCategories = JewelProperties.categories;
  private _loginService;
  jewellers: JewelInfo[];
  
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Fruit[] = [];

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

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
}
