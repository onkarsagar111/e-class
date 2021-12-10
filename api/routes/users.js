var express = require("express");
var axios = require("../axiosFile");
var router = express.Router();
var codeGenerator = require("../utility/utility");
var mailer = require("../utility/send-email");

let transporter = mailer.getTransporter();

/* GET users listing. */
router.get("/", function (req, res, next) {
  axios.get("/users.json").then((dbRes) => {
    res.send({
      status: "SUCCESS",
      usersList: dbRes.data
    });
  });
});

/* generate OTP */
router.post("/get-otp", function (req, res, next) {
  let otp = codeGenerator();
  let mailOptions = mailer.configureMailOptionsForSignup(req.body.email, otp);
  mailer.mailEvent(mailOptions, transporter, { res: res, otp: otp });
});

// Sign up user
router.post("/sign-up", function (req, res, next) {
  let usersList = [];
  let reqObj = req.body;
  axios.get("/users.json").then((dbRes) => {
    usersList = dbRes.data ? Object.values(dbRes.data) : [];

    //checking for existing user
    let userValid = true;
    for (let index in usersList) {
      if (usersList[index].username.toLowerCase().trim() === reqObj.username.toLowerCase().trim()) {
        userValid = false;
        res.send("Account with this username already exist.");
        break;
      } else if (usersList[index].email.toLowerCase().trim() === reqObj.email.toLowerCase().trim()) {
        userValid = false;
        res.send("Account with this email already exist.");
        break;
      }
    }
    if (userValid) {
      axios
        .post("/users.json", reqObj)
        .then((dbRes) => {
          res.send("SUCCESS");
        })
        .catch((err) => {
          res.send("ERROR");
        });
    }
  });
});

module.exports = router;
