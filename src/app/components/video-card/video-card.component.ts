import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.scss'
})
export class VideoCardComponent {
  @Input({required: true}) videoTitle: string = '';
  @Input({required: true}) videoUrl: string = '';
  @Input({required: true}) videoThumbnailUrl: string = '';
}
