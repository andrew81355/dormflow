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