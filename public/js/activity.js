// activity page: my requests, my bookings and latest status changes
const activityRequests = document.getElementById('activity-requests');
const upcomingBookings = document.getElementById('upcoming-bookings');
const pastBookings = document.getElementById('past-bookings');
const statusChanges = document.getElementById('status-changes');
// same formatting as bookings page
function formatSlot(startAt, endAt) {
    const start = new Date(startAt);
    const end = new Date(endAt);
    const time = { hour: '2-digit', minute: '2-digit' };
    return (
        start.toLocaleDateString() +
        ' • ' +
        start.toLocaleTimeString([], time) +
        ' – ' +
        end.toLocaleTimeString([], time)
    );
}
function showEmpty(list, text) {
    const item = document.createElement('li');
    item.textContent = text;
    list.append(item);
}
function renderRequest(request) {
    const item = document.createElement('li');
    item.className = 'request';
    const header = document.createElement('div');
    header.className = 'request-header';
    const title = document.createElement('h3');
    title.textContent = request.category;
    const badge = document.createElement('span');
    badge.className = 'badge status-' + request.status.toLowerCase().replace(' ', '-');
    badge.textContent = request.status;
    header.append(title, badge);
    const meta = document.createElement('p');
    meta.className = 'request-meta';
    meta.textContent = `Room ${request.roomNumber} • Priority: ${request.priority} • ${new Date(request.createdAt).toLocaleDateString()}`;
    const description = document.createElement('p');
    description.textContent = request.description;
    item.append(header, meta, description);
    return item;
}
function renderBooking(booking) {
    const item = document.createElement('li');
    item.className = 'booking';
    const header = document.createElement('div');
    header.className = 'booking-header';
    const title = document.createElement('h3');
    title.textContent = booking.facilityId ? booking.facilityId.name : 'Facility';
    header.append(title);
    // a past booking that was cancel should have a badge
    if (booking.status === 'Cancelled') {
        const badge = document.createElement('span');
        badge.className = 'badge status-cancelled';
        badge.textContent = 'Cancelled';
        header.append(badge);
    }
    const meta = document.createElement('p');
    meta.className = 'booking-meta';
    meta.textContent = formatSlot(booking.startAt, booking.endAt);
    item.append(header, meta);
    return item;
}
function renderChange(request, entry) {
    const item = document.createElement('li');
    item.className = 'history-item';
    const title = document.createElement('strong');
    title.textContent = `${request.category} (Room ${request.roomNumber}): `;
    const move = document.createTextNode(`${entry.from} → ${entry.to}`);
    const meta = document.createElement('p');
    meta.className = 'meta';
    const who = entry.changedBy && entry.changedBy.name ? entry.changedBy.name : 'staff';
    const when = new Date(entry.changedAt).toLocaleDateString();
    meta.textContent = entry.comment ? `Changed by ${who} • ${when} — ${entry.comment}` : `Changed by ${who} • ${when}`;
    item.append(title, move, meta);
    return item;
}
async function loadActivity() {
    const [requestsResponse, bookingsResponse] = await Promise.all([
        fetch('/api/requests', { headers: authHeaders() }),
        fetch('/api/bookings', { headers: authHeaders() }),
    ]);
    if (requestsResponse.status === 401 || bookingsResponse.status === 401) {
        clearToken();
        window.location.href = '/login.html';
        return;
    }
    if (requestsResponse.ok) {
        const requests = await requestsResponse.json();
        activityRequests.textContent = '';
        if (requests.length === 0) {
            showEmpty(activityRequests, 'No requests yet.');
        } else {
            requests.forEach((request) => activityRequests.append(renderRequest(request)));
        }
        // take history entry of requests
        const changes = [];
        requests.forEach((request) => {
            (request.statusHistory || []).forEach((entry) => changes.push({ request, entry }));
        });
        changes.sort((a, b) => new Date(b.entry.changedAt) - new Date(a.entry.changedAt));
        statusChanges.textContent = '';
        if (changes.length === 0) {
            showEmpty(statusChanges, 'No status changes yet.');
        } else {
            changes.slice(0, 5).forEach((change) => statusChanges.append(renderChange(change.request, change.entry)));
        }
    } else {
        activityRequests.textContent = 'Could not load requests.';
    }
    // upcoming and past bookings
    if (bookingsResponse.ok) {
        const bookings = await bookingsResponse.json();
        const now = new Date();
        const upcoming = bookings.filter((booking) => new Date(booking.endAt) > now);
        const past = bookings.filter((booking) => new Date(booking.endAt) <= now);
        upcomingBookings.textContent = '';
        if (upcoming.length === 0) {
            showEmpty(upcomingBookings, 'No upcoming bookings.');
        } else {
            upcoming.sort((a, b) => new Date(a.startAt) - new Date(b.startAt)).forEach((booking) => upcomingBookings.append(renderBooking(booking)));
        }
        pastBookings.textContent = '';
        if (past.length === 0) {
            showEmpty(pastBookings, 'No past bookings.');
        } else {
            past.forEach((booking) => pastBookings.append(renderBooking(booking)));
        }
    } else {
        upcomingBookings.textContent = 'Could not load bookings.';
    }
}
if (!getToken()) {
    window.location.href = '/login.html';
} else {
    loadActivity();
}