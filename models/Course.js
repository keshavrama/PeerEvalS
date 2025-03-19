const mongoose = require("mongoose");

let courseSchema = new mongoose.Schema({
    description: { //courseName e.g. strat mgt
        type: String,
        required: true,
    },
    courseCode: { //ab3601
        type: String, 
        required: true,
    }, 
    courseId: String, //24S1-AB3601-AB3602-SEM-8
    instructors: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    }],
    teams: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team',
    }],
}); 

let Course = mongoose.model("Course", courseSchema);

module.exports = Course;