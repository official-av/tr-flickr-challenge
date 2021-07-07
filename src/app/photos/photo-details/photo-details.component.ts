import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {PhotosService} from '../photos.service';
import {PageEvent} from '@angular/material/paginator';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-photo-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoDetailsComponent implements OnInit {
  photos$ = this.photosService.allPhotos$;
  total$ = this.photosService.total$.pipe(
    tap(t => console.log('total', t))
  );

  constructor(private photosService: PhotosService) {
  }

  ngOnInit(): void {
  }

  /**
   * @alias changePage
   * @param event: PageEvent
   * @description triggers on paginator page change event
   * sends latest value for page to photos service page obs
   */
  public changePage(event: PageEvent) {
    const page = event.pageIndex + 1;
    this.photosService.page.next(page);
  }

}
