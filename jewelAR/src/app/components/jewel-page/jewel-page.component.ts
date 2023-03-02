import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, from, Subject } from 'rxjs';
import { JewelInfo } from 'src/app/models/jewel-info';
import { JewelService } from 'src/app/services/jewel-service';
import * as facemesh from '@tensorflow-models/facemesh';
import { takeUntil } from 'rxjs/operators';
import '@tensorflow/tfjs-backend-webgl';

@Component({
  selector: 'app-jewel-page',
  templateUrl: './jewel-page.component.html',
  styleUrls: ['./jewel-page.component.css'],
})
export class JewelPageComponent implements OnInit {
  jewel: JewelInfo | undefined;

  private faceDetector: any;
  private video!: HTMLVideoElement;
  private videoStream!: MediaStream;
  private canvas!: HTMLCanvasElement;


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
        }
      });
  
    // Detect facial landmarks in real-time
    setInterval(async () => {
      const predictions = await model.estimateFaces(video);
  
      // Draw the facial landmarks on the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < predictions.length; i++) {
        const keypoints = predictions[i].scaledMesh as any[];

        for (let j = 0; j < keypoints.length; j++) {
          const [x, y, z] = keypoints[j];
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
        }
      }
    }, 100);
  }  
}
