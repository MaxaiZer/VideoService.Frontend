import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import Plyr from 'plyr';
import Hls from 'hls.js';

declare global {
  interface Window {
    hls: any;
  }
}

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent {

  @Input() url!: string;
  plyr!: Plyr;

  constructor(public sanitizer: DomSanitizer) {
  }

  ngAfterViewInit(): void {
    
    const video = document.getElementById('video-wrapper');
    if (!video) {
      return;
    }

    let addVideo = document.createElement('video');

    video.appendChild(addVideo);
    // For more options see: https://github.com/sampotts/plyr/#options
    const defaultOptions: any = {
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
      enabled: true,
      clickToPlay: true,
      ads: {
        enabled: true,
        tagUrl: 'YOUR_URL'
      },
    };

    if (Hls.isSupported()) {
      // For more Hls.js options, see https://github.com/dailymotion/hls.js
      const hls = new Hls();
      hls.attachMedia(addVideo);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(this.url);
        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          window.hls = hls;
          // Transform available levels into an array of integers (height values).
          const availableQualities = hls.levels.map((l) => l.height);

          defaultOptions.quality = {
            default: availableQualities[availableQualities.length - 1],
            options: availableQualities,
            // this ensures Plyr to use Hls to update quality level
            // Ref: https://github.com/sampotts/plyr/blob/master/src/js/html5.js#L77
            forced: true,
            onChange: (e: any) => this.updateQuality(e),
          };

          // Initialize new Plyr player with quality options
          this.plyr = new Plyr(addVideo, defaultOptions);
        });
      });
    } else {
      // default options with no quality update in case Hls is not supported
      this.plyr = new Plyr(video, defaultOptions);
    }
  }

  updateQuality(newQuality: any): void {
    window.hls.levels.forEach((level: { height: any; }, levelIndex: any) => {
      if (level.height === newQuality) {
        window.hls.currentLevel = levelIndex;
      }
    });
  }
}
