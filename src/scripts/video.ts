import { baseUrl } from './config.ts';
import videojs from 'video.js';
import qualitySelectorHls from 'videojs-quality-selector-hls';
import { VideoResponse } from './dto/videoResponse.ts';

document.addEventListener('DOMContentLoaded', async () => {
    
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('id')

    if (videoId == null)
        throw Error("Video id is missing")

    const videoInfo = await getVideoInfo(videoId);
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
    title.textContent = videoInfo.userName + ": " + videoInfo.videoName;

    const formattedDate = new Date(videoInfo.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });
      
    const description = document.createElement('h3');
    description.className = 'videoDescription';
    description.innerHTML = "Published: " + formattedDate + '<br>' + "Description: " + videoInfo.description;

    videoElement.appendChild(sourceElement);
    videoContainer.appendChild(videoElement);
    videoContainer.appendChild(title);
    videoContainer.appendChild(description);

    const player = videojs('dynamic-video-id', {
        controls: true,
        autoplay: true,
        preload: 'auto',
        techOrder: ['html5']
    });

    videojs.registerPlugin('qualitySelectorHls', qualitySelectorHls);

    player.ready(function() {

        player.qualitySelectorHls();
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

async function getVideoInfo(id: string): Promise<VideoResponse> {
    const response = await fetch(`${baseUrl}/api/videos/${id}`);
    const video: VideoResponse = await response.json();
    return video;
}
