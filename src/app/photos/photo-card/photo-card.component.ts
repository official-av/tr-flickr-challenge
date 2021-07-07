import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FlickrPhoto} from '../FlickrPhoto.interface';

@Component({
  selector: 'app-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoCardComponent {
  @Input() photo = {} as FlickrPhoto;
  @Input() showAllImagesAction = false;
  @Output() showAllImagesEvent = new EventEmitter();

  constructor() {
  }

  /**
   * @alias goToDetails
   * @description emits go to details event
   */
  public triggerShowAllImages() {
    this.showAllImagesEvent.emit(this.photo);
  }

}
