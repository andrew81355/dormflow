const form = document.getElementById('request-form');
const message = document.getElementById('form-message');
const list = document.getElementById('request-list');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = '';
    //owner gets from token
    const newRequest = {
        roomNumber: form.roomNumber.value,
        category: form.category.value,
        priority: form.priority.value,
        description: form.description.value
    };
    // send the request to the server
    try {
        const response = await fetch('/api/requests', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', ...authHeaders()},
            body: JSON.stringify(newRequest)
        });
        if (response.ok) {
            message.textContent = 'Request submitted successfully!';
            message.className = 'message success';
            form.reset();
            loadRequests();
        } else {
            const data = await response.json();
            message.textContent = data.error || 'Failed to submit request.';
            message.className = 'message error';
        } 

        } catch (err) {
            message.textContent = 'Error submitting request: ';
            message.className = 'message error';
        }
    });
//  li card for each request
function renderRequest(request) {
    const item = document.createElement("li");
    item.className = 'request';
    const header = document.createElement("div");
    header.className = 'request-header';
    const title = document.createElement("h3");
    title.textContent = request.category;
    const badge = document.createElement("span");
    badge.className = 'badge status-' + request.status.toLowerCase().replace(' ', '-');
    badge.textContent = request.status;
    header.append(title, badge);
    const meta = document.createElement("p");
    meta.className = 'request-meta';
    const date = new Date(request.createdAt).toLocaleDateString();
    meta.textContent = `Room ${request.roomNumber} ; Priority: ${request.priority} ; ${date}`;
    const description = document.createElement("p");
    description.textContent = request.description;
    item.append(header, meta, description);
    return item;
}
// load request from server and show them on the page
async function loadRequests() {
    try {
        const response = await fetch('/api/requests', {headers: authHeaders()});
        //if problem with token redirect to login page
        if (response.status === 401) {
            clearToken();
            window.location.href = '/login.html';
            return;
        }
        if (!response.ok) {
            list.textContent = 'Could not load requests.';
            return;
        }
        const requests = await response.json();
        list.textContent = '';
        if (requests.length === 0) {
            const empty = document.createElement("li");
            empty.textContent = 'No requests found.';
            list.append(empty);
            return;
        }
        requests.forEach((request) => list.append(renderRequest(request)));
    } catch (err) {
        list.textContent = 'Error loading requests.';
    }
}
// check user is log in and load requests or go to login page
if (!getToken()) {
    window.location.href = '/login.html';
} else {
    loadRequests();
}