const Facility = require('../models/Facility');

// list all facilities
async function getFacilities(req, res, next) {
    try {
        const facilities = await Facility.find().sort({ name: 1 });
        res.json(facilities);
    } catch (err) {
        next(err);
    }
}

async function getFacilityById(req, res, next) {
    try {
        const facility = await Facility.findById(req.params.id);

        if (!facility) {
            return res.status(404).json({ error: 'Facility not found' });
        }

        res.json(facility);
    } catch (err) {
        next(err);
    }
}

// 
async function createFacility(req, res, next) {
    try {
        const { name, description, location, capacity, available, slotMinutes, pricePerSlot } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const facility = await Facility.create({
            name,
            description,
            location,
            capacity,
            available,
            slotMinutes,
            pricePerSlot,
        });

        res.status(201).json(facility);
    } catch (err) {
        next(err);
    }
}

// update facility with  fields
async function updateFacility(req, res, next) {
    try {
        const facility = await Facility.findById(req.params.id);

        if (!facility) {
            return res.status(404).json({ error: 'Facility not found' });
        }

        const { name, description, location, capacity, available, slotMinutes, pricePerSlot } = req.body;
        const updates = { name, description, location, capacity, available, slotMinutes, pricePerSlot };

        // delete undefined fields
        Object.keys(updates).forEach((key) => {
            if (updates[key] === undefined) {
                delete updates[key];
            }

        });

        Object.assign(facility, updates);
        await facility.save();

        res.json(facility);
    } catch (err) {
        next(err);

    }
}

async function deleteFacility(req, res, next) {
    try {
        const facility = await Facility.findById(req.params.id);

        if (!facility) {
            return res.status(404).json({ error: 'Facility not found' });
        }

        await facility.deleteOne();
        
        res.json({ message: 'Facility deleted successfully' });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getFacilities,
    getFacilityById,
    createFacility,
    updateFacility,
    deleteFacility,
};