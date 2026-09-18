// this is for login form submission and handle response from server
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById('login-message');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginMessage.textContent = '';
    // send request to servver with email and pass
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: loginForm.email.value,
                password: loginForm.password.value,
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            loginMessage.textContent = data.error || 'Login fail';
            loginMessage.className = 'error message';
            return;
        }
        // save token to local storage
        saveToken(data.token);
        // open request page after login
        window.location.href = '/requests.html';
    } catch (err) {
        loginMessage.textContent = 'Error logging';
        loginMessage.className = 'error message';
    }
});