import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VideoResponse, VideoSearchParameters, VideoUploadRequest } from '../dto/video';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private http: HttpClient) { }

  fetchVideos(params: VideoSearchParameters): Observable<VideoResponse[]> {
    return this.http.get<VideoResponse[]>(`${environment.baseUrl}/api/videos`, { params: params.toHttpParams() });
  }

  fetchVideo(videoId: string): Observable<VideoResponse> {
    return this.http.get<VideoResponse>(`${environment.baseUrl}/api/videos/${videoId}`);
  }

  uploadVideo(request: VideoUploadRequest): Observable<HttpResponse<any>> {
    return this.http.post(`${environment.baseUrl}/api/videos`, request, { observe: 'response' })
  }
}
