import { baseUrl } from "./config";
import { TokensResponse } from "./dto/tokensResponse";

export enum ItemKeys {
    AccessToken = 'access_token',
    Name = 'name'
}

export class UserLoginRequiredError extends Error {
    statusCode: number;
    constructor(message = 'User login is required.') {
        super(message);
        this.name = 'UserLoginRequiredError';
        this.statusCode = 401;
    }
}

export async function tryFetchWithAuth(url: string, options: RequestInit): Promise<Response | Error>
 {
    options.headers = options.headers || {};
    (options.headers as Record<string, string>)['Authorization'] = `Bearer ${getAccessToken()}`;
    
    let response = await fetch(url, options);
    if (response.ok)
        return response;
    if (response.status !== 401) {
        console.log("tryFetchWithAuth: not 401 error")
        return Error(`fetch url returned ${response.status} by url ${url}`);
    }

    console.log("tryFetchWithAuth: 401 error. Starting refresh of access token...")
    const refreshResponse = await refreshAccessToken();
    if (refreshResponse instanceof Error) {
        return refreshResponse;
    } 
    
    (options.headers as Record<string, string>)['Authorization'] = `Bearer ${getAccessToken()}`;
    response = await fetch(url, options);
    return response
}

async function refreshAccessToken(): Promise<void | Error> {
    try {

        const response = await fetch(`${baseUrl}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.ok) {
            console.log("refresh of access token is successful!")
            const data: TokensResponse = convertKeysToSnakeCase(await response.json()) as TokensResponse;
            saveAccessToken(data.access_token)
        } else {
            const errorMessage = await response.text();
            console.log(`refresh of access token failed! Status: ${response.status}, message: ${errorMessage}`)
            clearAccessToken()
            return new UserLoginRequiredError();
        }
    } catch (error) {
        
        if (error instanceof Error) {
            console.error("Refresh token catched error:", error.message);
            return error;
        } else {
            console.error("Refresh token catched unknown error:", error);
            return Error("Refresh token error: " + error)
        }
    }
}

export function convertKeysToSnakeCase<T>(obj: T): unknown {
    const newObj: Record<string, unknown> = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const newKey = pascalToSnakeCase(key);
            newObj[newKey] = obj[key];
        }
    }
    return newObj;
}

function pascalToSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

export function userLogged(): boolean {
    const cookie = localStorage.getItem(ItemKeys.Name);
    return cookie != null && cookie != "";
}

export function getAccessToken(): string | null {

    const item = sessionStorage.getItem(ItemKeys.AccessToken)
    if (item == null)
        return null

    const parsedItem = JSON.parse(item);
    console.log("parsed access token: ", parsedItem)
    if (new Date().getTime() > parsedItem.expiration) {
        sessionStorage.removeItem(ItemKeys.AccessToken);
        return null;
    }

    return parsedItem.value;
}

export function saveAccessToken(token: string) {
    
    const now = new Date();
    const expirationTime = now.getTime() + 4 * 60 * 1000;
    const item = {
        value: token,
        expiration: expirationTime,
    };

    sessionStorage.setItem(ItemKeys.AccessToken, JSON.stringify(item))
}

function clearAccessToken() {
    sessionStorage.removeItem(ItemKeys.AccessToken)
}

export function removeCookie(name: string) {
    setCookie(name, "", -1);
}

export function setCookie(name: string, value: string, expiryTimeInSeconds: number = 365 * 24 * 60 * 60): void {
    const expiryDate = new Date();
    expiryDate.setTime(new Date().getTime() + expiryTimeInSeconds * 1000)

    const expires = "; expires=" + expiryDate.toUTCString();
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

export function getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
