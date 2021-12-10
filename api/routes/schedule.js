var express = require("express");
var router = express.Router();
var axios = require("../axiosFile");
var mailer = require("../utility/send-email");

let transporter = mailer.getTransporter();


// function removeElement(id) {
//     return id!
// }

/* GET users listing. */
router.post("/my-schedules", function (req, res, next) {

    //fetch class list for this particular class code
    axios.get('/classes.json')
        .then(dbRes => {
            let classObj = {};
            let classKey = 0;
            for (let index in dbRes.data) {
                if (dbRes.data[index].classCode === req.body.classCode) {
                    classKey = index;
                    classObj = dbRes.data[index];
                }
            }

            //check if the class obj exists and send schedule list.
            if (classKey !== 0) {
                res.send({
                    status: "SUCCESS",
                    schedules: classObj.schedules || []
                })
            } else {
                res.send({
                    status: "ERROR"
                })
            }
        })

});



router.post("/update-schedules", function (req, res, next) {

    //fetch class list for this particular class code
    axios.get('/classes.json')
        .then(dbRes => {
            let classObj = {};
            let classKey = 0;
            for (let index in dbRes.data) {
                if (dbRes.data[index].classCode === req.body.classCode) {
                    classKey = index;
                    classObj = dbRes.data[index];
                }
            }

            //check if the class obj exists and send schedule list.
            if (classKey !== 0) {

                let schedulesList = classObj.schedules || [];
                let body = '';
                let subject = '';

                switch (req.body.action) {
                    case 'ADD':
                        let idList = schedulesList.map(item => item.id);
                        let intMax = schedulesList.length > 0 ? Math.max(...idList) : 0;
                        schedulesList.push({ ...req.body.schedule, id: intMax + 1 });
                        subject = `New Lecture Scheduled!`;
                        body = `
    Hello,

    A new lecture has been scheduled for class ${classObj.classname}.
    Check your class for details.
    
    Regards,
    Team E-Class`

                        break;

                    case 'UPDATE':
                        schedulesList = schedulesList.map((schedule) => {
                            let item = req.body.schedule[schedule.id]
                                ? { ...schedule, ...req.body.schedule[schedule.id] }
                                : schedule;
                            return item;
                        }
                        );
                        subject = `Lecture schedule updated!`;
                        body = `
    Hello,

    Lecture schedule has been updated for class ${classObj.classname}.
    Check your class for details.
    
    Regards,
    Team E-Class`

                        break;

                    case 'DELETE':
                        schedulesList = schedulesList.filter(schedule => schedule.id !== req.body.schedule);
                        subject = `Lecture cancelled!`;
                        body = `
    Hello,

    A Scheduled lecture has been cancelled for class ${classObj.classname}.
    Check your class for details.
    
    Regards,
    Team E-Class`

                        break;

                    default: break;
                }

                // update the list of schedules in firebase.
                axios.put(`/classes/${classKey}/schedules.json`, schedulesList)
                    .then(dbRes => {

                        let emailList = classObj.students.map(item => item.email);
                        // let recipientsList = classObj.students.map(item => item.name);
                        let recipientsEmail = emailList.join(', ');
                        let mailOptions = mailer.configureMailOptionsForScheduler(recipientsEmail, body, subject);
                        mailer.scheduleMail(mailOptions, transporter, { res: res });

                        res.send({
                            status: 'SUCCESS',
                            schedules: schedulesList
                        });
                    })
                    .catch(err => res.send({
                        status: "ERROR"
                    }))


            } else {
                res.send({
                    status: "ERROR"
                })
            }
        })

})

module.exports = router