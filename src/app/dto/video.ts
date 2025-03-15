import { HttpParams } from "@angular/common/http";

export interface VideoResponse {
    id: string;               
    userName: string;          
    videoName: string;              
    description: string;         
    createdAt: Date;   
}

export interface VideoUploadRequest {
    name: string
    description: string
    videoFileId: string
}

export class VideoSearchParameters {
    constructor(
      public searchQuery?: string,
      public userId?: string,
      public page: number = 1,
      public pageSize: number = 20
    ) {}
  
    toHttpParams(): HttpParams {
      let params =  new HttpParams()
        .set('page', this.page.toString())
        .set('pageSize', this.pageSize.toString());

        if (this.userId) {
            params = params.set('userId', this.userId);
        }

        if (this.searchQuery) {
            params = params.set('searchQuery', this.searchQuery);
        }

        return params;
    }
  }