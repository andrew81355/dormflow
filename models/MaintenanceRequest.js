const mongoose = require('mongoose');
// a schema for maintenance requests which will be stored in mongoDB
const maintenanceRequestSchema = new mongoose.Schema(
    {resident: {type: String, required: true},
    roomNumber: {type: String, required: true},
    category: {
        type: String,
        enum: ['Plumbing', 'Electricity', 'Heating', 'Furniture', 'Internet', 'Other'],
        required: true
    },
    description: {type: String, required: true},
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: "Medium"
    },
    status: {type: String,
        enum: ['Submitted', 'Reviewed', 'In Progress', 'Completed', 'Rejected'],
        default: "Submitted"
    },
    adminComment: {type: String, default: ""},

    },
    {timestamps: true} // createdAt and updatedAt

);
module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);