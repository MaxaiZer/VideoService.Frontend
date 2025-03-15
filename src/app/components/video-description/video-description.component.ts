import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video-description',
  standalone: true,
  imports: [],
  templateUrl: './video-description.component.html',
  styleUrl: './video-description.component.scss'
})
export class VideoDescriptionComponent {
  @Input() userName: string = '';
  @Input() videoTitle: string = '';
  @Input() videoDescription: string = '';
  @Input() createdAt: Date = new Date();

  get formattedDate(): string {
    return new Date(this.createdAt).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  }
}
