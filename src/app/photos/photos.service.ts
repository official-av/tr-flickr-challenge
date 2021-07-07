import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, distinctUntilChanged, map, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {FlickrPhoto} from './FlickrPhoto.interface';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  sortByAction = new BehaviorSubject<string>('views');
  sortBy$ = this.sortByAction.asObservable().pipe(
    distinctUntilChanged()
  );
  photosAction = new BehaviorSubject<FlickrPhoto[]>([] as FlickrPhoto[]);
  photos$ = this.photosAction.asObservable().pipe(
    tap(photos => {
      localStorage.clear();
      localStorage.setItem('photos', JSON.stringify(photos));
    })
  );

  private searchAPIURL = `${environment.apiURL}&format=json&nojsoncallback=1&extras=date_upload,date_taken, owner_name,views,url_q&sort=interestingness-desc&per_page=1`;

  constructor(private http: HttpClient) {
    const photoString = localStorage.getItem('photos');
    if (photoString) {
      const photos = JSON.parse(photoString) as FlickrPhoto[];
      this.photosAction.next(photos);
    }
  }

  public getImageWithTags(tags: string[]): Observable<FlickrPhoto> {
    const tagsString = tags.join(',');
    return this.http.get(`${this.searchAPIURL}&tags=${tagsString}`).pipe(
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
}
