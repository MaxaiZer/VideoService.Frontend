import { ItemKeys, setCookie } from './common';
import { baseUrl } from './config';
import { RegistrationRequest } from './dto/registrationRequest'

const registerForm = document.getElementById('registerForm') as HTMLFormElement;
const messageDiv = document.getElementById('message') as HTMLDivElement;

registerForm.addEventListener('submit', async (event: Event) => {
    event.preventDefault();
    const username = (document.getElementById('registerUsername') as HTMLInputElement).value;
    const password = (document.getElementById('registerPassword') as HTMLInputElement).value;

    try {
        const request: RegistrationRequest = { username: username, password: password };
        const response = await fetch(`${baseUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (response.ok) {
            messageDiv.classList.remove('text-red-500');
            messageDiv.classList.add('text-green-500');
            setCookie(ItemKeys.Name, username)
            messageDiv.textContent = 'Registration successful. You can now log in.';
        } else {
            const errorData = await response.json();
            messageDiv.textContent = `Registration failed: ${errorData.message || 'Unknown error'}`;
            console.error(`Error: HTTP ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'An error occurred during registration. Please try again.';
    }
});
