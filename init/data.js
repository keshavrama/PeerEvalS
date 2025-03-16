const mongoose = require("mongoose");

const sampleUsers = [
    { name: "Dr. John Tan", email: "johntan@ntu.edu.sg", role: "instructor" },
    { name: "Patrick", email: "patrick@ntu.edu.sg", role: "instructor" },
    { name: "Chin Chee Kai", email: "cck@ntu.edu.sg", role: "instructor" },
    { name: "Patrick Pang", email: "user0001@e.ntu.edu.sg", role: "student" },
    { name: "Nathan Chua", email: "user0002@e.ntu.edu.sg", role: "student" },
    { name: "Olivia Wong", email: "user0003@e.ntu.edu.sg", role: "student" },
    { name: "Patrick Chong", email: "user0004@e.ntu.edu.sg", role: "student" },
    { name: "Charlotte Tan", email: "user0005@e.ntu.edu.sg", role: "student" },
    { name: "Nathan Chong", email: "user0006@e.ntu.edu.sg", role: "student" },
    { name: "Patrick Fong", email: "user0007@e.ntu.edu.sg", role: "student" },
    { name: "Quinn Chong", email: "user0008@e.ntu.edu.sg", role: "student" },
    { name: "Daniel Lee", email: "user0009@e.ntu.edu.sg", role: "student" },
    { name: "Sophia Yeo", email: "user0010@e.ntu.edu.sg", role: "student" },
    { name: "Felix Teo", email: "user0011@e.ntu.edu.sg", role: "student" },
    { name: "Isla Pang", email: "user0012@e.ntu.edu.sg", role: "student" },
    { name: "Adeline Sim", email: "user0013@e.ntu.edu.sg", role: "student" },
    { name: "Patrick Seah", email: "user0014@e.ntu.edu.sg", role: "student" },
    { name: "Grace Sim", email: "user0015@e.ntu.edu.sg", role: "student" },
    { name: "Olivia Chew", email: "user0016@e.ntu.edu.sg", role: "student" },
    { name: "Mia Ng", email: "user0017@e.ntu.edu.sg", role: "student" },
    { name: "Grace Loh", email: "user0018@e.ntu.edu.sg", role: "student" },
    { name: "Adeline Goh", email: "user0019@e.ntu.edu.sg", role: "student" },
    { name: "Kaitlyn Fong", email: "user0020@e.ntu.edu.sg", role: "student" },
    { name: "Nagammai", email: "nagammai001@e.ntu.edu.sg", role: "student" },
];

//module.exports = {data: sampleUsers};

const sampleTeams = [
    {
        course: new mongoose.Types.ObjectId('67c7e7e56f62d97a36c2880c'),
        teamIndex: 1,
        members: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48be'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48bf'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c0'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c1'),
        ]
    },
    {
        course: new mongoose.Types.ObjectId('67c7e7e56f62d97a36c2880c'),
        teamIndex: 2,
        members: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c2'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c3'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c4'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c5'),
        ]
    },
    {
        course: new mongoose.Types.ObjectId('67c7e7e56f62d97a36c2880c'),
        teamIndex: 3,
        members: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c6'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c7'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c8'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c9'),
        ]
    },
    {
        course: new mongoose.Types.ObjectId('67c7e7e56f62d97a36c2880c'),
        teamIndex: 4,
        members: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48ca'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cb'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cc'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cd'),
        ]
    },
    {
        course: new mongoose.Types.ObjectId('67c7e7e56f62d97a36c2880c'),
        teamIndex: 5,
        members: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48ce'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cf'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48d0'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48d1'),
        ]
    },
    {
        course: new mongoose.Types.ObjectId('67c7e7e56f62d97a36c2880d'), //course 2
        teamIndex: 1,
        members: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48bf'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c0'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c1'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c2'),
        ]
    },
    {
        course: new mongoose.Types.ObjectId('67c7e7e56f62d97a36c2880d'), //course 2
        teamIndex: 2,
        members: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c3'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c4'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c5'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c6'),
        ]
    },
    {
        course: new mongoose.Types.ObjectId('67c7e7e56f62d97a36c2880d'), //course 2
        teamIndex: 3,
        members: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c7'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48ca'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cb'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cc'),
        ]
    },
    {
        course: new mongoose.Types.ObjectId('67c7e7e56f62d97a36c2880d'), //course 2
        teamIndex: 4,
        members: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cd'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48d1'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48d2'),
        ]
    },
    {
        course: new mongoose.Types.ObjectId('67c7e7e56f62d97a36c2880e'), //course 3
        teamIndex: 1,
        members: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48bf'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c0'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c1'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c2'),
        ]
    },
    {
        course: new mongoose.Types.ObjectId('67c7e7e56f62d97a36c2880e'), //course 3
        teamIndex: 2,
        members: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c3'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c4'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c5'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c6'),
        ]
    },
    {
        course: new mongoose.Types.ObjectId('67c7e7e56f62d97a36c2880e'), //course 3
        teamIndex: 3,
        members: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c7'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c8'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c9'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48ca'),
        ]
    },
    {
        course: new mongoose.Types.ObjectId('67c7e7e56f62d97a36c2880e'), //course 3
        teamIndex: 4,
        members: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cb'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cc'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cd'),
        ]
    },
]

const sampleCourses = [
    {
        description: "Lean Operations and Analytics AY24/25 SEM-4",
        courseCode: "BC3405",
        courseId: "24S1-BC3405-BC3411-SEM-4",
        instructors: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48bb'),
        ],
        students: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48be'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48bf'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c0'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c1'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c2'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c3'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c4'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c5'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c6'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c7'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c8'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c9'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48ca'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cb'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cc'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cd'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48ce'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cf'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48d0'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48d1'),
        ],
        // teams: [
        //     { teamIndex: 1, members: ["user0001@e.ntu.edu.sg", "user0002@e.ntu.edu.sg", "user0003@e.ntu.edu.sg", "user0004@e.ntu.edu.sg"] },
        //     { teamIndex: 2, members: ["user0005@e.ntu.edu.sg", "user0006@e.ntu.edu.sg", "user0007@e.ntu.edu.sg", "user0008@e.ntu.edu.sg"] },
        //     { teamIndex: 3, members: ["user0009@e.ntu.edu.sg", "user0010@e.ntu.edu.sg", "user0011@e.ntu.edu.sg", "user0012@e.ntu.edu.sg"]},
        //     { teamIndex: 4, members: ["user0013@e.ntu.edu.sg", "user0014@e.ntu.edu.sg", "user0015@e.ntu.edu.sg", "user0016@e.ntu.edu.sg"]},
        //     { teamIndex: 5, members: ["user0017@e.ntu.edu.sg", "user0018@e.ntu.edu.sg", "user0019@e.ntu.edu.sg", "user0020@e.ntu.edu.sg"]}
        // ],
    },
    {
        description: "Strategic Management AY24/25 SEM-8",
        courseCode: "AB3601",
        courseId: "24S1-AB3601-AB3602-SEM-8",
        instructors: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48bc'),
        ],
        students: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48bf'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c0'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c1'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c2'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c3'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c4'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c5'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c6'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c7'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48ca'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cb'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cc'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cd'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48d1'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48d2'),
        ],
        // teams: [
        //     { teamIndex: 1, members: ["user0002@e.ntu.edu.sg", "user0003@e.ntu.edu.sg", "user0004@e.ntu.edu.sg", "user0005@e.ntu.edu.sg"]},
        //     { teamIndex: 2, members: ["user0006@e.ntu.edu.sg", "user0007@e.ntu.edu.sg", "user0008@e.ntu.edu.sg", "user0009@e.ntu.edu.sg"]},
        //     { teamIndex: 3, members: ["user0010@e.ntu.edu.sg", "user0013@e.ntu.edu.sg", "user0014@e.ntu.edu.sg", "user0015@e.ntu.edu.sg"]},
        //     { teamIndex: 4, members: ["user0016@e.ntu.edu.sg", "user0020@e.ntu.edu.sg", "nagammai001@e.ntu.edu.sg"]}
        // ]
    },
    {
        description: "BC3410-FIN SERVICE PRO & ANALYTICS (SEM) 2023/2024 Semester 2-S02",
        courseCode: "BC3410",
        courseId: "23S2-BC3410-SEM-2",
        instructors: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48bd'),
        ],
        students: [
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48bf'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c0'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c1'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c2'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c3'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c4'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c5'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c6'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c7'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c8'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48c9'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48ca'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cb'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cc'),
            new mongoose.Types.ObjectId('67c7dfdf3ee7a9e54f0b48cd'),
        ],
        // teams: [
        //     { teamIndex: 1, members: ["user0002@e.ntu.edu.sg", "user0003@e.ntu.edu.sg", "user0004@e.ntu.edu.sg", "user0005@e.ntu.edu.sg"]},
        //     { teamIndex: 2, members: ["user0006@e.ntu.edu.sg", "user0007@e.ntu.edu.sg", "user0008@e.ntu.edu.sg", "user0009@e.ntu.edu.sg"]},
        //     { teamIndex: 3, members: ["user0010@e.ntu.edu.sg", "user0011@e.ntu.edu.sg", "user0012@e.ntu.edu.sg", "user0013@e.ntu.edu.sg"]},
        //     { teamIndex: 4, members: ["user0014@e.ntu.edu.sg", "user0015@e.ntu.edu.sg", "user0016@e.ntu.edu.sg"]},
        // ]
    },
];


module.exports = {
    courses: sampleCourses,
    users: sampleUsers,
    teams: sampleTeams
};