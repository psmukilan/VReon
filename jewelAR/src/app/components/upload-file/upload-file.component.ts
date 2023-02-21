import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  bsModalRef!: BsModalRef;

  constructor(private bsModalService: BsModalService) { }

  ngOnInit(): void {
  }

  openFileUploadModal() {
    const initialState = {
      title: "Upload Files",
      message: "Select Files to upload",
      options: ["Upload", "Cancel"],
    };
    this.bsModalRef = this.bsModalService.show(ModalComponent, { initialState });
  }

}
