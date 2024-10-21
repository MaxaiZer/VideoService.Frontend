import { baseUrl } from './config.ts';
import './videojs-hls-quality-selector.min.js';

document.addEventListener('DOMContentLoaded', () => {
    
    console.log("Full URL:", window.location.href);
    console.log("Search params:", window.location.search);

    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('id')
    const videoTitle = params.get('title')
    console.log("videoId:", videoId, " videoTitle:", videoTitle)
    
    const videoSrc = `${baseUrl}/storage/files/videos/${videoId}/playlist`;
    
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

    const title = document.createElement('h2');
    title.className = 'videoTitle';
    title.textContent = videoTitle;

    videoElement.appendChild(sourceElement);
    videoContainer.appendChild(videoElement);
    videoContainer.appendChild(title);

    const player = videojs('dynamic-video-id', {
        controls: true,
        autoplay: true,
        preload: 'auto',
        techOrder: ['html5']
    });

   // player.qualityLevels()
    player.hlsQualitySelector();

    player.ready(function() {
        const qualityLevels = player.qualityLevels();
    
        console.log(qualityLevels);

        const levels = Array.from(qualityLevels.levels_);
    
        qualityLevels.levels_.length = 0;
    
        levels.reverse().forEach(level => {
            qualityLevels.addLevel(level);
        });

        console.log(player.qualityLevels());
    });
});
