import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { JewelInfo } from 'src/app/models/jewel-info';
import { JewelService } from 'src/app/services/jewel-service';

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

  video = this.elementRef.nativeElement.querySelector('video');

  constructor(
    private route: ActivatedRoute,
    private jewelService: JewelService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    const jewelId = this.route.snapshot.paramMap.get('id');
    this.jewelService.GetJewel(jewelId).subscribe((jewel) => {
      this.jewel = jewel;
    });

    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then((stream) => {
        this.video.srcObject = stream;
      });
  }
}
