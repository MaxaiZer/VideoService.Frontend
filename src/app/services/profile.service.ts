import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProfileResponse } from '../dto/profile';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  constructor(private http: HttpClient) {}

  getProfile(userId: string): Observable<HttpResponse<ProfileResponse>> {
    return this.http.get<ProfileResponse>(
      `${environment.baseUrl}/api/profiles?userId=${userId}`,
      { withCredentials: true, observe: 'response' }
    );
  }

  getCurrentUserProfile(): Observable<HttpResponse<ProfileResponse>> {
    return this.http.get<ProfileResponse>(
      `${environment.baseUrl}/api/profiles/mine`,
      { withCredentials: true, observe: 'response' }
    );
  }
}
