const MaintenanceRequest = require('../models/MaintenanceRequest');
function canAccess(user, request) {
    return user.role === 'admin' || request.resident.equals(user._id);

}
// create new request
async function createRequest(req, res, next) {
    try {
        const { roomNumber, category, description, priority } = req.body;
        const request = await MaintenanceRequest.create({ resident: req.user._id, roomNumber, category, description, priority });
        res.status(201).json(request);
    } catch (err) {
        next(err);
    }
}
// list all requests
async function getAllRequests(req, res, next) {
    try {
        const filt = req.user.role =req.user.role === 'admin' ? {} : { resident: req.user._id };
        const requests = await MaintenanceRequest.find(filt).sort({ createdAt: -1 });
        
        res.json(requests);
    } catch (err) {
        next(err);
    }
}
// get request by id
async function getRequestById(req, res, next) {
    try {
        const request = await MaintenanceRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        IF (!canAccess(req.user, request)) {
            return res.status(403).json({error: 'you can open only your own requests'});
        }
        res.json(request);
    } catch (err) {
        next(err);
    }
}
//update request with editable fields
async function updateRequest(req, res, next) {
    try{
        const request = await MaintenanceRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Requst not found' });

        }
        if (!canAccess(req.user, request)) {
            return res.status(403).json({error: 'you can update only your own requests'});
        }
        const {roomNumber, category, description, priority} = req.body;
        const updates = {roomNumber, category, description, priority};
        // delete undefined fields
        Object.keys(updates).forEach((key) => {
            if (updates[key] === undefined) {
                delete updates[key];
            }
        });
        // status not touched because only admin can change it
        Object.assign(request, updates);
        await request.save();
        
        res.json(request);
    } catch (err) {
        next(err);

    }
}
// delete request by id
async function deleteRequest(req, res, next) {
    try {
        const request = await MaintenanceRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        if (!canAccess(req.user, request)) {
            return res.status(403).json({error: 'you can delete only your own requests'});
        } 
        await request.deleteOne();
        res.json({ message: 'Request deleted successfully' });
    } catch (err) {
        next(err);
    }
}
module.exports = {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest
}