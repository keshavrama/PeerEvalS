const mongoose = require("mongoose");
const validator = require('validator');

const userSchema = new mongoose.Schema({
    microsoftId: {  // Store Microsoft's UUID separately
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Invalid email address"],
    }, 
    name:{
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "instructor", "student"],
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course',
    }],
    teams: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team',
    }],
});


module.exports = mongoose.model("User", userSchema);