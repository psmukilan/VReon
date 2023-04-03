import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JewelInfo } from 'src/app/models/jewel-info';
import { JewelService } from 'src/app/services/jewel-service';
import * as facemesh from '@tensorflow-models/facemesh';
import * as bodypose from '@tensorflow-models/posenet';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import { DetectJewel } from '../../../models/detectJewel';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-video-ar-content',
  templateUrl: './video-ar-content.component.html',
  styleUrls: ['./video-ar-content.component.css'],
})

export class VideoArContentComponent implements OnInit {
  jewels!: JewelInfo[];
  @Input() selectedJewel: JewelInfo[] = [];
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

  @ViewChild('showImageUploadModal', { read: TemplateRef }) showImageUploadModal !:TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private jewelService: JewelService,
    private bsModalService: BsModalService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.initializeVideoARElements();
    this.initializeImageARElements();
    this.getJewelInfo();
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

  getJewelInfo() {
    this.isLoading = true;
    const jewelId = this.route.snapshot.paramMap.get('id');
    this.jewelService.GetAllJewels().subscribe((jewel) => {
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
    // this.http.get('../../../../assets/model-image.png', { responseType: 'blob' }).subscribe(blob => {
    //   const reader = new FileReader();
    //   reader.readAsDataURL(blob);
    //   reader.onloadend = () => {
    //     const base64String = reader.result.toString().split(',')[1];
    //     this.uploadedImage = "data:image/png;base64," + base64String;
    //     this.detectLandmarksOnImage();
    //   };
    // });
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

  async detectLandmarks(inputVideo: HTMLVideoElement, inputCanvasContext: CanvasRenderingContext2D, jewelArray: JewelInfo[] = this.selectedJewel) {
    this.isLoading = true;
    this.canvas.hidden = false;

    // Load the Facemesh model
    const model = await facemesh.load();
    // load body pose model
    const bodymodel = await bodypose.load();

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        inputVideo.srcObject = stream;
        inputVideo.play();
        //Start the webcam stream
        inputVideo.onloadeddata = (e) => {
          // Detect facial landmarks in real-time
          this.intervalId = setInterval(async () => {
            if (this.detectJewelOnMainCanvas) {
              const predictions = await model.estimateFaces(inputVideo);
              const bodypredictions = await bodymodel.estimateSinglePose(inputVideo);
              if (bodypredictions){
                for(let i=0;i<bodypredictions.keypoints.length;i++){
                  const posepoints=bodypredictions.keypoints as any[];                 
                  
                  jewelArray.forEach((jewel) => {
                    
                    this.drawdressoncanvas(jewel,inputCanvasContext,posepoints);
                  })

              }
            }
              if (predictions && predictions.length) {
                // Draw the facial landmarks on the canvas
                inputCanvasContext.clearRect(0, 0, inputVideo.width, inputVideo.height);
                for (let i = 0; i < predictions.length; i++) {
                  // const posepoints = bodypredictions.keypoints[5];
                  // const shoulder_x= posepoints.position.x;
                  // const shoulder_y= bodypredictions.keypoints[5].position.y;
                  // console.log(shoulder_x,shoulder_y);
                  const keypoints = predictions[i].scaledMesh as any[];
                  
                  let width = inputVideo.width;
                  let height = inputVideo.height;

                  inputCanvasContext.drawImage(this.video, 0, 0, width, height);
                  this.isLoading = false;

                  jewelArray.forEach((jewel) => {
                    this.drawJewelOnCanvas(jewel, inputCanvasContext, keypoints, width, height);
                    
                  })
                }
              }
              else {
                inputCanvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
                const noFaceImage = new Image();
                noFaceImage.src = "../../../../assets/no-face.png";
                inputCanvasContext.drawImage(noFaceImage, 0, 0, noFaceImage.width, noFaceImage.height);
              }
            }
          }, 350);
        }
      });
  }

  drawdressoncanvas(jewel: JewelInfo,ctx: CanvasRenderingContext2D, posepoints: any[]){
    
    switch(jewel.category){
      case "Shirts":
        const leftshoulder_x=posepoints[5].position.x;
        const leftshoulder_y= posepoints[5].position.y;
        const rightshoulder_x=posepoints[6].position.x;
        const rightshoulder_y=posepoints[6].position.y;
        const shirtpoint_x= (rightshoulder_x+leftshoulder_x)/2;
        const shirtpoint_y = (rightshoulder_y+leftshoulder_y)/2;
        const size= Math.sqrt((rightshoulder_x - leftshoulder_x) ** 2 + (rightshoulder_y - leftshoulder_y) ** 2);

        const shirtimage= new Image();
        const currentShirtImage= jewel.image;
        shirtimage.src= "data:image/png;base64," + currentShirtImage;
        shirtimage.onload = (e)=>{
          ctx.drawImage(shirtimage,shirtpoint_x-(size/1.02),shirtpoint_y-(size/2.7),size*2,size*2);
        }
               
        break;

        case "frock":
          const leftfrog_x=posepoints[5].position.x;
          const leftfrog_y= posepoints[5].position.y;
          const rightfrog_x=posepoints[6].position.x;
          const rightfrog_y=posepoints[6].position.y;
          const frogpoint_x= (rightfrog_x+leftfrog_x)/2;
          const frogpoint_y = (rightfrog_y+leftfrog_y)/2;
          const frogsize= Math.sqrt((rightfrog_x - leftfrog_x) ** 2 + (rightfrog_y - leftfrog_y) ** 2);
  
          const frogimage= new Image();
          const currentfrogImage= jewel.image;
          frogimage.src= "data:image/png;base64," + currentfrogImage;
          frogimage.onload = (e)=>{
            ctx.drawImage(frogimage,frogpoint_x-(frogsize/0.9),frogpoint_y-(frogsize/3.2),frogsize*2.3,frogsize*4);
          }
                 
          break;

      case "Tops":
        const left_x=posepoints[5].position.x;
        const left_y= posepoints[5].position.y;
        const right_x=posepoints[6].position.x;
        const right_y=posepoints[6].position.y;
        const toppoint_x= (right_x+left_x)/2;
        const toppoint_y = (right_y+left_y)/2;
        const topsize= Math.sqrt((right_x - left_x) ** 2 + (right_y - left_y) ** 2);

        const topimage= new Image();
        const currenttopImage= jewel.image;
        topimage.src= "data:image/png;base64," + currenttopImage;
        topimage.onload = (e)=>{
          ctx.drawImage(topimage,toppoint_x-(topsize/0.8),toppoint_y-(topsize/1.2),topsize*2.5,topsize*2.5);
        }
               
        break;
      
      case "Pants":
        const lefthip_x = posepoints[11].position.x;
        const lefthip_y = posepoints[11].position.y;
        const righthip_x= posepoints[12].position.x;
        const righthip_y = posepoints[12].position.y;
        const midhip_x=(righthip_x+lefthip_x)/2;
        const midhip_y=(righthip_y+lefthip_y)/2;
        const hipsize=Math.sqrt((righthip_x-lefthip_x)**2 + (righthip_y+lefthip_y)**2);

        const pantimage = new Image();
        const currentpantImage = jewel.image;
        pantimage.src =  "data:image/png;base64," + currentpantImage;
        pantimage.onload = (e)=>{
          ctx.drawImage(pantimage,midhip_x-(hipsize),midhip_y,hipsize,hipsize);
        }
        break;
    }

  }

  drawJewelOnCanvas(jewel: JewelInfo, ctx: CanvasRenderingContext2D, keypoints: any[], width: number, height: number) {
    switch (jewel.category) {
      case "Earring":
        const [earring_x1, earring_y1, earring_z1] = keypoints[93];
        const [earring_x2, earring_y2, earring_z2] = keypoints[323];
        const eyeDistanceForEarring = this.CalculateEyeDistance(keypoints[282], keypoints[52]);
        const earringImage = new Image();
        const currentEarringImage = jewel.image;
        earringImage.src = "data:image/png;base64," + currentEarringImage;
        earringImage.onload = (e) => {
          let eardepth1=Math.abs(earring_z1);
          let eardepth2=Math.abs(earring_z2);
          if((Math.abs(eardepth1-eardepth2)>40)){
              if(eardepth1<eardepth2){
                  ctx.drawImage(earringImage,earring_x1 - eyeDistanceForEarring / 2 - 10, earring_y1, eyeDistanceForEarring, eyeDistanceForEarring);
              }
              if(eardepth2<eardepth1){
                  ctx.drawImage(earringImage, earring_x2 - eyeDistanceForEarring / 2 + 10, earring_y2, eyeDistanceForEarring, eyeDistanceForEarring);
              }
        }
          else{
            ctx.drawImage(earringImage,earring_x1 - eyeDistanceForEarring / 2 - 10, earring_y1, eyeDistanceForEarring, eyeDistanceForEarring);
            ctx.drawImage(earringImage,earring_x2 - eyeDistanceForEarring / 2 + 10, earring_y2, eyeDistanceForEarring, eyeDistanceForEarring);
          }
        }
        break;

      


      case "Necklace":
        const [necklace_x, necklace_y, necklace_z] = keypoints[136];
        const eyeDistanceForNecklace = this.CalculateEyeDistance(keypoints[282], keypoints[52]);
        const necklaceImage = new Image();
        const currentNecklaceImage = jewel.image;
        necklaceImage.src = "data:image/png;base64," + currentNecklaceImage;
        necklaceImage.onload = (e) => {
          ctx.drawImage(necklaceImage, necklace_x - (eyeDistanceForNecklace * 2), necklace_y, eyeDistanceForNecklace * 5, eyeDistanceForNecklace * 5);
        }
        break;

      case "Nosepin":
        const [nosePin_x, nosePin_y, nosePin_z] = keypoints[457];
        const eyeDistanceForNosePin = this.CalculateEyeDistance(keypoints[282], keypoints[52]);
        const nosePinImage = new Image();
        const currentNosePinImage = jewel.image;
        nosePinImage.src = "data:image/png;base64," + currentNosePinImage;
        nosePinImage.onload = (e) => {
          ctx.drawImage(nosePinImage,nosePin_x - eyeDistanceForNosePin, nosePin_y - (eyeDistanceForNosePin * 0.9), eyeDistanceForNosePin * 1.8, eyeDistanceForNosePin * 1.8);
        }
        break;

      case "Nethichutti":
        const [nethichutti_x, nethichutti_y, nethichutti_z] = keypoints[10];
        const eyeDistanceForNethichutti = this.CalculateEyeDistance(keypoints[282], keypoints[52] );
        const nethichuttiImage = new Image();
        const currentNethichuttiImage = jewel.image;
        nethichuttiImage.src = "data:image/png;base64," + currentNethichuttiImage;
        nethichuttiImage.onload = (e) => {
          ctx.drawImage(nethichuttiImage,nethichutti_x - (eyeDistanceForNethichutti), nethichutti_y - (eyeDistanceForNethichutti), eyeDistanceForNethichutti * 2, eyeDistanceForNethichutti * 2);
        }
        break;

      
    }
  }

  enableVideo() {
    this.showVideo = true;
    this.getCameraAccess();
  }

  CalculateEyeDistance(rightEye: any[], leftEye: any[]): number {
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
        this.detectLandmarksOnImage();
      }
    }
    else {
      this.selectedJewel.push(jewel);
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
    if(this.capturedImages && this.capturedImages.length){
      this.viewCapturedImages = true;
    }
  }

  prevImage() {
    const index = this.capturedImages.findIndex(x => x == this.currentCapturedImage);
    this.currentCapturedImage = index > 0 ? this.capturedImages[index - 1] : this.currentCapturedImage;
  }

  nextImage() {
    const index = this.capturedImages.findIndex(x => x == this.currentCapturedImage);
    this.currentCapturedImage = index <= this.capturedImages.length - 2 && index >=0 ? this.capturedImages[index + 1] : this.currentCapturedImage;
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
    if(this.uploadedImage != ""){
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
}
