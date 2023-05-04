import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { JewelInfo } from 'src/app/models/jewel-info';
import { JewelService } from 'src/app/services/jewel-service';
import { UploadFileModalComponent } from '../shared/modal/upload-file-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  bsModalRef!: BsModalRef;
  jewelInfo: JewelInfo[] | undefined;

  constructor(
    private bsModalService: BsModalService,
    private jewelService: JewelService,
    private router: Router
    ) {}

  ngOnInit(): void {
  }
}
