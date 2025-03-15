import { Component, inject } from '@angular/core';
import { VideoGalleryComponent } from "../video-gallery/video-gallery.component";
import { VideoResponse, VideoSearchParameters } from '../../dto/video';
import { VideoService } from '../../services/video.service';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { ErrorComponent } from "../error/error.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-video-search',
  standalone: true,
  imports: [VideoGalleryComponent, FormsModule, ErrorComponent],
  templateUrl: './video-search.component.html',
  styleUrl: './video-search.component.scss'
})
export class VideoSearchComponent {
  
  service: VideoService = inject(VideoService)
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  videos: VideoResponse[] = []
  searchQuery: string = "";
  videosByPage = 20;

  error: string|null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'] || '';
      this.fetchVideos();
    });
  }

  fetchVideos() {
    const params = new VideoSearchParameters(this.searchQuery, undefined, 1, this.videosByPage);
    this.service.fetchVideos(params)
      .pipe(take(1))
      .subscribe({
        next: (v) => this.videos = v,
        error: (_) => {
          this.error = "Internal error";
        }
      })
  }

  onSearch(searchQuery: string) {
    this.searchQuery = searchQuery
    this.fetchVideos();

    this.router.navigate([], {
      queryParams: { query: this.searchQuery || null },
      queryParamsHandling: "merge",
    });
  }
}
