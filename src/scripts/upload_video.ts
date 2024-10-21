import { convertKeysToSnakeCase, tryFetchWithAuth, userLogged, UserLoginRequiredError } from './common';
import { baseUrl } from './config';
import { GetUploadUrlResponse } from './dto/getUploadUrlResponse';
import { VideoUploadRequest } from './dto/videoUploadRequest';

const form = document.getElementById('uploadForm') as HTMLFormElement | null;
const fileInput = document.getElementById('videoFile') as HTMLInputElement | null;
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement | null;
const messageDiv = document.getElementById('message') as HTMLDivElement | null;

if (!fileInput || !submitBtn || !form || !messageDiv)
    throw Error("Required elements can't be found");

let videoFileId: string | null = null;

document.addEventListener('DOMContentLoaded', function () {

    if (!userLogged()){
        window.location.href = 'login.html';
        return;
    }
});

fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file || !messageDiv || !submitBtn) return;

    try {
        const url = `${baseUrl}/api/videos/upload-url`
        const response = await tryFetchWithAuth(url, {
            method: 'GET',
            credentials: 'include'
        });

        if (response instanceof UserLoginRequiredError) {
            window.location.href = "login.html"
            return
        }

        if (response instanceof Error) {
            messageDiv.textContent = 'Internal server error!';
            throw new Error(`fetch url ${url} returned error: ${response.message}`);
        }

        const data = convertKeysToSnakeCase(await response.json()) as GetUploadUrlResponse;
        console.log("received data: ", data);

        videoFileId = data.file_id;
        const presignedUrl = data.url;

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', presignedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);

        const startTime = Date.now();

        xhr.upload.onprogress = function (event) {
            if (!event.lengthComputable || !messageDiv) return;

            const percentComplete = (event.loaded / event.total) * 100;
            const elapsedTime = (Date.now() - startTime) / 1000;
            const uploadSpeed = event.loaded / elapsedTime; 
            const speedInKbps = uploadSpeed / 1024;
            const remainingTime = (event.total - event.loaded) / uploadSpeed;

            messageDiv.textContent = `Upload Progress: ${percentComplete.toFixed(2)}%, Speed: ${speedInKbps.toFixed(2)} Kbps, Time Left: ${remainingTime.toFixed(2)} seconds`;
        };

        xhr.onload = function () {
            if (xhr.status === 200) {
                submitBtn.disabled = false;
                messageDiv!.textContent = 'File uploaded successfully. You can now submit the form.';
            } else {
                messageDiv!.textContent = 'File upload failed. Please try again.';
            }
        };

        xhr.onerror = function () {
            console.error('Upload failed.');
            messageDiv!.textContent = 'File upload failed. Please try again.';
        };

        xhr.send(file);
    } catch (error) {
        console.error('Error:', error);
        messageDiv!.textContent = 'An error occurred. Please try again.';
    }
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!videoFileId || !messageDiv) {
        console.error("No video file id!");
        return;
    }

    const request: VideoUploadRequest = 
    { 
        name: (document.getElementById('videoName') as HTMLInputElement)?.value, 
        description: (document.getElementById('videoDescription') as HTMLInputElement)?.value,
        videoFileId: videoFileId
    };

    console.log("sending form: ", request);

    try {
        const url = `${baseUrl}/api/videos`
        const response = await tryFetchWithAuth(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            credentials: 'include'
        });

        if (response instanceof UserLoginRequiredError) {
            window.location.href = "login.html"
            return
        }

        if (response instanceof Error) {
            messageDiv.textContent = 'Internal server error!';
            throw new Error(`fetch url ${url} returned error: ${response.message}`);
        }

        if (response.ok) {
            messageDiv.textContent = 'Video information submitted successfully.';
        } else {
            console.error("response: " + response.status);
            messageDiv.textContent = 'Failed to submit video information. Please try again.';
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'An error occurred. Please try again.';
    }
});