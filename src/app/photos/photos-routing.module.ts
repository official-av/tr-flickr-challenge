import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PhotosHomeComponent} from './photos-home/photos-home.component';

const routes: Routes = [{
  path: 'photos', component: PhotosHomeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotosRoutingModule {
}
