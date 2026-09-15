// connect url and http methods to controller functions 
const express = require('express');
const router = express.Router();
const {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest
} = require('../controllers/requestController');
router.get('/', getAllRequests);
router.post('/', createRequest);
router.get('/:id', getRequestById);
router.put('/:id', updateRequest);
router.delete('/:id', deleteRequest);
module.exports = router;