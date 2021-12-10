var express = require('express');
var router = express.Router();
var axios = require('../axiosFile');
var codeGenerator = require('../utility/utility');


const colors = ["#00FFFF", "#7FFFD4", "#0000FF", "#8A2BE2", "#A52A2A", "#5F9EA0", "#7FFF00", "#D2691E", "#FF7F50", "#6495ED", "#DC143C", "#00008B", "#00FFFF", "#008B8B", "#006400", "#8B008B", "#9932CC", "#FF8C00", "#483D8B", "#FF1493", "#00BFFF", "#1E90FF", "#228B22", "#FFD700"];



router.post('/create', function (req, res, next) {


    //fetch user list to get user key to update myClasses
    axios.get('/users.json')
        .then(usersListRes => {

            let userObj = {};
            let userKey = 0;

            for (let key in usersListRes.data) {
                let data = usersListRes.data[key];
                if (req.body.username.trim() === data.username) {
                    userObj = data;
                    userKey = key;
                    break;
                }
            }

            let myClassList = userObj.myClasses || [];

            let code = 'CL-' + codeGenerator();
            let obj = {
                classname: req.body.classname,
                section: req.body.section,
                subject: req.body.subject,
                room_no: req.body.room_no,
                classCode: code,
                teacher: {
                    username: userObj.username,
                    name: userObj.name,
                    email: userObj.email,
                    color: colors[Math.floor(Math.random() * colors.length)]
                },
                availableSeats: req.body.availableSeats
            }

            // create class
            axios.post('/classes.json', obj)
                .then(dbRes => {

                    let classKey = dbRes.data.name;
                    myClassList.push(classKey);

                    // add res.data key in user object as my classes and enrolled classes
                    axios.put(`/users/${userKey}/myClasses.json`, myClassList)
                        .then(dbRes2 => {
                            res.send({
                                status: "SUCCESS",
                                classCode: code
                            })
                        })
                        .catch(err => res.send({
                            status: "ERROR"
                        }))
                })
                .catch(err => res.send({
                    status: "ERROR"
                }))

        })
        .catch(err => res.send({
            status: "ERROR"
        }))
})



// join Class
router.post('/join', function (req, res, next) {

    axios.get('/classes.json')
        .then(dbRes => {

            // Fetching class list from firebase

            let classKey = 0;
            let classObj = {};
            let classList = dbRes.data;

            // checking class object with passed class code from frontend
            for (let key in classList) {
                if (req.body.classCode.trim() === classList[key].classCode) {
                    classObj = classList[key];
                    classKey = key;
                    break;
                }
            }

            //checking for class code validity
            if (classKey === 0) {
                res.send({
                    status: 'Invalid class code'
                })
            } else {

                //class key has been extracted for applied class code
                //fetch user list to get user key of signed in user and to push class key into its enrolledClasses
                axios.get('/users.json')
                    .then(usersListRes => {
                        let userObj = {};
                        let userKey = 0;

                        // fetching user key of signed in user
                        for (let key in usersListRes.data) {
                            let data = usersListRes.data[key];
                            if (req.body.username.trim() === data.username) {
                                userObj = data;
                                userKey = key;
                                break;
                            }
                        }

                        let enrolledClassList = userObj.enrolledClasses || [];
                        let myClassList = userObj.myClasses || [];

                        //check if already enrolled for this class
                        if (enrolledClassList.indexOf(classKey) === -1) {
                            if (myClassList.indexOf(classKey) === -1) {
                                enrolledClassList.push(classKey);
                                // add class key in user object's enrolled classes
                                axios.put(`/users/${userKey}/enrolledClasses.json`, enrolledClassList)
                                    .then(dbRes2 => {

                                        let studentsList = classObj.students || [];
                                        studentsList.push({
                                            name: userObj.name, email: userObj.email, username: userObj.username, color: colors[Math.floor(Math.random() * colors.length)]
                                        });

                                        axios.put(`/classes/${classKey}/students.json`, studentsList)
                                            .then(dbRes3 => {
                                                res.send({
                                                    status: "SUCCESS"
                                                })
                                            })
                                            .catch(err => res.send({
                                                status: "ERROR"
                                            }))
                                    })
                                    .catch(err => res.send({
                                        status: "ERROR"
                                    }))
                            } else {
                                res.send({
                                    status: 'You cannot join a Class created by you'
                                })
                            }
                        } else {
                            res.send({
                                status: 'Already enrolled to this Class'
                            })
                        }
                    })
                    .catch(err => res.send({
                        status: "ERROR"
                    }))
            }
        })
        .catch(err => res.send({
            status: "ERROR"
        }))
})

// ClassCards

router.post('/', function (req, res, next) {

    axios.get('/users.json')
        .then(usersListRes => {
            let userObj = {};
            let userKey = 0;

            // fetching user key of signed in user
            for (let key in usersListRes.data) {
                if (req.body.username.trim() === usersListRes.data[key].username) {
                    userObj = usersListRes.data[key];
                    userKey = key;
                    break;
                }
            }

            let enrolledClassList = userObj.enrolledClasses || [];
            let myClassList = userObj.myClasses || [];

            axios.get('/classes.json')
                .then(classListRes => {
                    let enrolledClassesData = enrolledClassList.map(classKey => classListRes.data[classKey])
                    let myClassesData = myClassList.map(classKey => classListRes.data[classKey])

                    res.send({
                        status: "SUCCESS",
                        enrolledClassesData: enrolledClassesData,
                        myClassesData: myClassesData
                    })
                })
                .catch(err => res.send({
                    status: "ERROR"
                }))
        })
        .catch(err => res.send({
            status: "ERROR"
        }))
})

// Class post Messages

router.post('/post-msg', function (req, res, next) {

    axios.get('/classes.json')
        .then(dbRes => {

            // Fetching class list from firebase

            let classKey = 0;
            let classObj = {};
            let classList = dbRes.data;

            // checking class object with passed class code from frontend
            for (let key in classList) {
                if (req.body.classCode.trim() === classList[key].classCode) {
                    classObj = classList[key];
                    classKey = key;
                    break;
                }
            }

            let userColor = "#000000";
            // fetching color code of the user
            if (req.body.username === classObj.teacher.username) {
                userColor = classObj.teacher.color;
            } else {

                for (let key in classObj.students) {
                    if (req.body.username.trim() === classObj.students[key].username) {
                        userColor = classObj.students[key].color;
                        break;
                    }
                }
            }


            let obj = {
                msg: req.body.msg,
                username: req.body.username,
                color: userColor
            }
            let discussionList = classObj.discussion || [];
            discussionList.push(obj);
            axios.put(`/classes/${classKey}/discussion.json`, discussionList)
                .then(dbRes => {
                    res.send({
                        status: "SUCCESS",
                    })
                })
                .catch(err => res.send({
                    status: "ERROR"
                }))
        })
        .catch(err => res.send({
            status: "ERROR"
        }))
})


// for fetching discussion
router.post('/discussions', function (req, res, next) {

    // Fetching class list from firebase
    axios.get('/classes.json')
        .then(dbRes => {

            let classObj = {};

            // checking class object with passed class code from frontend
            for (let key in dbRes.data) {
                if (req.body.classCode.trim() === dbRes.data[key].classCode) {
                    classObj = dbRes.data[key];
                    break;
                }
            }
            res.send({
                status: "SUCCESS",
                discussion: classObj.discussion || []
            })
        })
        .catch(err => res.send({
            status: "ERROR"
        }))
})

// For fethcing students and teacher of class
router.post('/people', function (req, res, next) {

    // Fetching class list from firebase
    axios.get('/classes.json')
        .then(dbRes => {

            let classObj = {};

            // checking class object with passed class code from frontend
            for (let key in dbRes.data) {
                if (req.body.classCode.trim() === dbRes.data[key].classCode) {
                    classObj = dbRes.data[key];
                    break;
                }
            }
            res.send({
                status: "SUCCESS",
                students: classObj.students || [],
                teacher:  classObj.teacher

            })
        })
        .catch(err => res.send({
            status: "ERROR"
        }))
})




module.exports = router;