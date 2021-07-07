import {Component} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {PhotosService} from '../photos.service';
import {catchError, distinctUntilChanged, take, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {FlickrPhoto} from '../FlickrPhoto.interface';

@Component({
  selector: 'app-photos-home',
  templateUrl: './photos-home.component.html',
  styleUrls: ['./photos-home.component.scss']
})
export class PhotosHomeComponent {
  // region tags input config
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public tags = [] as string[];
  // endregion

  // region sort and request photos
  public readonly sortBy = this.photosService.sortBy$.pipe(
    distinctUntilChanged()
  );
  public photos$ = this.photosService.sortedPhotos$;

  // endregion

  constructor(private photosService: PhotosService,
              private toastService: ToastrService,
              private router: Router) {
  }

  // region template helper methods
  public add(event: MatChipInputEvent) {
    const tag = event.value;
    if (tag) {
      this.tags.push(tag);
    }
    event.chipInput!.clear();
  }

  public remove(event: any) {
    const tagIndex = this.tags.findIndex(x => x === event);
    this.tags.splice(tagIndex, 1);
  }

  public clear() {
    this.tags = [];
  }

  public sortByAttribute(attribute: string) {
    this.photosService.sortByAction.next(attribute);
  }

  public errorHandler(err: any) {
    this.toastService.error(err.message);
    return of([]); // return empty arry obs on error
  }

  // endregion

  // region action methods
  public search() {
    this.photosService.getImageWithTags(this.tags).pipe(
      (take(1), // to unsubscribe after 1 stream emission
        tap(() => this.clear())),
      catchError(err => this.errorHandler(err))
    ).subscribe();
  }

  public showAllImages(photo: FlickrPhoto) {
    this.photosService.selectPhotoAction.next(photo);
    this.router.navigate(['./showAllPhotos'])
  }

  // endregion
}
