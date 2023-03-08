import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, from, Subject } from 'rxjs';
import { JewelInfo } from 'src/app/models/jewel-info';
import { JewelService } from 'src/app/services/jewel-service';
import * as facemesh from '@tensorflow-models/facemesh';
import { takeUntil } from 'rxjs/operators';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';

@Component({
  selector: 'app-jewel-page',
  templateUrl: './jewel-page.component.html',
  styleUrls: ['./jewel-page.component.css'],
})
export class JewelPageComponent implements OnInit {
  jewel: JewelInfo | undefined;



  //Front camera access
  facingMode = 'user';
  constraints = {
    audio: false,
    video: {
      facingMode: this.facingMode,
    },
  };

  constructor(
    private route: ActivatedRoute,
    private jewelService: JewelService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.detectLandmarks();
    this.getJewelInfo();
  }

  getJewelInfo() {
    const jewelId = this.route.snapshot.paramMap.get('id');
    this.jewelService.GetJewel(jewelId).subscribe((jewel) => {
      this.jewel = jewel;
    });
  }

  getCameraAccess() {
    navigator.mediaDevices
      .getUserMedia(this.constraints);
  }

  async detectLandmarks() {
    const video = document.getElementById('video') as HTMLVideoElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    // Load the Facemesh model
    const model = await facemesh.load();

    // Start the webcam stream
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        video.onloadeddata = (e) => {
          video.play();

          // Detect facial landmarks in real-time
          setInterval(async () => {
            const predictions = await model.estimateFaces(video);

            // Draw the facial landmarks on the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < predictions.length; i++) {
              const keypoints = predictions[i].scaledMesh as any[];
              let width = video.width;
              let height = video.height;
              video.hidden = true;

              ctx.drawImage(video, 0, 0, video.width, video.height);

              const [x1, y1, z1] = keypoints[234];
              const [x2, y2, z2] = keypoints[454];

              const eyeDistance = this.CalculateEyeDistance(keypoints[282], keypoints[52], width, height);
              const image = new Image();
              image.src = "data:image/png;base64," + this.jewel?.image;
              image.onload = (e) => {
                ctx.drawImage(image, Math.abs(x1 - eyeDistance/2), y1, eyeDistance, eyeDistance);
                ctx.drawImage(image, Math.abs(x2 - eyeDistance/2), y2, eyeDistance, eyeDistance);
              }
            }
          }, 100);
        }
      });
  }

  CalculateEyeDistance(rightEye: any[], leftEye: any[], width: number, height: number): number {
    const x1 = rightEye[0] ;
    const y1 = rightEye[1] ;
    const x2 = leftEye[0] ;
    const y2 = leftEye[1] ;
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }
}
