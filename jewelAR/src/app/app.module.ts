import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { ModalComponent } from './components/shared/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    UploadFileComponent,
    ModalComponent
    ],
  imports: [
    BrowserModule,
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
