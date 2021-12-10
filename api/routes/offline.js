var express = require("express");
var axios = require("../axiosFile");
var router = express.Router();
var mailer = require("../utility/send-email");

let transporter = mailer.getTransporter();


// fetch request list
router.post('/', function (req, res, next) {

    // Fetching class list from firebase
    axios.get('/classes.json')
        .then(dbRes => {

            // Fetching class list from firebase
            let classObj = {};
            let classList = dbRes.data;

            // checking class object with passed class code from frontend
            for (let key in classList) {
                if (req.body.classCode.trim() === classList[key].classCode) {
                    classObj = classList[key];
                    break;
                }
            }

            let requestList = classObj.request || [];
            res.send({
                status: 'SUCCESS',
                requestList: requestList,
                availableSeats: classObj.availableSeats
            })
        })
        .catch(err => res.send({
            status: "ERROR"
        }))

});


// fetch request status
router.post('/request-status', function (req, res, next) {

    // Fetching class list from firebase
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

            let requestList = classObj.request || [];
            let reqFound = false;
            for (let index in requestList) {
                if (requestList[index].username === req.body.username) {
                    reqFound = 'pending';
                    break;
                }
            }

            if (reqFound === 'pending') {
                res.send({
                    status: 'SUCCESS',
                    reqFound: reqFound,
                    availableSeats: classObj.availableSeats
                })
            } else {
                let offlineStudentsList = classObj.offlineStudents || [];
                for (let index in offlineStudentsList) {
                    if (offlineStudentsList[index].username === req.body.username) {
                        reqFound = 'registered';
                        break;
                    }
                }
                res.send({
                    status: 'SUCCESS',
                    reqFound: reqFound,
                    availableSeats: classObj.availableSeats
                })
            }
        })
        .catch(err => res.send({
            status: "ERROR"
        }))

});



// request for offline session
router.post('/request', function (req, res, next) {

    // Fetching class list from firebase
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

            let obj = {
                username: req.body.username,
                link: req.body.link,
                raisedOn: req.body.raisedOn
            }

            let requestList = classObj.request || [];
            // if(reques)
            requestList.push(obj);
            axios.put(`/classes/${classKey}/request.json`, requestList)
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


// Approve offline class request
router.post('/approve', function (req, res, next) {
    // Fetching class list from firebase
    axios.get('/classes.json')
        .then(dbRes => {

            // Fetching class list from firebase
            let classObj = {};
            let classKey = 0;
            let subject = '';
            let body = '';
            let classList = dbRes.data;

            // checking class object with passed class code from frontend
            for (let key in classList) {
                if (req.body.classCode.trim() === classList[key].classCode) {
                    classObj = classList[key];
                    classKey = key;
                    break;
                }
            }

            if (classObj.availableSeats > 0) {
                let requestList = classObj.request.filter(request => request.username !== req.body.username);
                let availableSeats = classObj.availableSeats - 1;

                let studentObj = classObj.students.filter(item => item.username === req.body.username);
                let offlineStudents = classObj.offlineStudents || [];
                offlineStudents.push(studentObj[0]);

                classObj.request = requestList;
                classObj.offlineStudents = offlineStudents;
                classObj.availableSeats = availableSeats;

                subject = `Request Approved!`;
                body = `
    Hello ${studentObj[0].name},

    Your request for attending an offine lecture for class
    ${classObj.classname} has been approved by your teacher as you're fully
    vaccinated.
    You can now attend the scheduled lectures of this class 
    in-preson.

    
    Regards,
    Team E-Class`

                axios.put(`/classes/${classKey}.json`, classObj)
                    .then(dbRes => {
                        let mailOptions = mailer.configureMailOptionsForOfflineLectures(studentObj[0].email, body, subject);
                        mailer.requestEvent(mailOptions, transporter, { res: res })

                        res.send({
                            status: 'SUCCESS'
                        })

                    })
                    .catch(err => res.send({
                        status: "ERROR"
                    }))
            } else {

                res.send({
                    status: "Seats Full",
                })
            }

        })
        .catch(err => res.send({
            status: "ERROR"
        }))
})



// Decline offline class request
router.post('/decline', function (req, res, next) {
    // Fetching class list from firebase
    axios.get('/classes.json')
        .then(dbRes => {

            // Fetching class list from firebase
            let classObj = {};
            let classKey = 0;
            let classList = dbRes.data;

            // checking class object with passed class code from frontend
            for (let key in classList) {
                if (req.body.classCode.trim() === classList[key].classCode) {
                    classObj = classList[key];
                    classKey = key;
                    break;
                }
            }

            let requestList = classObj.request.filter(request => request.username !== req.body.username);
            let studentObj = [];
            for (let index in classObj.students) {
                if (classObj.students[index].username === req.body.username) {
                    studentObj = classObj.students[index];
                }
            }
            // let studentObj = classObj.students.filter(item => item.username === req.body.username);

            let subject = `Request Declined!`;
            let body = `
    Hello ${studentObj.username},

    Your request for attending an offine lecture for class 
    ${classObj.classname} has been declined by your teacher as you're not 
    fully vaccinated.
    You can request for an offline lecture after you get fully
    vaccinated.

    
    Regards,
    Team E-Class`

            axios.put(`/classes/${classKey}/request.json`, requestList)
                .then(dbRes => {
                    let mailOptions = mailer.configureMailOptionsForOfflineLectures(studentObj.email, body, subject);
                    mailer.requestEvent(mailOptions, transporter, { res: res })
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




// Unregister from offline lectures
router.post('/unregister', function (req, res, next) {
    // Fetching class list from firebase
    axios.get('/classes.json')
        .then(dbRes => {

            // Fetching class list from firebase
            let classObj = {};
            let classKey = 0;
            let subject = '';
            let body = '';
            let classList = dbRes.data;

            // checking class object with passed class code from frontend
            for (let key in classList) {
                if (req.body.classCode.trim() === classList[key].classCode) {
                    classObj = classList[key];
                    classKey = key;
                    break;
                }
            }

            if (classObj.availableSeats > 0) {
                let availableSeats = classObj.availableSeats + 1;

                let recipientsList = classObj.students.map(item => req.body.username !== item.username ? item.email : '');

                let offlineStudents = classObj.offlineStudents.filter(item => item.username !== req.body.username);

                classObj.offlineStudents = offlineStudents;
                classObj.availableSeats = availableSeats;

                subject = `Offline seat available for ${classObj.classname}!`;
                body = `
    Hello,

    Seats are now available for offline lecture registration for
    class ${classObj.classname}. 
    You can now register to attend the scheduled lectures of 
    this class in-preson.

    If registered already, kindly ignore this mail.

    
    Regards,
    Team E-Class`

                axios.put(`/classes/${classKey}.json`, classObj)
                    .then(dbRes => {
                        let mailOptions = mailer.configureMailOptionsForOfflineLectures(recipientsList.join(','), body, subject);
                        mailer.requestEvent(mailOptions, transporter, { res: res })

                        res.send({
                            status: 'SUCCESS'
                        })

                    })
                    .catch(err => res.send({
                        status: "ERROR"
                    }))
            } else {

                res.send({
                    status: "Seats Full",
                })
            }

        })
        .catch(err => res.send({
            status: "ERROR"
        }))
})



module.exports = router;