import { baseUrl } from './config';
import { VideoResponse } from './dto/videoResponse';

async function fetchVideos(query: string) {
    try {
        const response = await fetch(`${baseUrl}/videos?searchQuery=` + query);
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
        const videoElement = document.createElement('div');
        videoElement.className = 'video-item';
        
        const thumbnailLink = document.createElement('a');
        thumbnailLink.href = `video.html?id=${video.id}`;

        const thumbnail = document.createElement('img');
        thumbnail.src = `${baseUrl}/videos/${video.id}/files/thumbnail.jpg`;
        thumbnail.alt = `${video.videoName} Thumbnail`;

        thumbnailLink.appendChild(thumbnail);
        
        const title = document.createElement('h2');
        title.textContent = video.userName + ": " + video.videoName;

        videoElement.appendChild(thumbnailLink);
        videoElement.appendChild(title);

        gallery.appendChild(videoElement);
    });
}

document.getElementById('searchButton')?.addEventListener('click', () => {
    const query = (document.getElementById('searchInput') as HTMLInputElement).value;
    
    // Change the current page URL without reloading
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('search', query);
    window.history.pushState({}, '', newUrl.toString());

    // Fetch videos based on the search input
    fetchVideos(query);
});

const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('search') ?? "";

fetchVideos(searchQuery);