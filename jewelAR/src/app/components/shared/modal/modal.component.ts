import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  title: string | undefined;
  message: string | undefined;
  options: string[] = [];

  constructor(
    public modalService: BsModalService,
  ) { }

  respond(answer: string) {
    this.modalService.hide();
  }
}
