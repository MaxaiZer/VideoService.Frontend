import { Component } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileResponse } from '../../dto/profile';
import { CommonModule } from '@angular/common';
import { VideoResponse, VideoSearchParameters } from '../../dto/video';
import { VideoService } from '../../services/video.service';
import { firstValueFrom } from 'rxjs';
import { VideoGalleryComponent } from '../../components/video-gallery/video-gallery.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, VideoGalleryComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  profile: ProfileResponse | undefined;
  videos: VideoResponse[] = [];
  videosLoaded: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private profileService: ProfileService, 
    private videoService: VideoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    const currentPath = this.route.snapshot.url.join('/');
    if (currentPath === 'profile/me')
    {
      this.showProfile();
      return;
    }

    this.route.queryParams.subscribe(params => {
      const userId = params['id'];
      console.log('User ID:', userId);
      this.showProfile(userId);
    });
  }

  async showProfile(userId?: string) {

    let fetchProfile = userId ? this.profileService.getProfile(userId) : this.profileService.getCurrentUserProfile();

    try {
      const response = await firstValueFrom(fetchProfile);
      this.profile = response.body ?? undefined;

      let params = new VideoSearchParameters(undefined, this.profile?.userId);
      firstValueFrom(this.videoService.fetchVideos(params)).then((videos) => { this.videos = videos; this.videosLoaded = true; });
    } catch (error) {
        console.error("Internal error", error);
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
