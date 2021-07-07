import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PhotosHomeComponent} from './photos-home/photos-home.component';
import {PhotoDetailsComponent} from './photo-details/photo-details.component';

const routes: Routes = [{
  path: 'photos', component: PhotosHomeComponent,
}, {
  path: 'showAllPhotos', component: PhotoDetailsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotosRoutingModule {
}
