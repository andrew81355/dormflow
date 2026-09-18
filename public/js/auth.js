// auth function for front end
function getToken() {
    return localStorage.getItem('token');
}
function saveToken(token) {
    localStorage.setItem('token', token);
}
function clearToken() {
    localStorage.removeItem('token');

}
function authHeaders() {
    const token = getToken();
    return token ? {Authorization: `Bearer ${token}`} : {};
}
// show name of the logged user in nav bar and adding logout link
async function showCurrentUser (){
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks || !getToken()) {
        return;
    }
    let user;
    try {const response = await fetch('/api/auth/me', {headers: authHeaders()});
        if (!response.ok) {
            clearToken();
            return;
        }
        user = await response.json();
    } catch (err) {
        return; // ignor error
    }
    // remove login and register links
    
    navLinks.querySelectorAll('a[href="/login.html"], a[href="/register.html"]').forEach(link => link.parentElement.remove());
    // dashboard link only for admin
    if (user.role === 'admin' && !navLinks.querySelector('a[href="/admin.html"]')) {
        const adminItem = document.createElement('li');
        const adminLink = document.createElement('a');
        adminLink.href = '/admin.html';
        adminLink.textContent = 'Admin';
        adminItem.append(adminLink);
        navLinks.append(adminItem);
    }
    const userItem = document.createElement('li');
    userItem.textContent = user.name;
    const logoutItem = document.createElement('li');
    const logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.textContent = 'Logout';
    logoutLink.addEventListener('click', (event) => {
        event.preventDefault();
        clearToken();
        window.location.href = '/login.html';
    });
    // show user name in nav bar
    logoutItem.append(logoutLink);
    navLinks.append(userItem, logoutItem);
}
showCurrentUser();