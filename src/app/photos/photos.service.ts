import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map, tap} from 'rxjs/operators';
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

  private searchAPIURL = `${environment.apiURL}&format=json&nojsoncallback=1&extras=date_upload,date_taken, owner_name,views,url_q&sort=interestingness-desc&per_page=1`;

  constructor(private http: HttpClient) {
  }

  public getImageWithTags(tags: string[]): Observable<FlickrPhoto> {
    const tagsString = tags.join(',');
    return this.http.get(`${this.searchAPIURL}&tags=${tagsString}`).pipe(
      map((res: any) => res.photos.photo[0] as FlickrPhoto),
      tap(res => res.tags = tagsString)
    );
  }
}
