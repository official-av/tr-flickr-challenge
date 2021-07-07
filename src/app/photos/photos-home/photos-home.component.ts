import {Component, OnInit} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {PhotosService} from '../photos.service';
import {catchError, take, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-photos-home',
  templateUrl: './photos-home.component.html',
  styleUrls: ['./photos-home.component.scss']
})
export class PhotosHomeComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public tags = [] as string[];
  public readonly sortBy = this.photosService.sortBy$;
  public photos$ = this.photosService.photos$;

  constructor(private photosService: PhotosService,
              private toastService: ToastrService) {
  }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent) {
    const tag = event.value;
    if (tag) {
      this.tags.push(tag);
    }
    event.chipInput!.clear();
  }

  remove(event: any) {
    const tagIndex = this.tags.findIndex(x => x === event);
    this.tags.splice(tagIndex, 1);
  }

  clear() {
    this.tags = [];
  }

  search() {
    this.photosService.getImageWithTags(this.tags).pipe(
      (take(1),
        tap(() => this.clear())),
      catchError(err => this.errorHandler(err))
    ).subscribe();
    // TODO: error handling for single image
  }

  sortByAttribute(attribute: string) {
    this.photosService.sortByAction.next(attribute);
  }

  errorHandler(err: any) {
    this.toastService.error(err.message);
    return of([]);
  }

}
