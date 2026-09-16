// connect url and http methods to controller functions 
const express = require('express');
const router = express.Router();
const {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    updateRequestStatus,
} = require('../controllers/requestController');
const auth = require('../middleware/auth');
router.use(auth);
router.get('/', getAllRequests);
router.post('/', createRequest);
router.get('/:id', getRequestById);
router.put('/:id', updateRequest);
router.delete('/:id', deleteRequest);
router.put('/:id/status', updateRequestStatus);
module.exports = router;