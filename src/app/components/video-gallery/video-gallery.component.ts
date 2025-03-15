import { Component, Input } from '@angular/core';
import { VideoCardComponent } from '../video-card/video-card.component';
import { VideoResponse } from '../../dto/video';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-video-gallery',
  standalone: true,
  imports: [VideoCardComponent],
  templateUrl: './video-gallery.component.html',
  styleUrl: './video-gallery.component.scss'
})
export class VideoGalleryComponent {
  @Input() videos: VideoResponse[] = [];

  videoLink(videoId: string): string {
    return `video?id=${ videoId }`;
  }

  thumbnailLink(videoId: string): string {
    return `${ environment.baseUrl }/storage/files/videos/` + videoId + `/thumbnail.jpg`;
  }
}
