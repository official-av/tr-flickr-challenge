import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, throwError} from 'rxjs';
import {catchError, distinctUntilChanged, map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {FlickrPhoto} from './FlickrPhoto.interface';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  /* region helpers for photos home page */
  sortByAction = new BehaviorSubject<string>('views');
  sortBy$ = this.sortByAction.asObservable().pipe(
    distinctUntilChanged()
  );
  photosAction = new BehaviorSubject<FlickrPhoto[]>([] as FlickrPhoto[]);
  photos$ = this.photosAction.asObservable().pipe(
    tap(photos => {
      localStorage.removeItem('photos');
      localStorage.setItem('photos', JSON.stringify(photos));
    })
  );
  public sortedPhotos$ = combineLatest([this.sortBy$, this.photos$]).pipe(map(([sortBy, photos]) => {
    photos.sort((a, b) => {
      if (sortBy === 'views') {
        return Number(a.views) - Number(b.views);
      } else if (sortBy === 'dateupload') {
        return Number(a.dateupload) - Number(b.dateupload);
      } else return 0;
      // if (sortBy === 'datetaken') {
      //   return dates.compare(a.datetaken,b.datetaken);
      // }
      // TODO: date compare
    });
    return photos;
  }))
  /* endregion */

  selectPhotoAction = new BehaviorSubject<FlickrPhoto>({} as FlickrPhoto);
  selectedPhoto$ = this.selectPhotoAction.asObservable().pipe(
    tap(photo => {
      if (photo) {
        localStorage.removeItem('photo-detail');
        localStorage.setItem('photo-detail', JSON.stringify(photo));
      }
    })
  );

  page = new BehaviorSubject<number>(1);
  page$ = this.page.asObservable();
  total = new BehaviorSubject<number>(0);
  total$ = this.total.asObservable();

  allPhotos$ = combineLatest([this.page$, this.selectedPhoto$]).pipe(
    switchMap(([page, photo]) => this.getAllImagesWithPhoto(page, photo)),
    shareReplay());

  private searchAPIURL = `${environment.apiURL}&format=json&nojsoncallback=1&extras=date_upload,date_taken, owner_name,views,url_q&sort=interestingness-desc`;

  constructor(private http: HttpClient) {
    // restore state from local storage
    // restore for home page requests
    const photosString = localStorage.getItem('photos');
    if (photosString) {
      const photos = JSON.parse(photosString) as FlickrPhoto[];
      this.photosAction.next(photos);
    }
    // restore for detail page selected photo
    const photoString = localStorage.getItem('photos');
    if (photoString) {
      const photo = JSON.parse(photoString) as FlickrPhoto;
      this.selectPhotoAction.next(photo);
    }
  }

  public getImageWithTags(tags: string[]): Observable<FlickrPhoto> {
    const tagsString = tags.join(',');
    return this.http.get(`${this.searchAPIURL}&tags=${tagsString}&per_page=1`).pipe(
      map((res: any) => {
        if (res.photos && res.photos.photo && res.photos.photo.length > 0) {
          return res.photos.photo[0] as FlickrPhoto
        } else {
          throw Error('No results found for this search criteria!');
        }
      }),
      tap(res => res.tags = tagsString),
      tap(res => {
        const curPhotos = this.photosAction.value;
        curPhotos.push(res);
        this.photosAction.next(curPhotos);
      }),
      catchError(err => throwError(err)),
    );
  }

  public getAllImagesWithPhoto(page: number, photo: FlickrPhoto): Observable<FlickrPhoto[]> {
    const tagsString = photo.tags;
    return this.http.get(`${this.searchAPIURL}&tags=${tagsString}&per_page=10&page=${page}`).pipe(
      tap((res: any) => this.total.next(res.photos.total)),
      map((res: any) => {
        if (res.photos && res.photos.photo && res.photos.photo.length > 0) {
          return res.photos.photo as FlickrPhoto[]
        } else {
          throw Error('No results found for this search criteria!');
        }
      }),
      tap(res => res.forEach(x => x.tags = tagsString)),
      catchError(err => throwError(err)),
    );
  }
}
