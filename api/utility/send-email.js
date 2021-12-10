var nodemailer = require('nodemailer');


function getTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'e.class.app2021@gmail.com',
            pass: 'eclass2021'
        }
    });
}

function configureMailOptionsForSignup(to, otp) {
    return {
        from: 'e.class.app2021@gmail.com',
        to: to,
        subject: 'Welcome to E-class!',
        text: `
        Hi,
        E-Class welcomes you! Get ready to learn. 
        Just one more step. Enter this OTP ${otp} and verify 
        yourself and you're good to go.
            
        Regards,
        Team E-Class`

    };
}

function configureMailOptionsForScheduler(to, body, subject) {
    return {
        from: 'e.class.app2021@gmail.com',
        to: to,
        subject: subject,
        text: body

    };
}

function configureMailOptionsForOfflineLectures(to, body, subject) {
    return {
        from: 'e.class.app2021@gmail.com',
        to: to,
        subject: subject,
        text: body

    };
}



async function mailEvent(mailOptions, transporter, payload) {
    let info = await transporter.sendMail(mailOptions);
    payload.res.send({
        status: "SUCCESS",
        otp: payload.otp
    })
}
async function scheduleMail(mailOptions, transporter, payload) {
    let info = await transporter.sendMail(mailOptions);
    payload.res.send({
        status: "SUCCESS",
    })
}

async function requestEvent(mailOptions, transporter, payload) {
    let info = await transporter.sendMail(mailOptions);
    payload.res.send({
        status: "SUCCESS",
    })
}

module.exports = {
    getTransporter,
    configureMailOptionsForScheduler,
    configureMailOptionsForSignup,
    mailEvent,
    scheduleMail,
    configureMailOptionsForOfflineLectures,
    requestEvent
}

