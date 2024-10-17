const mongoose = require('mongoose')

const jwtBlacklistSchema = new mongoose.Schema({
    jwt_token: {
        type: String,
        required: true
    }
},
{ timestamps: true },
)

module.exports = mongoose.model('BlacklistJWT', jwtBlacklistSchema);