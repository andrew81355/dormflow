const mongoose = require('mongoose');
// a schema for maintenance requests which will be stored in mongoDB
const maintenanceRequestSchema = new mongoose.Schema(
    {resident: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true
    },
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
        enum: ['Submitted', 'Reviewed', 'In Progress', 'Completed', 'Rejected', 'Cancelled'],
        default: "Submitted"
    },
    adminComment: {type: String, default: ""},
    statusHistory: [
        {
            from: String,
            to: String,
            changedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            changedAt: {type: Date, default: Date.now},
            comment: String,
        },
    ],
    },
    {timestamps: true} // createdAt and updatedAt

);
module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);