import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JewelInfo } from 'src/app/models/jewel-info';
import { JewelService } from 'src/app/services/jewel-service';
import { NgxSpinnerService } from "ngx-spinner";
import * as facemesh from '@tensorflow-models/facemesh';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';

@Component({
  selector: 'app-video-ar-content',
  templateUrl: './video-ar-content.component.html',
  styleUrls: ['./video-ar-content.component.css'],
})

export class VideoArContentComponent implements OnInit {
  jewels!: JewelInfo[];
  selectedJewel!: JewelInfo;
  jewelsToDisplay!: JewelInfo[];
  jewelDisplayConstant = 4;
  currentStartPosition = 0;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private jewelService: JewelService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getJewelInfo();
  }

  getJewelInfo() {
    this.isLoading = true;
    const jewelId = this.route.snapshot.paramMap.get('id');
    this.jewelService.GetAllJewels().subscribe((jewel) => {
      this.jewels = jewel;
      this.isLoading = false;
      this.jewelsToDisplay = this.jewels.length > this.jewelDisplayConstant ? this.jewels.slice(this.currentStartPosition, this.jewelDisplayConstant) : this.jewels;
      this.selectedJewel = this.jewels[0];
      this.getCameraAccess();
    });
  }

  getCameraAccess() {
    this.isLoading = true;
    const video = document.getElementById('video') as HTMLVideoElement;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        this.isLoading = false;
        video.srcObject = stream;
        this.detectLandmarks()
      });
  }

  async detectLandmarks() {
    this.isLoading = true;
    this.spinner.show();
    const video = document.getElementById('video') as HTMLVideoElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    // Load the Facemesh model
    const model = await facemesh.load();

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        video.play();
        //Start the webcam stream
        video.onloadeddata = (e) => {
          // Detect facial landmarks in real-time
          setInterval(async () => {
            const predictions = await model.estimateFaces(video);

            // Draw the facial landmarks on the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < predictions.length; i++) {
              const keypoints = predictions[i].scaledMesh as any[];
              let width = video.width;
              let height = video.height;

              ctx.drawImage(video, 0, 0, video.width, video.height);
              this.isLoading = false;

              switch (this.selectedJewel.category) {
                case "Earring":
                  const [earring_x1, earring_y1, earring_z1] = keypoints[93];
                  const [earring_x2, earring_y2, earring_z2] = keypoints[323];
                  const eyeDistanceForEarring = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
                  const earringImage = new Image();
                  const currentEarringImage = this.selectedJewel.image;
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
                  const currentNecklaceImage = this.selectedJewel.image;
                  necklaceImage.src = "data:image/png;base64," + currentNecklaceImage;
                  necklaceImage.onload = (e) => {
                    ctx.drawImage(necklaceImage, Math.abs(necklace_x - (eyeDistanceForNecklace * 1.8) - 5), necklace_y, eyeDistanceForNecklace * 5, eyeDistanceForNecklace * 5);
                  }
                  break;

                case "Nosepin":
                  const [nosePin_x, nosePin_y, nosePin_z] = keypoints[457];
                  const eyeDistanceForNosePin = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
                  const nosePinImage = new Image();
                  const currentNosePinImage = this.selectedJewel.image;
                  nosePinImage.src = "data:image/png;base64," + currentNosePinImage;
                  nosePinImage.onload = (e) => {
                    ctx.drawImage(nosePinImage, Math.abs(nosePin_x - eyeDistanceForNosePin), Math.abs(nosePin_y - (eyeDistanceForNosePin * 0.9)), eyeDistanceForNosePin * 1.8, eyeDistanceForNosePin * 1.8);
                  }
                  break;
                
                case "Nethichutti":
                  const [nethichutti_x, nethichutti_y, nethichutti_z] = keypoints[10];
                  const eyeDistanceForNethichutti = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
                  const nethichuttiImage = new Image();
                  const currentNethichuttiImage = this.selectedJewel.image;
                  nethichuttiImage.src = "data:image/png;base64," + currentNethichuttiImage;
                  nethichuttiImage.onload = (e) => {
                    ctx.drawImage(nethichuttiImage, Math.abs(nethichutti_x - (eyeDistanceForNethichutti)), Math.abs(nethichutti_y - (eyeDistanceForNethichutti)), eyeDistanceForNethichutti * 2, eyeDistanceForNethichutti * 2);
                  }
                  break;
              }




            }
          }, 200);
        }
      });
  }

  CalculateEyeDistance(rightEye: any[], leftEye: any[], width: number, height: number): number {
    const x1 = rightEye[0];
    const y1 = rightEye[1];
    const x2 = leftEye[0];
    const y2 = leftEye[1];
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }

  changeJewel(jewel: JewelInfo) {
    this.selectedJewel = jewel;
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
}
