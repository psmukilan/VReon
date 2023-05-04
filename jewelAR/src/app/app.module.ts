import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { UploadFileModalComponent } from './components/shared/modal/upload-file-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { JewelService } from './services/jewel-service';
import { LoginService } from './services/login-service';
import { AppRoutingModule } from './app-routing.module';
import { VideoArContentComponent } from './components/shared/video-ar-content/video-ar-content.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './components/login-page/login-page/login-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    UploadFileModalComponent,
    VideoArContentComponent,
    LoginPageComponent
    ],
  imports: [
    BrowserModule,
    ModalModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    RxReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [
    JewelService,
    LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
