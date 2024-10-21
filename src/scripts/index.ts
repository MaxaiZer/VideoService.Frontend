import { baseUrl } from './config';
import { VideoResponse } from './dto/videoResponse';

document.addEventListener('DOMContentLoaded', function () {

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search') ?? "";
    
    fetchVideos(searchQuery);
});

async function fetchVideos(query: string) {
    try {
        const response = await fetch(`${baseUrl}/api/videos?searchQuery=` + query);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const videos: VideoResponse[] = await response.json();
        displayVideos(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
}

function displayVideos(videos: VideoResponse[]) {
    const gallery = document.getElementById('videoGallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    videos.forEach(video => {

        console.log("video id: ", video.id, "title: ", video.videoName)

        const videoElement = document.createElement('div');
        videoElement.className = 'flex justify-center';

        const card = document.createElement('div');
        card.className = 'videoCard';
        
        const thumbnailLink = document.createElement('a');
        const videoTitle = video.userName + ": " + video.videoName;
        thumbnailLink.href = `/pages/video.html?id=${encodeURIComponent(video.id)}`;

        const thumbnail = document.createElement('img');
        thumbnail.src = `${baseUrl}/storage/files/videos/${video.id}/thumbnail.jpg`;
        thumbnail.alt = `${video.videoName} Thumbnail`;
        thumbnail.className = "videoThumbnail"

        thumbnailLink.appendChild(thumbnail);
        
        const title = document.createElement('h2');
        title.className = 'videoTitle';
        title.textContent = videoTitle;

        card.appendChild(thumbnailLink);
        card.appendChild(title);
        videoElement.appendChild(card)

        gallery.appendChild(videoElement);
    });
}

document.getElementById('searchButton')?.addEventListener('click', () => {
    const query = (document.getElementById('searchInput') as HTMLInputElement).value;
    
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('search', query);
    window.history.pushState({}, '', newUrl.toString());

    fetchVideos(query);
});