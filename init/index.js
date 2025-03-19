const mongoose = require("mongoose");
const Course = require("../models/Course.js");
const User = require("../models/User.js");
const Team = require("../models/Team.js");
const initData = require("./data.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/peerevals"

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) =>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    // // await User.deleteMany({}); //delete all the existing data in the users collection. User. means User model
    // // await User.insertMany(initData.users); //reference key
    // // await Course.deleteMany({});
    // // await Course.insertMany(initData.courses);
    // // await Team.insertMany(initData.teams);
    // // console.log("data was initialised");
    // const existingUsers = await User.find({});
    const existingUsers = await User.find({});
    if (existingUsers.length === 0) {
        await User.insertMany(initData.users);
        console.log("Users initialized.");
    }

    const existingCourses = await Course.find({});
    if (existingCourses.length === 0) {
        await Course.insertMany(initData.courses);
        console.log("Courses initialized.");
    }

    // // Insert courses if they don't exist
    // const existingCourses = await Course.find({});
    // if (existingCourses.length === 0) {
    //     await Course.insertMany(initData.courses);
    //     console.log("Courses initialized.");
    //     const insertedCourses = await Course.find({});
    //     const courseMap = {};
    //     insertedCourses.forEach(course => {
    //         courseMap[course.courseCode] = course._id;
    //     });

    // }

    // // Delete team that exist
    // const existingTeams = await Team.find({});
    // if (existingTeams.length !== 0) {
    //     await Team.deleteMany({});
    //     console.log("Teams deleted.");
    // }

    for (let team of initData.teams) {
        const newTeam = new Team(team);
        await newTeam.save();
        const course = await Course.findById(team.course);

        if (course) {
            course.teams.push( newTeam._id );
            await course.save();
        }
    }

    // console.log("Teams added to courses.");

};
initDB();

