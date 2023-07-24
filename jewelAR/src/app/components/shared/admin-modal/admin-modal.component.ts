import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { even } from '@rxweb/reactive-form-validators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { JewelInfo } from 'src/app/models/jewel-info';
import { JewelFields, JewelProperties, SubCategoriesForCategory } from 'src/app/models/jewel-properties';
import { UserInfo } from 'src/app/models/user-info';
import { LoginService } from 'src/app/services/login-service';

@Component({
  selector: 'app-admin-modal',
  templateUrl: './admin-modal.component.html',
  styleUrls: ['./admin-modal.component.css']
})
export class AdminModalComponent implements OnInit {

  title: string | undefined;
  jewelFieldsFormGroup: FormGroup;
  private _loginService;
  jewellers: JewelInfo[];
  purity: string[] = [];
  metalType: string[] = [];
  subCategoriesForCategory: SubCategoriesForCategory[] = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  jewelCategories = JewelProperties.categories;

  constructor(public modalService: BsModalService, private formBuilder: FormBuilder, private loginService: LoginService) {
    this._loginService = loginService;
  }

  ngOnInit(): void {
    this.jewelFieldsFormGroup = this.initForm();
    this.getJewellerDetails();
  }

  getJewellerDetails() {
    const jewellerId = sessionStorage.getItem('loggedInUserId');
    this._loginService.GetUserDetails(jewellerId).subscribe((jeweller) => {
      this.jewelCategories = jeweller.assignedCategories;
      let intialSubCategory = <SubCategoriesForCategory>({
        category: this.jewelCategories[1],
        subCategory: []
      });
      this.subCategoriesForCategory.push(intialSubCategory);
      this.populateInitialValues(jeweller);
    });
  }

  populateInitialValues(info: UserInfo){
    if(info.jewelFields && info.jewelFields.subCategoriesForCategory && info.jewelFields.subCategoriesForCategory.length) {
      this.subCategoriesForCategory = info.jewelFields.subCategoriesForCategory
    }
    if(info.jewelFields && info.jewelFields.purity && info.jewelFields.purity.length){
      this.purity = info.jewelFields.purity;
    }
    if(info.jewelFields && info.jewelFields.metalType && info.jewelFields.metalType.length){
      this.metalType = info.jewelFields.metalType;
    }
  }

  initForm() {
    return this.formBuilder.group({
      subCategory: [],
      purity: [, Validators.required],
      metalType: [, Validators.required],
    });
  }

  assignFormValues() {
    const formValues = this.jewelFieldsFormGroup.value;
    let jeweller = formValues.jeweller;
    jeweller.assignedCategories = formValues.category;
    return jeweller;
  }

  submit() {
    const id = sessionStorage.getItem('loggedInUserId');
    let jewelFields = <JewelFields>({
      jewellerId: id,
      subCategoriesForCategory: this.subCategoriesForCategory,
      purity: this.purity,
      metalType: this.metalType
    })
    this._loginService.UpdateJewelFieldsForJeweller(jewelFields).subscribe();
    this.modalService.hide();
  }

  cancel() {
    this.modalService.hide();
  }

  assignCategory(event: string, index: number) {
    this.subCategoriesForCategory[index].category = event;
  }

  add(event: MatChipInputEvent, fieldName: string, index: number = 0): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      switch (fieldName) {
        case "subCategory":
          this.subCategoriesForCategory[index].subCategory.push(value.trim());
          break;

        case "purity":
          this.purity.push(value.trim());
          break;

        case "metalType":
          this.metalType.push(value.trim());
          break;
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(value: string, fieldName: string, index: number = 0): void {
    switch (fieldName) {
      case "subCategory":
        let fieldIndex = this.subCategoriesForCategory[index].subCategory.indexOf(value);

        if (fieldIndex >= 0) {
          this.subCategoriesForCategory[index].subCategory.splice(fieldIndex, 1);
        }
        break;
      
      case "purity":
        let purityIndex = this.purity.indexOf(value);

        if (purityIndex >= 0) {
          this.purity.splice(purityIndex, 1);
        }
        break;
      
      case "metalType":
        let metalTypeIndex = this.metalType.indexOf(value);

        if (metalTypeIndex >= 0) {
          this.metalType.splice(metalTypeIndex, 1);
        }
        break;
    }

  }

  addCategoryField() {
    let intialSubCategory = <SubCategoriesForCategory>({
      category: this.jewelCategories[1],
      subCategory: []
    });
    this.subCategoriesForCategory.push(intialSubCategory);
  }
}
