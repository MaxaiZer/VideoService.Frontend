import { Component } from '@angular/core';
import { VideoPlayerComponent } from "../../components/video-player/video-player.component";
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { VideoDescriptionComponent } from "../../components/video-description/video-description.component";
import { VideoService } from '../../services/video.service';
import { VideoResponse } from '../../dto/video';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule, VideoPlayerComponent, VideoDescriptionComponent],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {
  
  videoId!: string;
  video!: VideoResponse;
  videoLoaded: boolean = false;

  constructor(private route: ActivatedRoute, private service: VideoService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.videoId = params['id'];
      console.log('Video ID:', this.videoId);
      this.showVideoInfo();
    });
  }

  showVideoInfo() {
    this.service.fetchVideo(this.videoId).subscribe({
      next: (v) => {
        this.video = v;
        this.videoLoaded = true;
      },
      error: (_) => {
        console.error('Internal error');
      }
    });
  }

  videoUrl(): string {
    return `${environment.baseUrl}/storage/files/videos/` + this.videoId + `/playlist`;
  }
}
