import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { JewelInfo } from 'src/app/models/jewel-info';
import { JewelService } from 'src/app/services/jewel-service';
import { UploadFileModalComponent } from '../shared/modal/upload-file-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
    this.loadAllJewels();
  }

  loadAllJewels() {
    this.jewelService.GetAllJewels().subscribe((jewels) => {
      this.jewelInfo = jewels;
    });
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

  goToJewelPage(jewel: JewelInfo) {
    const jewelId = jewel ? jewel.id : null;
    this.router.navigate(['/jewel', { id: jewelId }]);
  }

  goToEarringCollection() {
    this.router.navigate(['/jewel']);
  }
}
