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
import { JewelProperties } from '../../../models/jewel-properties';

@Component({
  selector: 'app-modal',
  templateUrl: './upload-file-modal.component.html',
  styleUrls: ['./upload-file-modal.component.css'],
})
export class UploadFileModalComponent implements OnInit {
  title: string | undefined;
  message: string | undefined;
  options: string[] = [];
  selectedTryOnImage!: string;
  selectedDisplayImages: string[] = [];
  jewelFormGroup!: FormGroup;
  jewelCategories = JewelProperties.categories;
  jewelPurity = JewelProperties.purity;
  private _jewelService;
  unsubscribe = new Subject<void>();

  constructor(
    public modalService: BsModalService,
    private formBuilder: FormBuilder,
    private jewelService: JewelService
  ) {
    this._jewelService = jewelService;
  }

  ngOnInit(): void {
    this.jewelFormGroup = this.initForm();
  }

  initForm() {
    return this.formBuilder.group({
      category: ['', Validators.required],
      purity: ['', Validators.required],
      weight: ['', Validators.required],
      price: ['', Validators.required],
      tryOnImage: new FormControl(null, [Validators.required]),
      displayImages: new FormControl(null, [Validators.required]),
    });
  }

  cancel() {
    this.modalService.hide();
  }

  submit() {
    var jewelFormValues = this.assignFormValues();
    this._jewelService
      .AddJewelInfo(jewelFormValues)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe();
    this.jewelFormGroup.reset();
    this.modalService.hide();
  }

  assignFormValues() {
    let formValues = this.jewelFormGroup.value;
    let jewelInfo = new JewelInfo();
    jewelInfo.category = formValues.category;
    jewelInfo.purity = formValues.purity;
    jewelInfo.weight = formValues.weight;
    jewelInfo.price = formValues.price;
    jewelInfo.jewellerId = '640062ee872031def6feed85';
    jewelInfo.image = this.selectedTryOnImage;
    jewelInfo.displayImages = this.selectedDisplayImages;
    return jewelInfo;
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
