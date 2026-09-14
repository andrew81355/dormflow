const MaintenanceRequest = require('../models/maintenanceRequest');
// create new request
async function createRequest(req, res, next) {
    try {
        const { resident, roomNumber, category, description, priority } = req.body;
        const request = await MaintenanceRequest.create({ resident, roomNumber, category, description, priority });
        res.status(201).json(request);
    } catch (err) {
        next(err);
    }
}
// list all requests
async function getAllRequests(req, res, next) {
    try {
        const requests = await MaintenanceRequest.find().sort({ createdAt: -1 });
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
        res.json(request);
    } catch (err) {
        next(err);
    }
}
//update request with editable fields
async function updateRequest(req, res, next) {
    try{
        const {roomNumber, category, description, priority} = req.body;
        const updates = {roomNumber, category, description, priority};
        // delete undefined fields
        Object.keys(updates).forEach((key) => {
            if (updates[key] === undefined) {
                delete updates[key];
            }
        });
        const request = await MaintenanceRequest.findByIdAndUpdate(req.params.id, updates, {new:true, runValidators:true});
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(request);
    } catch (err) {
        next(err);

    }
}
// delete request by id
async function deleteRequest(req, res, next) {
    try {
        const request = await MaintenanceRequest.findByIdAndDelete(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
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