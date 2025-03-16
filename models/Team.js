const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' ,
        required: true,
    }],
    course: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course',
        required: true,
    },
    teamIndex: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Team", teamSchema);