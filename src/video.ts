import { baseUrl } from './config.ts';
import 'videojs-hls-quality-selector';

const params = new URLSearchParams(window.location.search);
const videoId = params.get('id')

document.addEventListener('DOMContentLoaded', () => {
    const videoSrc = `${baseUrl}/videos/${videoId}/files/master-playlist`;
    
    const videoContainer = document.getElementById('video-container');
    const videoElement = document.createElement('video');

    if (videoContainer == null || videoElement == null)
        throw Error("There is no videoContainer or videoElement");

    videoElement.className = 'video-js';
    videoElement.controls = true;
    videoElement.preload = 'auto';
    videoElement.width = 800;
    videoElement.id = 'dynamic-video-id';

    const sourceElement = document.createElement('source');
    sourceElement.src = videoSrc;
    sourceElement.type = 'application/x-mpegURL';

    videoElement.appendChild(sourceElement);
    videoContainer.appendChild(videoElement);

    const player = videojs('dynamic-video-id', {
        controls: true,
        autoplay: true,
        preload: 'auto',
        techOrder: ['html5']
    });

    player.hlsQualitySelector();

    player.ready(function() {
        const qualityLevels = player.qualityLevels();
    
        console.log(qualityLevels);

        // Create an array to hold the levels
        const levels = Array.from(qualityLevels.levels_);
    
        // Clear existing levels
        qualityLevels.levels_.length = 0;
    
        // Reverse the levels and add them back
        levels.reverse().forEach(level => {
            qualityLevels.addLevel(level);
        });

        console.log(player.qualityLevels());
    });

  //  player.on('qualitychange', function() {
  //      console.log('Quality changed to: ' + player.tech().vhs.selectPlaylist().id);
 //   });
});
