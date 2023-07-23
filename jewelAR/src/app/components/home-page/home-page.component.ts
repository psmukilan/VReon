import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { JewelCartInfo, JewelInfo } from 'src/app/models/jewel-info';
import { JewelService } from 'src/app/services/jewel-service';
import { UploadFileModalComponent } from '../shared/upload-modal/upload-file-modal.component';
import { Router } from '@angular/router';
import { VreonAdminModalComponent } from '../shared/vreon-admin-modal/vreon-admin-modal.component';
import { AdminModalComponent } from '../shared/admin-modal/admin-modal.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  bsModalRef!: BsModalRef;
  jewelInfo: JewelInfo[] | undefined;
  isSideNavOpen: boolean = false;
  isJeweller: boolean = false;
  showJewels: boolean = true;
  showCart: boolean = false;
  jewelsInCart: JewelCartInfo[] = [];
  jewellerName: string = "JEWELAR";
  jewellerLogo!: string;
  isJewellerLogoAvailable: Boolean = false;
  isAdmin: Boolean = false;
  isVReonAdmin: Boolean = false;

  @ViewChild('showImageUploadModal', { read: TemplateRef }) showImageUploadModal !: TemplateRef<any>;

  constructor(
    private bsModalService: BsModalService,
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem("loggedInUserName")) {
      this.jewellerName = sessionStorage.getItem("loggedInUserName");
    }
    if (sessionStorage.getItem("loggedInUserLogo")) {
      this.isJewellerLogoAvailable = true;
      this.jewellerLogo = sessionStorage.getItem("loggedInUserLogo");
    }
  }

  openNav() {
    let checkIfJeweller = sessionStorage.getItem("IsJeweller");
    let checkIfAdmin = sessionStorage.getItem("IsAdmin");
    let checkIfVReonAdmin = sessionStorage.getItem("IsVReonAdmin");

    this.isJeweller = checkIfJeweller == "true" ? true : false;
    this.isAdmin = checkIfAdmin == "true" ? true : false;
    this.isVReonAdmin = checkIfVReonAdmin == "true" ? true : false;

    this.isSideNavOpen = true;
  }

  closeNav() {
    this.isSideNavOpen = false;
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
      class: 'modal-xl',
    });
  }

  openVReonAdminModal() {
    const initialState = {
      title: 'VReon Admin Options',
    };

    this.bsModalRef = this.bsModalService.show(VreonAdminModalComponent, {
      initialState,
      class: 'modal-xl',
    });
  }

  openAdminModal() {
    const initialState = {
      title: 'Admin Options',
    };

    this.bsModalRef = this.bsModalService.show(AdminModalComponent, {
      initialState,
      class: 'modal-xl',
    });
  }

  openCartPage() {
    this.showJewels = false;
    this.showCart = true;
  }

  updateJewelsInCart(jewels: JewelCartInfo[]) {
    this.jewelsInCart = jewels;
  }

  continueShopping(jewelsInCart: JewelCartInfo[]) {
    this.showJewels = true;
    this.showCart = false;
    this.jewelsInCart = jewelsInCart;
  }

}
