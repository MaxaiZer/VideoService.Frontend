import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetUploadUrlResponse } from '../dto/upload';
import { environment } from './../../environments/environment';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  getLinkForUpload(): Observable<GetUploadUrlResponse> {
    return this.http.get<GetUploadUrlResponse>(`${environment.baseUrl}/api/videos/upload-url`, 
      { withCredentials: true });
  }

  uploadFile(file: File): Observable<{fileId: string; response: HttpEvent<Object>}> {

    return this.getLinkForUpload().pipe(
      catchError(error => {
        return throwError(() => Error(`Error fetching upload URL: ${error.message || 'Unknown error'}`));
      }),
      switchMap((urlResponse: GetUploadUrlResponse) => {
        
        const uploadUrl = urlResponse.url;
        const fileId = urlResponse.fileId

        return this.http.put(uploadUrl, file, { observe: 'events', reportProgress: true }).pipe(
          map((uploadResponse) => ({
            fileId,
            response: uploadResponse,
          })),
          catchError(error => {
            return throwError(() => new Error(`Error fetching upload URL: ${error.message || 'Unknown error'}`));
          }));
      })
    );
  }
}
