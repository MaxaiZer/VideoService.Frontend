import { baseUrl } from "./config";
import { RefreshTokenRequest } from "./dto/refreshTokenRequest";
import { TokensResponse } from "./dto/tokensResponse";

export enum CookieNames {
    AccessToken = 'access_token'
}

function pascalToSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

export async function refreshAccessToken(accessToken: string | null, messageDiv: HTMLDivElement): Promise<void> {
    if (!accessToken || !messageDiv) return;

    try {

        const request: RefreshTokenRequest = { access_token: accessToken };

        const response = await fetch(`${baseUrl}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(request)
        });

        if (response.ok) {
            const data: TokensResponse = convertKeysToSnakeCase(await response.json()) as TokensResponse;
            setCookie(CookieNames.AccessToken, data.access_token);
        } else {
            messageDiv.textContent = 'Session expired. Please log in again.';
            setCookie(CookieNames.AccessToken, '', -1);
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        messageDiv.textContent = 'An error occurred. Please log in again.';
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

export function setCookie(name: string, value: string, days?: number): void {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
        expires = "; expires=" + date.toUTCString();
    }
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
