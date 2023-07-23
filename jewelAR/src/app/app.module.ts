import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { UploadFileModalComponent } from './components/shared/upload-modal/upload-file-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { JewelService } from './services/jewel-service';
import { LoginService } from './services/login-service';
import { CartService } from './services/cart-service';
import { AppRoutingModule } from './app-routing.module';
import { VideoArContentComponent } from './components/shared/video-ar-content/video-ar-content.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './components/login-page/login-page/login-page.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { CartPageComponent } from './components/cart-page/cart-page.component';
import { VreonAdminModalComponent } from './components/shared/vreon-admin-modal/vreon-admin-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AdminModalComponent } from './components/shared/admin-modal/admin-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    UploadFileModalComponent,
    VideoArContentComponent,
    LoginPageComponent,
    CartPageComponent,
    VreonAdminModalComponent,
    AdminModalComponent
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
    NgbModule,
    ShareButtonsModule,
    ShareIconsModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule
    ],
  providers: [
    JewelService,
    LoginService,
    CartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
