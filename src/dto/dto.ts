export interface TokensResponse {
    access_token: string;
}

export interface GetUploadUrlResponse {
    url: string;
    file_name: string;
}

export interface RefreshTokenRequest {
    access_token: string;
}

export interface RegistrationRequest {
    username: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface VideoResponse {
    id: string;               
    userName: string;          
    videoName: string;              
    description: string;         
    createdAt: Date;   
}