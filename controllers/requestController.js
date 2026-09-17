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
// empty means status is final anc cant be changed
const allowedTransitions = {
    Submitted: ['Reviewed', 'Rejected', 'Cancelled'],
    Reviewed: ['In Progress', 'Rejected'],
    'In Progress': ['Completed'],
    Completed: [],
    Rejected: [],
    Cancelled: []
};
// list all requests
async function getAllRequests(req, res, next) {
    try {
        const filt = req.user.role === 'admin' ? {} : { resident: req.user._id };
        const { status, category, priority, roomNumber, q, page, limit } = req.query;
        if (status) {
            filter.status = status;
        }
        if (category) {
            filter.category = category;
        }
        if (priority) {
            filter.priority = priority;
        }
        if (roomNumber) {
            filter.roomNumber = roomNumber;
        }
        if (q) {
            const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.$or = [
                { description: { $regex: safe, $options: 'i' } },
                { roomNumber: { $regex: safe, $options: 'i' } },
            ];
        }
        
        
        const query = MaintenanceRequest.find(filter).populate('statusHistory.changedBy', 'name').sort({ createdAt: -1 });
        const perPage = Number(limit)
        if (perPage > 0) {
            const currentPage = Number(page) > 0 ? Number(page) : 1;
            query.skip((currentPage - 1) * perPage).limit(perPage);
        }
        const requests = await query;
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
        if (!canAccess(req.user, request)) {
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
// update request by admin with status and comment
async function updateRequestStatus(req, res, next) {
    try {
        const {status, comment} = req.body;
    if (!status) {
        return res.status(400).json({error: 'status required'});
    }
    // 
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) {
        return res.status(404).json({error: 'Request not found'});
    }
    const isAdmin = req.user.role === 'admin';
    const isOwner = request.resident.equals(req.user._id);
    // student can cancel his own request if it cancelled or submitted and admin can changes statuses of request
    const studentCancel = isOwner && status === 'Cancelled' && request.status === 'Submitted';
    if (!isAdmin && !studentCancel) {
        return res.status(403).json({error: 'you can not change status'});
    }
    const allowed = allowedTransitions[request.status] || [];
    if (!allowed.includes(status)) {
        return res.status(400).json({error: `wrong status changes from ${request.status} to ${status}`});
    }
    // add history entry , 1 is fromstatus 2 is to status 3 is who changed it 4 is comment 5 is date
    const historyEntry = {
        from: request.status,
        to: status,
        changedBy: req.user._id,
        comment: comment || '',
        changedAt: new Date(),
    };
    const updates = {status};
    
    if (isAdmin && comment) {
        updates.adminComment = comment;
    }
    // update request with status and history 
    const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(
        request._id,
        {$set: updates, $push: {statusHistory: historyEntry}},
        {new: true, runValidators: true}
    );
    res.json(updatedRequest);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    updateRequestStatus,
    allowedTransitions,
};