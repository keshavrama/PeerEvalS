if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
};

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Course = require("./models/Course.js");
const Rubric = require('./models/Rubric.js');
const User = require("./models/User.js");
const Team = require("./models/Team.js");
const Evaluation = require('./models/Evaluation.js');
const ejsMate = require("ejs-mate");
// const MONGO_URL = "mongodb://127.0.0.1:27017/peerevals"
const dbUrl = process.env.ATLASDB_URL;

const session = require("express-session");

const MongoStore = require('connect-mongo');
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, //24hrs into secs. session be updated only one time in a period of 24 hours, does not matter how many request's are made
});
store.on("error", () => {
    console.log("Error in Mongo Session Store", err);
})

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const { courseSchema } = require("./schema.js");
const validateCourse = (req, res, next) => {
    let { error } = courseSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const cookieParser = require('cookie-parser');
// Middleware to parse cookies
app.use(cookieParser());

const flash = require("connect-flash");
app.use(flash());

const { isSignedIn, saveRedirectUrl } = require("./middleware.js");

const passport = require("passport");
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const bodyParser = require('body-parser');
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(session({
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}));
app.use(passport.initialize());
app.use(passport.session());
// Configure Microsoft authentication
//http://localhost:3000/auth/microsoft/callback
//https://peerevals.onrender.com/auth/microsoft/callback
passport.use(new MicrosoftStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET_VALUE,
    callbackURL: "https://peerevals.onrender.com/auth/microsoft/callback",
    scope: ['user.read'],
    tenant: 'common'
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;

            if (!email.endsWith("@e.ntu.edu.sg") && !email.endsWith("@ntu.edu.sg")) {
                return done(null, false, { message: "Unauthorized: Only NTU users can log in." });
            }

            let role = email.endsWith("@ntu.edu.sg") ? "instructor" : "student";

            const cleanName = profile.displayName.replace(/#/g, "").trim(); //trim # coz microsoft name field contains it

            let user = await User.findOne({ microsoftId: profile.id });  // Find using microsoftId

            if (!user) {
                user = await User.findOne({ email: { $regex: new RegExp(`${email}$`, `i`) } }); //search by case-insensitive email

                if (user) {
                    // If the user exists but has no Microsoft ID, update it
                    user.microsoftId = profile.id;
                    await user.save();
                }
                else {
                    user = new User({
                        microsoftId: profile.id,  // Store microsoft UUID
                        email: email.toLowerCase(),
                        name: cleanName,
                        role: role,
                    });
                    await user.save();
                }
            }

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }));

passport.serializeUser((user, done) => { //through serialize, current user's info is being stored
    done(null, user.microsoftId);  // Store user ID in the session
});

passport.deserializeUser(async (microsoftId, done) => {
    try {
        const user = await User.findOne({ microsoftId: microsoftId });
        done(null, user);  // Attach user data to `req.user`
    } catch (err) {
        done(err, null);
    }
});


main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

app.use((req, res, next) => { //global middleware that is being checked before every request from user
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; //add a currUser Variable that stores curr user's info in req.user
    //req.user is added by Passport.js when a user is authenticated. When a user logs in, 
    // Passport retrieves their data from the session and attaches it to req.user.
    next();
})

app.get('/login', (req, res) => res.render("./users/login.ejs"));

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
    })
    req.flash("success", "You have successfully signed out!");
    res.redirect('/login');
});

// Authentication routes
app.get('/auth/microsoft',
    passport.authenticate('microsoft', { prompt: 'select_account' })
);

app.get('/auth/microsoft/callback', saveRedirectUrl,
    passport.authenticate('microsoft', { failureRedirect: '/login' }),
    (req, res) => {
        req.flash("success", "Welcome to PeerEvalS!");
        let redirectUrl = res.locals.redirectUrl || "/courses";
        res.redirect(redirectUrl);
    }
);

app.get('/', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.redirect('/courses');
});


//COURSES
//Count of courses:
app.get("/home", isSignedIn, wrapAsync(async (req, res, next) => {
    const countCourses = await Course.countDocuments(
        {
            $or: [
                { instructors: req.user._id },
                { students: req.user._id }
            ]
        }
    );
    res.render("./course/home.ejs", { countCourses });
}));

//1a) Index Route - all courses
app.get("/courses", isSignedIn, wrapAsync(async (req, res, next) => {
    const allCourses = await Course.find(
        {
            $or: [
                { instructors: req.user._id },
                { students: req.user._id }
            ]
        }
    );
    res.render("./course/index.ejs", { allCourses, no: 1 });
}));

//2a) New Route - create a new course [form] 
app.get("/courses/new", (req, res) => {
    res.render("./course/new.ejs");
});

//1b) Show Route - view a course in detail according to id
app.get("/courses/:id", isSignedIn, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid course ID.");
        return res.redirect("/courses");
    }
    // try{
    let course = await Course.findById(id).populate({ path: "instructors", model: "User", }).populate({ path: "students", model: "User", });
    if (!course) {
        req.flash("error", "The course that you requested for, does not exist");
        res.redirect("/courses");
    }
    let courseTeams = await Course.findById(id).populate({ path: "teams", populate: { path: "members", }, });
    let rubrics = await Rubric.find({ courseId: id });
    let evaluations = [];
    if (rubrics.length > 0) {
        for (const team of courseTeams.teams) {  // teams array
            if (team.members.some(member => member._id.toString() === req.user._id.toString())) {
                evaluations = await Evaluation.find({ teamId: team._id, evaluatorId: req.user._id });
                break;  // Stop if found evaluation 
            }
        }
    }
    res.render("./course/show.ejs", { viewCourse: course, courseTeams, rubrics, evaluations });
}));

//2b) Create Route - add the new course created to db
app.post("/courses", isSignedIn, wrapAsync(async (req, res, next) => {
    const { description, courseCode, courseId } = req.body;
    const instructors = Object.values(req.body.instructors || {}); // Convert to array
    const students = Object.values(req.body.students || {}); // Convert to array

    if (!instructors.length) throw new ExpressError(400, "At least one instructor is required.");
    if (!students.length) throw new ExpressError(400, "At least one student is required.");

    // instructors
    const instructorIds = await Promise.all(
        instructors.map(async ({ name, email }) => {
            let instructor = await User.findOne({ email: { $regex: new RegExp(`${email}$`, `i`) }, role: "instructor" });
            if (!instructor) {
                instructor = new User({ name, email, role: "instructor", microsoftId: null });
                await instructor.save();
            }
            return instructor._id;
        })
    );

    // students
    const studentIds = await Promise.all(
        students.map(async ({ name, email }) => {
            let student = await User.findOne({ email: { $regex: new RegExp(`${email}$`, `i`) }, role: "student" });
            if (!student) {
                student = new User({ name, email, role: "student", microsoftId: null });
                await student.save();
            }
            return student._id;
        })
    );

    // Create and save new course
    const newCourse = new Course({
        description,
        courseCode,
        courseId,
        instructors: instructorIds,
        students: studentIds,
    });
    await newCourse.save();

    req.flash("success", "New Course created successfully");
    res.redirect("/courses");
}));

//3a) Edit Route - edit course according to id
app.get("/courses/:id/edit", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let viewCourse = await Course.findById(id).populate({ path: "instructors", model: "User", }).populate({ path: "students", model: "User", });
    res.render("./course/edit.ejs", { viewCourse });
}));

//3b) Update Route - update the edited course into db
app.put("/courses/:id", isSignedIn, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    const instructors = [];
    const students = [];

    const members = data.members;

    for (let i = 0; i < members.length; i++) {
        const member = members[i];
        const { role, name, email } = member;

        if (role === 'instructor') {
            const existingInstructor = await User.findOne({ email: email, role: 'instructor' });
            if (!existingInstructor) {
                const newInstructor = new User({
                    name: name,
                    email: email,
                    role: 'instructor',
                });
                await newInstructor.save();
                instructors.push(newInstructor._id);
            } else {
                existingInstructor.name = name;
                existingInstructor.email = email;
                await existingInstructor.save();
                instructors.push(existingInstructor._id);
            }
        } else if (role === 'student') {
            const existingStudent = await User.findOne({ email: email, role: 'student' });
            if (!existingStudent) {
                const newStudent = new User({
                    name: name,
                    email: email,
                    role: 'student',
                });
                await newStudent.save();
                students.push(newStudent._id);
            } else {
                existingStudent.name = name;
                existingStudent.email = email;
                await existingStudent.save();
                students.push(existingStudent._id);
            }
        }
    }

    // Update the course with the new data
    const updatedCourse = await Course.findByIdAndUpdate(
        id,
        {
            description: data.description,
            courseCode: data.courseCode,
            courseId: data.courseId,
            instructors,
            students,
        },
        { new: true } // Return the updated doc
    );

    if (!updatedCourse) {
        throw new ExpressError(400, "Course not found.");
    }
    req.flash("success", "Course updated successfully");
    res.redirect(`/courses/${id}`);
}));

//4) Delete Route - delete course
app.delete("/courses/:id", isSignedIn, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deletedCourse = await Course.findByIdAndDelete(id);
    console.log(deletedCourse);
    req.flash("success", "Course deleted");
    res.redirect("/courses");
}));

//TEAMS
//Create Teams
app.get("/teams/:id/new", isSignedIn, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let course = await Course.findById(id).populate("students");
    res.render("./team/newTeam.ejs", { course });
})); //added functionality on ejs where if all members are already in teams, instructor should not be able to create team

//Add created teams to db
app.post("/teams/:id", isSignedIn, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const teamsData = req.body.teams;

    const teamIds = [];

    for (const teamIndex in teamsData) {
        const teamData = teamsData[teamIndex];

        // Find user IDs based on their names
        const userIds = await User.find({ name: { $in: teamData.members } }).select("_id");

        if (userIds.length !== teamData.members.length) {
            console.log("userIds", userIds);
            console.log("members", teamData.members);
            throw new ExpressError(400, "Some members not found in the database.");
        }

        // Create new team with member IDs
        const team = new Team({
            course: id,
            teamIndex: teamData.index,
            members: userIds.map(user => user._id),
        });

        const savedTeam = await team.save();
        teamIds.push(savedTeam._id);
    }

    // Update the course with the new team IDs
    await Course.findByIdAndUpdate(id, { $push: { teams: { $each: teamIds } } });

    req.flash("success", "New Team created successfully");
    res.redirect(`/courses/${id}`);
}));

//Edit team
app.get("/teams/:teamId/edit", wrapAsync(async (req, res, next) => {
    let { teamId } = req.params;
    let team = await Team.findById(teamId).populate("course").populate("members");
    // console.log("this is the team", team);
    res.render("./team/editTeam.ejs", { team });
}));

// Update edited team
app.put("/:id/teams/:teamId", isSignedIn, wrapAsync(async (req, res, next) => {
    let { id, teamId } = req.params;
    const data = req.body;

    let memberNames = Array.isArray(data.members) ? data.members.filter(name => name.trim() !== "") : [];
    const userIds = memberNames.length > 0 ? await User.find({ name: { $in: memberNames } }).select("_id") : [];

    if (userIds.length !== data.members.length) {
        throw new ExpressError(400, "Some members not found in the database.");
    }
    const updatedTeam = await Team.findByIdAndUpdate(
        teamId,
        {
            members: userIds.map(user => user._id),
            course: id,
            teamIndex: data.teamIndex,
        },
        { new: true } // Return the updated doc
    );
    if (!updatedTeam) {
        throw new ExpressError(400, "Team not found.");
    }
    await Course.findByIdAndUpdate(id, { $addToSet: { teams: teamId } });

    req.flash("success", "Team updated successfully");
    res.redirect(`/courses/${id}`);
}));

//Delete Team
app.delete("/:id/teams/:teamId", isSignedIn, wrapAsync(async (req, res, next) => {
    let { id, teamId } = req.params;
    let deletedTeam = await Team.findByIdAndDelete(teamId);
    if (!deletedTeam) {
        throw new ExpressError(400, "Team not found.");
    }
    await Course.findByIdAndUpdate(id, { $pull: { teams: teamId } });
    console.log("Deleted Team:", deletedTeam);
    req.flash("success", "Team deleted");
    res.redirect(`/courses/${id}`);
}));

// RUBRICS
//Create form for rubrics
app.get('/rubrics/:id/new', wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
        throw new ExpressError(400, "Course not found.");
    }

    res.render('./rubric/addRubric.ejs', { course });
}));

//Post created rubrics to db
app.post('/rubrics/:id', isSignedIn, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const { scale, criteria, weight, descriptions } = req.body;

    if (!scale || !criteria || !descriptions || criteria.length === 0) {
        throw new ExpressError(400, "Invalid form data.");
    }

    // rubric criteria
    const formattedCriteria = criteria.map((criterion, index) => {
        return {
            name: criterion,
            weight: Number(weight[index]), 
            performances: Array.from({ length: scale }, (_, i) => ({
                level: scale - i, 
                description: descriptions[index * scale + i] || "", 
            })),
        };
    });

    // Save rubric to the database
    const rubric = new Rubric({
        name: `Rubric for Course ${id}`, 
        courseId: id,
        criteria: formattedCriteria,
    });

    await rubric.save();

    req.flash("success", "New Rubric created successfully");
    res.redirect(`/courses/${id}`); 
}));

//Edit form for rubrics
app.get("/rubrics/:rubricId/edit", wrapAsync(async (req, res, next) => {
    let { rubricId } = req.params;
    let rubric = await Rubric.findById(rubricId).populate("courseId");
    console.log("this is the rubric", rubric);
    res.render("./rubric/editRubric.ejs", { rubric });
}));


//Update the rubrics into db
app.put("/rubrics/:rubricId", isSignedIn, wrapAsync(async (req, res, next) => {
    const { rubricId } = req.params;
    const { criteria, weight, description } = req.body;

    let formattedCriteria = criteria.map((name, index) => ({
        name: name,
        weight: Number(weight[index]), 
        performances: [],
    }));

    let scale = description.length / criteria.length; // find scale based on what user inputs

    for (let i = 0; i < criteria.length; i++) {
        for (let j = 0; j < scale; j++) {
            formattedCriteria[i].performances.push({
                level: scale - j, 
                description: description[i * scale + j] || "", 
            });
        }
    }

    const updatedRubric = await Rubric.findByIdAndUpdate(
        rubricId,
        { criteria: formattedCriteria },
        { new: true }
    );

    if (!updatedRubric) {
        throw new ExpressError(400, "Rubric not found.");
    }

    req.flash("success", "Rubric updated successfully");
    res.redirect(`/courses/${updatedRubric.courseId}`);
}));

//Delete Rubric
app.delete("/:id/rubrics/:rubricId", isSignedIn, wrapAsync(async (req, res, next) => {
    let { id, rubricId } = req.params;
    let deletedRubric = await Rubric.findByIdAndDelete(rubricId);
    console.log(deletedRubric);
    req.flash("success", "Rubric deleted");
    res.redirect(`/courses/${id}`);
}));

//EVALUATIONS
//Create Evaluation (display form & save the created evaluation into db)
app.get("/:rubricId/evaluations", wrapAsync(async (req, res, next) => {
    let { rubricId } = req.params;
    let rubric = await Rubric.findById(rubricId).populate({ path: "courseId", populate: { path: "teams", populate: { path: "members" } }, });
    let maxScore = rubric.criteria[0].performances.length;
    let userTeam = rubric.courseId.teams.find(team =>
        team.members.some(member => member._id.toString() === req.user._id.toString())
    );

    if (!userTeam) {
        req.flash("error", "You are not assigned to a team.");
        return res.redirect("/courses");
    }

    // Fetch only evaluations made by currUser
    let existingEvaluations = await Evaluation.find({
        teamId: userTeam._id,
        rubricId: rubricId,
        evaluatorId: req.user._id 
    });
    res.render("./evaluation/evaluation.ejs", { rubric, maxScore, existingEvaluations, userTeam });
}));

app.post("/:teamId/:rubricId/evaluations", isSignedIn, wrapAsync(async (req, res, next) => {
    const { teamId, rubricId } = req.params;
    const { scores, strength, improve, other } = req.body;

    let rubric = await Rubric.findById(rubricId); 
    let evaluations = [];

    for (const memberId in scores) {
        let memberScores = [];
        let totalScore = 0;

        for (const criteriaIndex in scores[memberId]) {
            let scoreValue = parseInt(scores[memberId][criteriaIndex]);
            let criteria = rubric.criteria[criteriaIndex]; // which criteria
            let maxScore = criteria.performances.length; // dynamic 
            let weightage = criteria.weight;
            let percentage = (scoreValue / maxScore) * weightage;

            memberScores.push({
                criteria: criteria.name,
                score: scoreValue
            });

            totalScore += percentage;
        }

        let feedbackData = {
            strength: strength[memberId] || "",
            improve: improve[memberId] || "",
            other: other[memberId] || ""
        };

        evaluations.push({
            evaluatorId: req.user._id,
            evaluateeId: memberId,
            teamId,
            rubricId,
            scores: memberScores,
            feedback: [feedbackData],
            total: totalScore.toFixed(2),
        });
    }

    await Evaluation.insertMany(evaluations);
    res.redirect("/courses");
}));

//Edit Evaluation
app.get("/:rubricId/evaluations/edit", wrapAsync(async (req, res, next) => {
    let { rubricId } = req.params;
    let rubric = await Rubric.findById(rubricId).populate({ path: "courseId", populate: { path: "teams", populate: { path: "members" } }, });
    if (!rubric) {
        req.flash("error", "Rubric not found.");
        return res.redirect("/courses");
    }

    let userTeam = rubric.courseId.teams.find(team =>
        team.members.some(member => member._id.toString() === req.user._id.toString())
    );
    if (!userTeam) {
        req.flash("error", "You are not assigned to a team.");
        return res.redirect("/courses");
    }
    let evaluations = await Evaluation.find({
        teamId: userTeam._id,
        rubricId,
        evaluatorId: req.user._id  // Only get evaluations by the currUser
    }).populate("teamId").populate("rubricId").populate("evaluateeId");

    if (!evaluations || evaluations.length === 0) {
        req.flash("error", "No evaluations found.");
        return res.redirect("/courses");
    }
    res.render("./evaluation/editEvaluation.ejs", { rubric, evaluations, userTeam });
}));

app.put("/evaluations/update", isSignedIn, wrapAsync(async (req, res, next) => {
    const { evalId, scores, strength, improve, other } = req.body;

    if (!evalId) {
        req.flash("error", "No evaluations provided.");
        return res.redirect("/courses");
    }

    for (const memberId in evalId) {
        let evaluation = await Evaluation.findOne({ _id: evalId[memberId], evaluatorId: req.user._id }).populate("rubricId");


        if (!evaluation) continue;

        let updatedScores = [];
        let totalScore = 0;

        evaluation.rubricId.criteria.forEach((criteria, i) => {
            let scoreValue = parseInt(scores[memberId][i]) || 0;
            let maxScore = criteria.performances.length;
            let weightage = criteria.weight;
            let percentage = (scoreValue / maxScore) * weightage;

            updatedScores.push({
                criteria: criteria.name,
                score: scoreValue,
            });

            totalScore += percentage;
        });

        evaluation.scores = updatedScores;
        evaluation.feedback = [
            {
                strength: strength[memberId] || "",
                improve: improve[memberId] || "",
                other: other[memberId] || "",
            },
        ];
        evaluation.total = totalScore.toFixed(2);

        await evaluation.save();
    }
    req.flash("success", "Evaluation updated successfully.");
    res.redirect("/courses");
}));

//Display Evaluation
app.get("/:id/:rubricId/scores", isSignedIn, wrapAsync(async (req, res, next) => {
    let { id, rubricId } = req.params;
    let course = await Course.findById(id).populate("students");
    let rubric = await Rubric.findById(rubricId);
    let evaluations = await Evaluation.find({ rubricId });
    // map tracks the scores and count of evaluations
    let studentScores = {};

    // studentScores initialised using student._id
    course.students.forEach(student => {
        studentScores[student._id] = { totalScore: 0, count: 0 };
    });

    evaluations.forEach(evaluation => {
        let evaluateeId = evaluation.evaluateeId;

        if (studentScores[evaluateeId]) {
            studentScores[evaluateeId].totalScore += evaluation.total;
            studentScores[evaluateeId].count += 1;
        }
    });
    res.render("./evaluation/allScores.ejs", { course, rubric, studentScores });
}));

app.get("/:rubricId/:studentId/viewDetailByEvaluatee", isSignedIn, wrapAsync(async (req, res, next) => {
    let { rubricId, studentId } = req.params;
    let user = await User.findById(studentId);
    let rubric = await Rubric.findById(rubricId);
    let evaluations = await Evaluation.find({ rubricId }).populate("evaluateeId").populate("evaluatorId");

    let evals = evaluations.filter(evaluation => evaluation.evaluateeId._id.toString() === studentId);
    console.log(evals);
    res.render("./evaluation/viewDetailByEvaluatee.ejs", { user, evals, rubric });
}));

//Release Results to students
app.get("/:studentId/:rubricId/results", isSignedIn, wrapAsync(async (req, res, next) => {
    let { studentId, rubricId } = req.params;
    let user = await User.findById(studentId);
    let rubric = await Rubric.findById(rubricId).populate("courseId");
    let evaluations = await Evaluation.find({ rubricId }).populate("evaluateeId");
    console.log("this is", evaluations);
    let evals = evaluations.filter(evaluation => evaluation.evaluateeId._id.toString() === studentId);
    console.log(evals);

    let totalScore = evals.reduce((sum, evaluation) => sum + evaluation.total, 0);
    let avgScore = evals.length > 0 ? (totalScore / evals.length).toFixed(2) : null;

    let grade = "No grade yet";
    if (avgScore !== null) {
        if (avgScore >= 95) grade = "A+";
        else if (avgScore >= 90) grade = "A";
        else if (avgScore >= 85) grade = "A-";
        else if (avgScore >= 80) grade = "B+";
        else if (avgScore >= 75) grade = "B";
        else if (avgScore >= 70) grade = "B-";
        else if (avgScore >= 65) grade = "C+";
        else if (avgScore >= 60) grade = "C";
        else if (avgScore >= 55) grade = "C-";
        else grade = "Fail";
    }
    res.render("./evaluation/studentViewResults.ejs", { user, evals, rubric, avgScore, grade });
}));

app.post("/:rubricId/release-results", async (req, res) => {
    const { courseId, rubricId } = req.params;

    await Rubric.findByIdAndUpdate(rubricId, { releaseResults: true });

    res.json({ success: true }); 
});

app.all("*", (req, res, next) => { //all the routes that do not match the ones coded above like localhost:3000/random will show this err
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(3000, () => {
    console.log("app listening to port 3000");
});