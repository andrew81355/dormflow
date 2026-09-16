const registerForm = document.getElementById('register-form');
const registerMessage = document.getElementById('register-message');
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    registerMessage.textContent = '';

// form.elements is a collection of form controls
const email = registerForm.elements.email.value;
const password = registerForm.elements.password.value;
try {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: registerForm.elements.name.value,
            emil,
            roomNumber: registerForm.elements.roomNumber.value,
            password,
        }),
    });
    // get response data as json
    const data = await response.json();
    if (!response.ok) {
        registerMessage.textContent = data.error || 'Registration failed';
        registerMessage.className = 'error message';
        return;
    }
    // log in right after regster 
    const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
    });
    if (!loginResponse.ok) {
        // with created account - student can log in manually
        window.location.href = '/login.html';
        return;
    }
    // getting token from response and save it
    const loginData = await loginResponse.json();
    saveToken(loginData.token);
    window.location.href = '/requests.html';
} catch (err) {
    registerMessage.textContent = 'Connection errors';
    registerMessage.className = 'error message';
}
});
