import { Component } from '@angular/core';
import { VideoUploadFormComponent } from '../../components/video-upload-form/video-upload-form.component';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [VideoUploadFormComponent],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
 
}
