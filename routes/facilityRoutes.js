const express = require('express');
const router = express.Router();
const {
    getFacilities,
    getFacilityById,
    createFacility,
    updateFacility,
    deleteFacility,
} = require('../controllers/facilityController');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
// every route below needs a valid token
router.use(auth);
// reading is open to any logged in user
router.get('/', getFacilities);
router.get('/:id', getFacilityById);
// changing facilities is only for admin
router.post('/', requireAdmin, createFacility);
router.patch('/:id', requireAdmin, updateFacility);
router.delete('/:id', requireAdmin, deleteFacility);
module.exports = router;