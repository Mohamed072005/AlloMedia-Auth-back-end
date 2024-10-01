const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
    },
    country:{
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'client', 'dilevery'], default: 'client'
    },
    virefied: {
        type: Boolean,
        default: false
    },
    user_agents: [
        {
            agent: String,
            addedAt: {
                type: Date,
                default: Date.now,
            },
            isCurrent: {
                type: Boolean,
                default: false
            }
        }
    ]
},
{ timestamps: true },
)

module.exports = mongoose.model('User', userSchema);