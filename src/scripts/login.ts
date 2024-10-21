import { convertKeysToSnakeCase, ItemKeys, saveAccessToken, setCookie } from './common';
import { baseUrl } from './config';
import { LoginRequest  } from './dto/loginRequest'
import { TokensResponse } from './dto/tokensResponse'

const loginForm = document.getElementById('loginForm') as HTMLFormElement;
const messageDiv = document.getElementById('message') as HTMLDivElement;

loginForm.addEventListener('submit', async (event: Event) => {
    event.preventDefault();
    const username = (document.getElementById('loginUsername') as HTMLInputElement).value;
    const password = (document.getElementById('loginPassword') as HTMLInputElement).value;

    try {
        const request: LoginRequest = { username: username, password: password };
        const response = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (response.ok) {
            const data: TokensResponse = convertKeysToSnakeCase(await response.json()) as TokensResponse;
            console.log(`saving access token: ${data.access_token}`)
            saveAccessToken(data.access_token)
            setCookie(ItemKeys.Name, username)
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            messageDiv.textContent = `Login failed: ${errorData.message || 'Unknown error'}`;
            console.error(`Error: HTTP ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'An error occurred during login. Please try again.';
    }
});
