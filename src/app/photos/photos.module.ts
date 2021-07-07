import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotosRoutingModule } from './photos-routing.module';
import { PhotosHomeComponent } from './photos-home/photos-home.component';
import { PhotoDetailsComponent } from './photo-details/photo-details.component';
import {SharedModule} from '../shared/shared.module';
import {PhotosService} from './photos.service';
import { PhotoCardComponent } from './photo-card/photo-card.component';


@NgModule({
  declarations: [
    PhotosHomeComponent,
    PhotoDetailsComponent,
    PhotoCardComponent
  ],
  imports: [
    CommonModule,
    PhotosRoutingModule,
    SharedModule
  ],
  providers: [PhotosService]
})
export class PhotosModule { }
