import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import { JewelInfo } from 'src/app/models/jewel-info';
import { JewelService } from 'src/app/services/jewel-service';
import { JewelProperties, SubCategoriesForCategory } from '../../../models/jewel-properties';
import { LoginService } from 'src/app/services/login-service';

@Component({
  selector: 'app-modal',
  templateUrl: './upload-file-modal.component.html',
  styleUrls: ['./upload-file-modal.component.css'],
})
export class UploadFileModalComponent implements OnInit {
  [x: string]: any;
  title: string | undefined;
  message: string | undefined;
  options: string[] = [];
  selectedTryOnImage!: string;
  selectedDisplayImages: string[] = [];
  jewelFormGroup!: FormGroup;
  jewelCategories = JewelProperties.categories;
  allSubCategories: SubCategoriesForCategory[];
  jewelSubCategories: string[] = [];
  jewelMetalType = JewelProperties.metalType;
  jewelPurity = JewelProperties.purity;
  private _jewelService;
  private _loginService;
  unsubscribe = new Subject<void>();
  isFormInValid = false;
  necklaceLengths = [12, 14, 16, 20, 24, 28, 34, 38, 42];
  isNecklaceCategorySelected: Boolean = false;
  isSubmitted: Boolean = false;

  constructor(
    public modalService: BsModalService,
    private formBuilder: FormBuilder,
    private jewelService: JewelService,
    private loginService: LoginService
  ) {
    this._jewelService = jewelService;
    this._loginService = loginService;
  }

  ngOnInit(): void {
    this.jewelFormGroup = this.initForm();
    this.getJewellerDetails();
  }

  getJewellerDetails() {
    const jewellerId = sessionStorage.getItem('loggedInUserId');
    this._loginService.GetUserDetails(jewellerId).subscribe((jeweller) => {
      this.jewelCategories = jeweller.assignedCategories;
      this.allSubCategories = jeweller.jewelFields.subCategoriesForCategory ? jeweller.jewelFields.subCategoriesForCategory : [];
      this.jewelPurity = jeweller.jewelFields.purity ? jeweller.jewelFields.purity : JewelProperties.purity;
      this.jewelMetalType = jeweller.jewelFields.metalType ? jeweller.jewelFields.metalType : JewelProperties.metalType;
    });
  }

  initForm() {
    return this.formBuilder.group({
      category: ['', Validators.required],
      subCategory: [''],
      purity: ['', Validators.required],
      weight: [, Validators.required, Validators.pattern("^[0-9]*$")],
      metalType: ['', Validators.required],
      price: [, Validators.required, Validators.pattern("^[0-9]*$")],
      tryOnImage: new FormControl(null, [Validators.required]),
      displayImages: new FormControl(null, [Validators.required]),
      necklaceLength: [''],
      description: ['']
    });
  }

  cancel() {
    this.modalService.hide();
  }

  submit() {
    this.isSubmitted = true;
    if (this.jewelFormGroup.get('weight').errors?.['pattern'] ||
      this.jewelFormGroup.controls['price'].errors?.['pattern'] ||
      this.selectedTryOnImage == undefined ||
      this.selectedDisplayImages.length == 0 ||
      this.jewelFormGroup.get('weight').value <= 0 ||
      this.jewelFormGroup.get('price').value <= 0
    ) {
      this.isFormInValid = true;
    } else {
      var jewelFormValues = this.assignFormValues();
      this._jewelService
        .AddJewelInfo(jewelFormValues)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe();
      this.isSubmitted = false;
      this.jewelFormGroup.reset();
      this.modalService.hide();
    }
  }

  assignFormValues() {
    const loggedInUser = sessionStorage.getItem("loggedInUserId");
    let formValues = this.jewelFormGroup.value;
    let jewelInfo = <JewelInfo>({
      category: formValues.category,
      purity: formValues.purity,
      weight: formValues.weight,
      price: formValues.price,
      subCategory: formValues.subCategory,
      metalType: formValues.metalType,
      jewellerId: loggedInUser != null ? loggedInUser : '640062ee872031def6feed85',
      image: this.selectedTryOnImage,
      displayImages: this.selectedDisplayImages,
      description: formValues.description
    });
    jewelInfo.necklaceLength = jewelInfo.category == "Necklace" ? formValues.necklaceLength : undefined;
    return jewelInfo;
  }

  getSubCategoriesForCategory(category: string) {
    let subCategories = this.allSubCategories.filter(x => x.category == category)[0].subCategory;
    this.jewelSubCategories = subCategories;
    this.checkIfNecklace(category);
  }

  checkIfNecklace(category: string) {
    this.isNecklaceCategorySelected = category == "Necklace" ? true : false;
  }

  onFileSelected(event: any) {
    let file = event.target.files[0];
    if (file) {
      var reader = new FileReader();

      reader.onload = this.handleFile.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleFile(event: any) {
    var binaryString = event.target.result;
    this.selectedTryOnImage = btoa(binaryString);
  }

  handleDisplayImageSelection(event: any) {
    var binaryString = event.target.result;
    var imageString = btoa(binaryString);
    this.selectedDisplayImages.push(imageString);
  }

  onDisplayImageSelected(event: any) {
    let files = event.target.files as FileList;

    if (files && files.length) {
      Array.from(files).forEach((file) => {
        var reader = new FileReader();
        reader.onload = this.handleDisplayImageSelection.bind(this);
        reader.readAsBinaryString(file);
      });
    }
  }
}
