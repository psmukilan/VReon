import { Component, Input, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JewelInfo } from 'src/app/models/jewel-info';
import { JewelService } from 'src/app/services/jewel-service';
import * as facemesh from '@tensorflow-models/facemesh';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import { DetectJewel } from '../../../models/detectJewel';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/services/login-service';
import { UploadFileModalComponent } from '../modal/upload-file-modal.component';

@Component({
  selector: 'app-video-ar-content',
  templateUrl: './video-ar-content.component.html',
  styleUrls: ['./video-ar-content.component.css'],
})

export class VideoArContentComponent implements OnInit {
  jewels!: JewelInfo[];
  selectedJewel: JewelInfo[] = [];
  @Input() jewellerId: string;
  jewelsToDisplay!: JewelInfo[];
  jewelDisplayConstant = 10;
  currentStartPosition = 0;
  isLoading: boolean = false;
  image = document.getElementById('image') as HTMLImageElement;
  imageCanvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
  imageCanvasContext !: CanvasRenderingContext2D;
  showVideo: Boolean = false;
  video!: HTMLVideoElement;
  canvas!: HTMLCanvasElement;
  videoCanvasContext!: CanvasRenderingContext2D;
  capturedImages: string[] = [];
  intervalId!: any;
  isCompareModeOn: boolean = false;
  viewCapturedImages: boolean = false;
  detectJewelOnMainCanvas: boolean = true;
  videoInFocus: number = 1;
  detectJewelsOnVideo1 = new DetectJewel();
  detectJewelsOnVideo2 = new DetectJewel();
  currentCapturedImage!: string;
  imageToBeUploaded!: string;
  uploadedImage: string = "";
  bsModalRef!: BsModalRef;
  isEarringChecked: Boolean = false;
  isNecklaceChecked: Boolean = false;
  isNosepinChecked: Boolean = false;
  isNethichuttiChecked: Boolean = false;
  isAllJewelChecked: Boolean = true;
  previousXKeyPoint!: number;
  previousYKeyPoint!: number;
  images = ["../../../../assets/earring-multiple-images/img1.jpg",
    "../../../../assets/earring-multiple-images/img2.jpg",
    "../../../../assets/earring-multiple-images/img3.jpg",
    "../../../../assets/earring-multiple-images/img4.jpg"];
  displayImages: string[] = [];
  jewelCategoryFormGroup!: FormGroup;
  selectedJewelCategories: string[] = [];
  isJeweller: Boolean = false;

  @ViewChild('showImageUploadModal', { read: TemplateRef }) showImageUploadModal !: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private jewelService: JewelService,
    private bsModalService: BsModalService,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.jewelCategoryFormGroup = this.initForm();
    this.initializeVideoARElements();
    this.initializeImageARElements();
    this.getJewellerIdFromUrl();
  }

  initializeImageARElements() {
    this.image = document.getElementById('image') as HTMLImageElement;
    this.imageCanvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
    this.imageCanvasContext = this.imageCanvas.getContext('2d') as CanvasRenderingContext2D;
  }

  initializeVideoARElements() {
    this.video = document.getElementById('video') as HTMLVideoElement;
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.videoCanvasContext = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  initForm() {
    return this.formBuilder.group({
      All: new FormControl(true),
      Earring: new FormControl(false),
      Necklace: new FormControl(false),
      Nethichutti: new FormControl(false),
      Nosepin: new FormControl(false),
    });
  }

  getJewellerIdFromUrl() {
    let id=this.route.snapshot.paramMap.get("id");
    if(id){
      this.jewellerId = id;
      let checkIfJeweller = sessionStorage.getItem("IsJeweller");
      this.isJeweller = checkIfJeweller == "true" ? true : false;
      this.getJewelInfo();
    }
    else{
      this.getDefaultJeweller();
    }
  }

  getDefaultJeweller() {
    this.isLoading = true;
    this.loginService.GetDefaultUser().subscribe((jeweller) => {
      this.jewellerId = jeweller.id;
      sessionStorage.setItem("LoggedInUserId", this.jewellerId);
      sessionStorage.setItem("IsJeweller", String(jeweller.isJeweller));
      this.isJeweller = jeweller.isJeweller;
      this.router.navigate(['/home', { id: this.jewellerId }]);
      this.getJewellerIdFromUrl();
    });
  }

  getJewelInfo() {
    this.isLoading = true;
    this.jewelService.GetAllJewelsForJewellerId(this.jewellerId).subscribe((jewel) => {
      this.jewels = jewel;
      this.isLoading = false;
      this.jewelsToDisplay = this.jewels.length > this.jewelDisplayConstant ? this.jewels.slice(this.currentStartPosition, this.jewelDisplayConstant) : this.jewels;
      this.selectedJewel.push(this.jewels[0]);
      this.detectLandmarksOnImage();
    });
  }

  initializeModelImage() {
    const image = new Image();
    image.src = "../../../../assets/model-image.png";
    var canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.hidden = true;
    var ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const imageString = canvas.toDataURL();
    this.uploadedImage = imageString;
    this.detectLandmarksOnImage();
  }

  getCameraAccess() {
    this.isLoading = true;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        this.isLoading = false;
        this.detectLandmarks(this.video, this.videoCanvasContext);
      });
  }

  async detectLandmarks(inputVideo: HTMLVideoElement, inputCanvasContext: CanvasRenderingContext2D) {
    this.isLoading = true;
    this.canvas.hidden = false;

    // Load the Facemesh model
    const model = await facemesh.load();

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        inputVideo.srcObject = stream;
        inputVideo.play();
        //Start the webcam stream
        inputVideo.onloadeddata = (e) => {
          inputCanvasContext.clearRect(0, 0, inputVideo.width, inputVideo.height);
          // Detect facial landmarks in real-time
          this.intervalId = setInterval(async () => {
            if (this.detectJewelOnMainCanvas) {
              const predictions = await model.estimateFaces(inputVideo);
              if (predictions && predictions.length) {
                // Draw the facial landmarks on the canvas
                for (let i = 0; i < predictions.length; i++) {
                  const keypoints = predictions[i].scaledMesh as any[];
                  let width = inputVideo.width;
                  let height = inputVideo.height;
                  inputCanvasContext.drawImage(this.video, 0, 0, width, height);
                  this.isLoading = false;

                  const referenceXKeyPoint = keypoints[168][0];
                  const referenceYKeyPoint = keypoints[168][1];
                  if (referenceXKeyPoint < (this.previousXKeyPoint - 10) || referenceXKeyPoint > (this.previousXKeyPoint + 10)) {

                  }
                  this.selectedJewel.forEach((jewel) => {
                    this.drawJewelOnCanvas(jewel, inputCanvasContext, keypoints, width, height);
                  })

                  this.previousXKeyPoint = referenceXKeyPoint;
                  this.previousYKeyPoint = referenceYKeyPoint;
                }
              }
              else {
                inputCanvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
                const noFaceImage = new Image();
                noFaceImage.src = "../../../../assets/no-face.png";
                inputCanvasContext.drawImage(noFaceImage, 0, 0, noFaceImage.width, noFaceImage.height);
              }
            }
          }, 200);
        }
      });
  }

  drawJewelOnImageCanvas(jewel: JewelInfo, ctx: CanvasRenderingContext2D, keypoints: any[], width: number, height: number) {
    switch (jewel.category) {
      case "Earring":
        const [earring_x1, earring_y1, earring_z1] = keypoints[93];
        const [earring_x2, earring_y2, earring_z2] = keypoints[323];
        const eyeDistanceForEarring = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
        const earringImage = new Image();
        const currentEarringImage = jewel.image;
        earringImage.src = "data:image/png;base64," + currentEarringImage;
        earringImage.onload = (e) => {
          ctx.drawImage(earringImage, Math.abs(earring_x1 - eyeDistanceForEarring / 2 - 10), earring_y1, eyeDistanceForEarring, eyeDistanceForEarring);
          ctx.drawImage(earringImage, Math.abs(earring_x2 - eyeDistanceForEarring / 2 + 10), earring_y2, eyeDistanceForEarring, eyeDistanceForEarring);
        }
        break;

      case "Necklace":
        const [necklace_x, necklace_y, necklace_z] = keypoints[136];
        const eyeDistanceForNecklace = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
        const necklaceImage = new Image();
        const currentNecklaceImage = jewel.image;
        necklaceImage.src = "data:image/png;base64," + currentNecklaceImage;
        necklaceImage.onload = (e) => {
          ctx.drawImage(necklaceImage, necklace_x - (eyeDistanceForNecklace * 1.8), necklace_y, eyeDistanceForNecklace * 5, eyeDistanceForNecklace * 5);
        }
        break;

      case "Nosepin":
        const [nosePin_x, nosePin_y, nosePin_z] = keypoints[457];
        const eyeDistanceForNosePin = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
        const nosePinImage = new Image();
        const currentNosePinImage = jewel.image;
        nosePinImage.src = "data:image/png;base64," + currentNosePinImage;
        nosePinImage.onload = (e) => {
          ctx.drawImage(nosePinImage, Math.abs(nosePin_x - eyeDistanceForNosePin), Math.abs(nosePin_y - (eyeDistanceForNosePin * 0.9)), eyeDistanceForNosePin * 1.8, eyeDistanceForNosePin * 1.8);
        }
        break;

      case "Nethichutti":
        const [nethichutti_x, nethichutti_y, nethichutti_z] = keypoints[10];
        const eyeDistanceForNethichutti = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
        const nethichuttiImage = new Image();
        const currentNethichuttiImage = jewel.image;
        nethichuttiImage.src = "data:image/png;base64," + currentNethichuttiImage;
        nethichuttiImage.onload = (e) => {
          ctx.drawImage(nethichuttiImage, Math.abs(nethichutti_x - (eyeDistanceForNethichutti)), Math.abs(nethichutti_y - (eyeDistanceForNethichutti)), eyeDistanceForNethichutti * 2, eyeDistanceForNethichutti * 2);
        }
        break;
    }
  }

  drawJewelOnCanvas(jewel: JewelInfo, ctx: CanvasRenderingContext2D, keypoints: any[], width: number, height: number) {
    switch (jewel.category) {
      case "Earring":
        const [earring_x1, earring_y1, earring_z1] = keypoints[93];
        const [earring_x2, earring_y2, earring_z2] = keypoints[323];
        const eyeDistanceForEarring = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
        const earringImage = new Image();
        const currentEarringImage = jewel.image;
        earringImage.src = "data:image/png;base64," + currentEarringImage;
        earringImage.onload = (e) => {
          let eardepth1 = Math.abs(earring_z1);
          let eardepth2 = Math.abs(earring_z2);
          if ((Math.abs(eardepth1 - eardepth2) > 40)) {
            if (eardepth1 < eardepth2) {
              ctx.drawImage(earringImage, Math.abs(earring_x1 - eyeDistanceForEarring / 2 - 10), earring_y1, eyeDistanceForEarring, eyeDistanceForEarring);
            }
            if (eardepth2 < eardepth1) {
              ctx.drawImage(earringImage, Math.abs(earring_x2 - eyeDistanceForEarring / 2 + 10), earring_y2, eyeDistanceForEarring, eyeDistanceForEarring);
            }
          } else {
            ctx.drawImage(earringImage, Math.abs(earring_x1 - eyeDistanceForEarring / 2 - 10), earring_y1, eyeDistanceForEarring, eyeDistanceForEarring);
            ctx.drawImage(earringImage, Math.abs(earring_x2 - eyeDistanceForEarring / 2 + 10), earring_y2, eyeDistanceForEarring, eyeDistanceForEarring);
          }
        }
        break;

      case "Necklace":
        const [necklace_x, necklace_y, necklace_z] = keypoints[136];
        const eyeDistanceForNecklace = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
        const necklaceImage = new Image();
        const currentNecklaceImage = jewel.image;
        necklaceImage.src = "data:image/png;base64," + currentNecklaceImage;
        necklaceImage.onload = (e) => {
          ctx.drawImage(necklaceImage, necklace_x - (eyeDistanceForNecklace * 2), necklace_y, eyeDistanceForNecklace * 5, eyeDistanceForNecklace * 5);
        }
        break;

      case "Nosepin":
        const [nosePin_x, nosePin_y, nosePin_z] = keypoints[457];
        const eyeDistanceForNosePin = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
        const nosePinImage = new Image();
        const currentNosePinImage = jewel.image;
        nosePinImage.src = "data:image/png;base64," + currentNosePinImage;
        nosePinImage.onload = (e) => {
          ctx.drawImage(nosePinImage, Math.abs(nosePin_x - eyeDistanceForNosePin), Math.abs(nosePin_y - (eyeDistanceForNosePin * 0.9)), eyeDistanceForNosePin * 1.8, eyeDistanceForNosePin * 1.8);
        }
        break;

      case "Nethichutti":
        const [nethichutti_x, nethichutti_y, nethichutti_z] = keypoints[10];
        const eyeDistanceForNethichutti = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
        const nethichuttiImage = new Image();
        const currentNethichuttiImage = jewel.image;
        nethichuttiImage.src = "data:image/png;base64," + currentNethichuttiImage;
        nethichuttiImage.onload = (e) => {
          ctx.drawImage(nethichuttiImage, Math.abs(nethichutti_x - (eyeDistanceForNethichutti)), Math.abs(nethichutti_y - (eyeDistanceForNethichutti)), eyeDistanceForNethichutti * 2, eyeDistanceForNethichutti * 2);
        }
        break;
    }
  }

  enableVideo() {
    this.showVideo = true;
    this.getCameraAccess();
  }

  CalculateEyeDistance(rightEye: any[], leftEye: any[], width: number, height: number): number {
    const x1 = rightEye[0];
    const y1 = rightEye[1];
    const x2 = leftEye[0];
    const y2 = leftEye[1];
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }

  changeJewel(jewel: JewelInfo) {
    let jewelIndex = this.selectedJewel.findIndex(x => x.category == jewel.category)
    if (jewelIndex >= 0) {
      let isSameJewel = this.selectedJewel.findIndex(x => x.id == jewel.id);
      if (isSameJewel >= 0) {
        this.selectedJewel.splice(isSameJewel, 1);
      }
      else {
        this.selectedJewel.splice(jewelIndex, 1);
        this.selectedJewel.push(jewel);
        this.displayImages = jewel.displayImages;
        this.detectLandmarksOnImage();
      }
    }
    else {
      this.selectedJewel.push(jewel);
      this.displayImages = jewel.displayImages;
      this.detectLandmarksOnImage();
    }
  }

  goRight() {
    const numberOfJewels = this.jewels.length;
    const startPosition = this.currentStartPosition < numberOfJewels - 1 ? this.currentStartPosition + 1 : numberOfJewels - 1;
    const endPosition = numberOfJewels > startPosition + this.jewelDisplayConstant ? startPosition + this.jewelDisplayConstant : numberOfJewels;
    if (endPosition - startPosition == this.jewelDisplayConstant) {
      this.jewelsToDisplay = this.jewels.slice(startPosition, endPosition);
      this.currentStartPosition = startPosition;
    }
  }

  goLeft() {
    const numberOfJewels = this.jewels.length;
    const startPosition = this.currentStartPosition > 0 ? this.currentStartPosition - 1 : 0;
    const endPosition = numberOfJewels <= startPosition + this.jewelDisplayConstant ? numberOfJewels : startPosition + this.jewelDisplayConstant;
    this.jewelsToDisplay = this.jewels.slice(startPosition, endPosition);
    this.currentStartPosition = startPosition;
  }

  async detectLandmarksOnImage() {
    this.imageCanvasContext.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
    this.imageCanvasContext.drawImage(this.image, 0, 0, this.image.width, this.image.height);
    this.image.hidden = true;
    this.imageCanvas.hidden = false;

    // Load the Facemesh model
    const model = await facemesh.load();
    const predictions = await model.estimateFaces(this.image);

    // Draw the facial landmarks on the canvas
    for (let i = 0; i < predictions.length; i++) {
      const keypoints = predictions[i].scaledMesh as any[];
      let width = this.image.width;
      let height = this.image.height;
      if (this.selectedJewel && this.selectedJewel.length) {
        this.selectedJewel.forEach((jewel) => {
          this.drawJewelOnCanvas(jewel, this.imageCanvasContext, keypoints, width, height);
        })
      }
    }
  }

  captureImage() {
    const imageData = this.videoCanvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
    var canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.hidden = true;
    var ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);

    const imageString = canvas.toDataURL();
    sessionStorage.setItem('capturedImage', imageString);
    this.capturedImages.push(imageString);
    this.currentCapturedImage = this.capturedImages[0];
  }

  enableFullScreenMode() {
    this.canvas.requestFullscreen();
  }

  stopInterval() {
    clearInterval(this.intervalId);
  }

  disableVideoStream() {
    this.stopInterval();
    const stream = this.video.srcObject as MediaStream;
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });
    this.video.srcObject = null;
    this.canvas.hidden = true;
    this.showVideo = false;
  }

  enableCompareMode() {
    this.isCompareModeOn = true;
    this.detectJewelOnMainCanvas = false;
    const videoForComparison1 = document.getElementById('videoForComparison1') as HTMLVideoElement;
    const videoForComparison2 = document.getElementById('videoForComparison2') as HTMLVideoElement;

    const canvasForComparison1 = document.getElementById('canvasForComparison1') as HTMLCanvasElement;
    const canvasForComparison2 = document.getElementById('canvasForComparison2') as HTMLCanvasElement;
    canvasForComparison1.hidden = false;
    canvasForComparison2.hidden = false;

    const videoCanvasContext1 = canvasForComparison1.getContext('2d') as CanvasRenderingContext2D;
    const videoCanvasContext2 = canvasForComparison2.getContext('2d') as CanvasRenderingContext2D;

    this.detectJewelsOnVideo1.selectedJewels.push(this.jewels[0]);
    this.detectJewelsOnVideo2.selectedJewels.push(this.jewels[1]);

    this.detectJewelsOnVideo1.detectLandmarks(videoForComparison1, videoCanvasContext1);
    this.detectJewelsOnVideo2.detectLandmarks(videoForComparison2, videoCanvasContext2);
  }

  disableCompareMode() {
    this.isCompareModeOn = false;
    this.detectJewelsOnVideo1.cancelTimer();
    this.detectJewelsOnVideo2.cancelTimer();
    const canvasForComparison1 = document.getElementById('canvasForComparison1') as HTMLCanvasElement;
    const canvasForComparison2 = document.getElementById('canvasForComparison2') as HTMLCanvasElement;
    canvasForComparison1.hidden = true;
    canvasForComparison2.hidden = true;
    this.detectJewelOnMainCanvas = true;
  }

  toggleVideoInFocus(video: number) {
    this.videoInFocus = video;
  }

  changeJewelForVideoInFocus(jewel: JewelInfo) {
    let jewelArray = this.videoInFocus == 1 ? this.detectJewelsOnVideo1.selectedJewels : this.detectJewelsOnVideo2.selectedJewels;
    let jewelIndex = jewelArray.findIndex(x => x.category == jewel.category)
    if (jewelIndex >= 0) {
      let isSameJewel = jewelArray.findIndex(x => x.id == jewel.id);
      if (isSameJewel >= 0) {
        jewelArray.splice(isSameJewel, 1);
      }
      else {
        jewelArray.splice(jewelIndex, 1);
        jewelArray.push(jewel);
      }
    }
    else {
      jewelArray.push(jewel);
    }
  }

  exitFullScreen() {
    this.viewCapturedImages = false;
  }

  viewCapturedPictures() {
    if (this.capturedImages && this.capturedImages.length) {
      this.viewCapturedImages = true;
    }
  }

  prevImage() {
    const index = this.capturedImages.findIndex(x => x == this.currentCapturedImage);
    this.currentCapturedImage = index > 0 ? this.capturedImages[index - 1] : this.currentCapturedImage;
  }

  nextImage() {
    const index = this.capturedImages.findIndex(x => x == this.currentCapturedImage);
    this.currentCapturedImage = index <= this.capturedImages.length - 2 && index >= 0 ? this.capturedImages[index + 1] : this.currentCapturedImage;
  }

  viewSelectedImage(image: string) {
    this.currentCapturedImage = image;
  }

  uploadImage() {
    const initialState = {
      title: 'Upload Jewel Information',
    };

    this.bsModalRef = this.bsModalService.show(this.showImageUploadModal, {
      initialState,
      class: 'modal-sm',
    });
  }

  hideImageUploadModal() {
    this.bsModalService.hide();
  }

  onImageSelected(event: any) {
    let file = event.target.files[0];
    if (file) {
      var reader = new FileReader();

      reader.onload = this.handleFile.bind(this);

      reader.readAsBinaryString(file);
    }
  }

  handleFile(event: any) {
    var binaryString = event.target.result;
    this.imageToBeUploaded = btoa(binaryString);
  }

  isUploadedImageAvailable() {
    if (this.uploadedImage != "") {
      return true;
    }
    else {
      return false;
    }
  }

  submit() {
    this.uploadedImage = this.imageToBeUploaded;
    this.bsModalService.hide();
    this.detectLandmarksOnImage();
  }

  cancel() {
    this.imageToBeUploaded = "";
    this.bsModalService.hide();
  }

  showCollection() {
    if (this.selectedJewelCategories.length == 0) {
      this.jewelService.GetAllJewelsForJewellerId(this.jewellerId).subscribe((jewel) => {
        this.jewels = jewel;
        this.jewelsToDisplay = this.jewels.length > this.jewelDisplayConstant ? this.jewels.slice(0, this.jewelDisplayConstant) : this.jewels;
        this.detectLandmarksOnImage();
      });
    }
    else {
      this.jewelService.GetJewelsByCategories(this.selectedJewelCategories, this.jewellerId).subscribe((jewel) => {
        this.jewels = jewel;
        this.jewelsToDisplay = this.jewels.length > this.jewelDisplayConstant ? this.jewels.slice(0, this.jewelDisplayConstant) : this.jewels;
        this.detectLandmarksOnImage();
      });
    }
  }

  toggleCheckBoxes(category: string) {
    if (category == "All") {
      this.jewelCategoryFormGroup.get('All').setValue(true);
      this.jewelCategoryFormGroup.get('Earring').setValue(false);
      this.jewelCategoryFormGroup.get('Necklace').setValue(false);
      this.jewelCategoryFormGroup.get('Nethichutti').setValue(false);
      this.jewelCategoryFormGroup.get('Nosepin').setValue(false);
      this.selectedJewelCategories = [];
    } else {
      const previousValue: boolean = this.jewelCategoryFormGroup.get(category).value;
      const currentValue: Boolean = !previousValue;
      this.jewelCategoryFormGroup.get(category).setValue(currentValue);
      this.addOrRemoveJewelCategory(category, currentValue);
    }
    this.showCollection();

    let isAnyCheckboxSelected: Boolean = false;
    Object.keys(this.jewelCategoryFormGroup.controls).forEach(key => {
      isAnyCheckboxSelected = isAnyCheckboxSelected || this.jewelCategoryFormGroup.controls[key].value;
    });

    if (!isAnyCheckboxSelected) {
      this.jewelCategoryFormGroup.get('All').setValue(true);
    }
  }

  addOrRemoveJewelCategory(category: string, currentValue: Boolean) {
    if (currentValue) {
      this.selectedJewelCategories.push(category);
      this.jewelCategoryFormGroup.get('All').setValue(false);
    } else {
      const index = this.selectedJewelCategories.findIndex(x => x == category);
      this.selectedJewelCategories.splice(index, 1);
    }
  }

  
  openFileUploadModal() {
    const modalOptions = {
      backdrop: true,
      ignoreBackdropClick: true,
      keyboard: false,
      animated: true,
      class: 'modal-lg',
    } as ModalOptions;

    const initialState = {
      title: 'Upload Jewel Information',
    };

    this.bsModalRef = this.bsModalService.show(UploadFileModalComponent, {
      initialState,
      class: 'modal-lg',
    });
  }
}
