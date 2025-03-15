import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UploadComponent } from './pages/upload/upload.component';
import { AuthGuard } from './services/auth.guard';
import { AuthComponent } from './pages/auth/auth.component';
import { VideoComponent } from './pages/video/video.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/me', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent },
  { path: 'video', component: VideoComponent },
  { path: '**', redirectTo: '' }
];
