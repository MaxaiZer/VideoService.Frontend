import { getCookie, ItemKeys, removeCookie, userLogged } from "./common";

document.addEventListener('DOMContentLoaded', () => {
    
    if (!userLogged()) {
        window.location.href = "login.html"
        return;
    }

    const usernameElement = document.getElementById('username');
    const logoutButton = document.getElementById('logoutButton');

    if (usernameElement == null || logoutButton == null) {
        console.error("Missing usernameElement or logoutButton")
        return;
    }

    usernameElement.textContent = `Welcome, ${getCookie(ItemKeys.Name)}`;

    logoutButton.addEventListener('click', () => {
        removeCookie(ItemKeys.Name)
        window.location.href = 'login.html';
    });
});