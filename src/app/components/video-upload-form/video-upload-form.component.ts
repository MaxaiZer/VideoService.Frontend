import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { VideoService } from '../../services/video.service';
import { VideoUploadRequest } from '../../dto/video';
import { take } from 'rxjs';
import { FileService } from '../../services/file.service';
import { ErrorComponent } from "../error/error.component";
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-video-upload-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ErrorComponent],
  templateUrl: './video-upload-form.component.html',
  styleUrl: './video-upload-form.component.scss'
})

export class VideoUploadFormComponent {

  videoService = inject(VideoService)
  fileService = inject(FileService)

  name!: string;
  description!: string;
  fileId!: string;

  file: File | undefined;
  fileUploaded: boolean = false;
  uploadProgress: number = 0;
  fileMaxSize: number = 100 * 1024 * 1024;

  videoUploaded: boolean = false;
  error: string | null = null;

  onFileChange(event: any) {
    
    this.error = null;
    this.fileUploaded = this.videoUploaded = false;

    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg']; 

    if (!allowedTypes.includes(file.type)) {
      this.error = "invalid format";
    } else if (file.size > this.fileMaxSize) {
      this.error = "size is greater than required";
    } else {
      this.file = file;
    }

    if (this.error) return;

    this.fileService.uploadFile(file).subscribe({
      next: (event: { fileId: string; response: HttpEvent<Object> }) => { 
        switch (event.response.type) {
          case HttpEventType.UploadProgress:
            if (event.response.total) {
              this.uploadProgress = Math.round((100 * event.response.loaded) / event.response.total);
            }
            console.log(`Uploaded ${this.uploadProgress}%`);
            break;
          case HttpEventType.Response:
            this.fileId = event.fileId;
            this.fileUploaded = true;
            console.log('File uploaded successfully:', event.fileId);
            break;
        }
      },
      error: err =>  {
        this.error = "Internal error"
        console.error('Error uploading file:', err);
      }
    })
  }

  onSubmit() {

    this.error = null;

    const request: VideoUploadRequest = {
      name: this.name,
      description: this.description,
      videoFileId: this.fileId
    };

    this.videoService.uploadVideo(request)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.videoUploaded = true;
          console.log('Video uploaded successfully:', response);
        },
        error: (err) => {
          this.error = "Internal server error";
          console.error('Error uploading video data:', err);
        }
      });
  }
}
