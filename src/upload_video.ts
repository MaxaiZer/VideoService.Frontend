import { baseUrl } from './config';
import { convertKeysToSnakeCase, getCookie, CookieNames, refreshAccessToken } from './common';
import { GetUploadUrlResponse } from './dto/getUploadUrlResponse';

const form = document.getElementById('uploadForm') as HTMLFormElement | null;
const fileInput = document.getElementById('videoFile') as HTMLInputElement | null;
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement | null;
const messageDiv = document.getElementById('message') as HTMLDivElement | null;

if (!fileInput || !submitBtn || !form || !messageDiv)
    throw Error("Required elements can't be found");

let videoId: string | null = null;
let accessToken: string | null = null;

document.addEventListener('DOMContentLoaded', function () {
    accessToken = localStorage.getItem(CookieNames.AccessToken);
    console.log("access: " + accessToken);
    console.log("cookie access: " + getCookie(CookieNames.AccessToken));
});

fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file || !messageDiv || !submitBtn) return;

    try {
        // Step 1: Get presigned URL from the server
        let response = await fetchWithAuth(`${baseUrl}/videos/presigned_upload_url`, {
            method: 'GET'
        });

        if (response.status === 401) {
            await refreshAccessToken(accessToken, messageDiv);
            response = await fetchWithAuth(`${baseUrl}/videos/presigned_upload_url`, {
                method: 'GET'
            });
        } else if (response.status !== 200) {
            throw new Error(`fetch url returned ${response.status} by url ${baseUrl}/videos/presigned_upload_url`);
        }

        const data = convertKeysToSnakeCase(await response.json()) as GetUploadUrlResponse;
        console.log("received data: ", data);

        videoId = data.file_name;
        const presignedUrl = data.url;

        // Step 2: Upload file using XMLHttpRequest to track progress
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', presignedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);

        const startTime = Date.now();

        xhr.upload.onprogress = function (event) {
            if (!event.lengthComputable || !messageDiv) return;

            const percentComplete = (event.loaded / event.total) * 100;
            const elapsedTime = (Date.now() - startTime) / 1000; // seconds
            const uploadSpeed = event.loaded / elapsedTime; // bytes per second
            const speedInKbps = uploadSpeed / 1024; // convert to Kbps
            const remainingTime = (event.total - event.loaded) / uploadSpeed; // seconds

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

    if (!videoId || !messageDiv) {
        console.error("No video id!");
        return;
    }

    const dataToSend = JSON.stringify({
        uploadedVideoId: videoId,
        name: (document.getElementById('videoName') as HTMLInputElement)?.value,
        description: (document.getElementById('videoDescription') as HTMLInputElement)?.value
    });

    console.log("sending form: ", dataToSend);

    try {
        let response = await fetchWithAuth(`${baseUrl}/videos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: dataToSend
        });

        if (response.status === 401) {
            await refreshAccessToken(accessToken, messageDiv);
            response = await fetchWithAuth(`${baseUrl}/videos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: dataToSend
            });
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

async function fetchWithAuth(url: string, options: RequestInit): Promise<Response> {
    options.headers = options.headers || {};
    (options.headers as Record<string, string>)['Authorization'] = `Bearer ${getCookie(CookieNames.AccessToken)}`;
    return fetch(url, options);
}