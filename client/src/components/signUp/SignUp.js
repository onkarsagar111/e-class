import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import Button from "../ui/button/Button";
import Input from "../ui/input/Input";
import classes from "./SignUp.module.css";
import Backdrop from "../../components/modals/backdrop/Backdrop";
import { encryptPassword } from "../../utility/common";
import actionType from "../../store/actionType";
import { useDispatch } from "react-redux";
import OtpModal from "../modals/otpModal/OtpModal";
import Spinner from "../ui/spinner/Spinner";
import SignUpLogo from '../../assets/images/signUpLogo.svg';
import Otp from '../../assets/images/mail2.svg';



const SignUp = (props) => {
  let initialState = {
    value: "",
    touched: false,
    valid: true,
  };
  const [name, setName] = useState(initialState);
  const [username, setUsername] = useState(initialState);
  const [password, setPassword] = useState(initialState);
  const [email, setEmail] = useState(initialState);
  const [otp, setOtp] = useState(initialState);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [generatedOtp, setgeneratedOtp] = useState("");
  const [loading, setloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const inputRef = useRef(null);
  const otpRef = useRef(null);

  const dispatch = useDispatch();

  let attachedClass = [classes.Wrapper];
  if (props.visible) {
    attachedClass.push(classes.Visible);
  }




  useEffect(() => {
    inputRef.current.focus();
  }, [props.visible])

  useEffect(() => {
    if (otpRef.current)
      otpRef.current.focus();
  }, [showOTPModal])


function validateEmail() {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
      return true;
    }
    return false;
  }


  function generateOtp() {
    if (validateForm()) {
      if(validateEmail()){

        setloading(true);
        axios
          .post("http://localhost:3001/users/get-otp", { email: email.value })
          .then((res) => {
            setloading(false);
            if (res.data.status === "SUCCESS") {
              setgeneratedOtp(res.data.otp);
              setShowOTPModal(true);
            } else {
              dispatch({
                type: actionType.SHOW_ERROR_TOASTER,
                payload: "Something went wrong! Try again later.",
              })
            }
          })
          .catch((err) => {
            setloading(false);
            dispatch({
              type: actionType.SHOW_ERROR_TOASTER,
              payload: "Something went wrong! Try again later.",
            })
          });
      }else{
        dispatch({
          type: actionType.SHOW_ERROR_TOASTER,
          payload: "Enter a valid email",
        })
      }
    }else{
      dispatch({
        type: actionType.SHOW_ERROR_TOASTER,
        payload: "Please enter your details correctly.",
      })
    }
  }

  function signUp() {
    if (validateForm()) {
      let obj = {
        name: name.value,
        username: username.value,
        password: encryptPassword(password.value),
        email: email.value,
        // myClasses: [], enrolledClasses: []
      };

      axios
        .post("http://localhost:3001/users/sign-up", obj)
        .then((res) => {
          if (res.data === "SUCCESS") {
            dispatch({
              type: actionType.SHOW_SUCCESS_TOASTER,
              payload: "Sign up Successful",
            });
            setShowOTPModal(false);
            props.signInInstead();
            setOtp(initialState);
            setName(initialState);
            setUsername(initialState);
            setPassword(initialState);
            setEmail(initialState);
          } else if (res.data === "Account with this username already exist.") {
            dispatch({
              type: actionType.SHOW_INFO_TOASTER,
              payload: res.data,
            });
          } else if (res.data === "Account with this email already exist.") {
            dispatch({
              type: actionType.SHOW_INFO_TOASTER,
              payload: res.data,
            });
          } else {
            dispatch({
              type: actionType.SHOW_ERROR_TOASTER,
              payload: "Something went wrong! Try again later.",
            });
          }
        })
        .catch((err) => {
          dispatch({
            type: actionType.SHOW_ERROR_TOASTER,
            payload: "Something went Wrong! Try again later.",
          });
        });
    } else {
      dispatch({
        type: actionType.SHOW_ERROR_TOASTER,
        payload: "Please fill out the values correctly.",
      });
    }
  }

  function nameChangedHandler(event) {
    validateInput(event.target.value, "name");
  }
  function usernameChangedHandler(event) {
    validateInput(event.target.value, "username");
  }
  function passwordChangedHandler(event) {
    validateInput(event.target.value, "password");
  }
  function emailChangedHandler(event) {
    validateInput(event.target.value, "email");
  }

  function otpChangedHandler(e) {
    let updatedOtp = { ...otp };
    updatedOtp.value = e.target.value;
    if (!updatedOtp.touched) {
      updatedOtp.touched = true;
    }
    updatedOtp.valid = e.target.value.trim() === "" ? false : true;
    setOtp(updatedOtp);
  }

  function validateOtp() {
    let isValid = true;
    if (otp.value.trim() === "") {
      let updatedState = { ...otp };
      updatedState.valid = false;
      updatedState.touched = true;
      setOtp(updatedState);
      isValid = false;
    }
    return isValid;
  }

  function submitOtp() {
    if (validateOtp() && "" + generatedOtp === otp.value.trim()) {
      signUp();
    } else {
      dispatch({
        type: actionType.SHOW_ERROR_TOASTER,
        payload: "Invalid OTP",
      });
    }

  }

  function validateInput(value, field) {
    switch (field) {
      case "name":
        let updatedName = { ...name };
        updatedName.value = value;
        if (!updatedName.touched) {
          updatedName.touched = true;
        }
        updatedName.valid = value.trim() === "" ? false : true;
        setName(updatedName);
        break;

      case "username":
        let updatedUsername = { ...username };
        updatedUsername.value = value;
        if (!updatedUsername.touched) {
          updatedUsername.touched = true;
        }
        updatedUsername.valid = value.trim() === "" ? false : true;
        setUsername(updatedUsername);
        break;

      case "password":
        let updatePassword = { ...password };
        updatePassword.value = value;
        if (!updatePassword.touched) {
          updatePassword.touched = true;
        }
        if (value.trim() === "" || value.trim().length < 6) {
          updatePassword.valid = false;
          value.trim().length < 6 && value.trim() !== ""
            ? setErrorMessage("Password should be at least 6 characters long.")
            : setErrorMessage("Enter a password");
        } else {
          updatePassword.valid = true;
        }

        setPassword(updatePassword);
        break;

      case "email":
        let updatedEmail = { ...email };
        updatedEmail.value = value;
        if (!updatedEmail.touched) {
          updatedEmail.touched = true;
        }
        updatedEmail.valid = value.trim() === "" ? false : true;
        setEmail(updatedEmail);
        break;
    }
  }

  function validateForm() {
    let isValid = true;
    if (name.value.trim() === "") {
      let updatedState = { ...name };
      updatedState.valid = false;
      updatedState.touched = true;
      setName(updatedState);
      isValid = false;
    }
    if (username.value.trim() === "") {
      let updatedState = { ...username };
      updatedState.valid = false;
      updatedState.touched = true;
      setUsername(updatedState);
      isValid = false;
    }
    if (password.value.trim() === "") {
      let updatedState = { ...password };
      updatedState.valid = false;
      updatedState.touched = true;
      setPassword(updatedState);
      setErrorMessage('Enter a password.')
      isValid = false;
    }
    if (password.value.trim().length < 6) {
      let updatedState = { ...password };
      updatedState.valid = false;
      updatedState.touched = true;
      setPassword(updatedState);
      setErrorMessage('Password should be atleast 6 characters long.')
      isValid = false;
    }
    if (email.value.trim() === "") {
      let updatedState = { ...email };
      updatedState.valid = false;
      updatedState.touched = true;
      setEmail(updatedState);
      isValid = false;
    }
    return isValid;
  }

  return (
    <div className={attachedClass.join(" ")}>
      {
        loading ? <Spinner /> : showOTPModal ?
          <React.Fragment>
            <div className={classes.Image}>
              <img src={Otp} alt="" style={{ width: 430 }} />
            </div>
            <div className={classes.Otp}>
              <h2 style={{ marginTop: 30, fontSize: "25px", textAlign: "center" }}>
                OTP has been sent to your registered email. Check your inbox.
              </h2>
              <div className={classes.InputContainer}>
                <Input
                  ref={otpRef}
                  ref={inputRef}
                  value={otp.value}
                  type="text"
                  placeholder="OTP"
                  width="300px"
                  touched={otp.touched}
                  valid={otp.valid}
                  changed={otpChangedHandler}
                  enterEvent={submitOtp}
                />
                {!otp.valid && otp.touched ? <label className={classes.ErrorLabel}>Required!</label> : null}
              </div>
              <div style={{ display: 'flex' }}>
                <Button type='Secondary' clicked={() => setShowOTPModal(false)} marginBottom='30px' width="100px">
                  Cancel
                </Button>
                <Button clicked={submitOtp} marginBottom='30px' width="100px">
                  Submit
                </Button>
              </div>
            </div>
          </React.Fragment>
          :
          <React.Fragment>
            <div className={classes.Image}>
              <img src={SignUpLogo} alt="" style={{ width: 670 }} />
            </div>
            <div className={classes.SignUpModal}>
              <h2 style={{ marginTop: 30 }}>Create new account</h2>
              <div className={classes.InputContainer}>
                <label className={classes.Label}>Full name</label>
                <Input
                  ref={inputRef}
                  value={name.value}
                  type="text"
                  placeholder=""
                  width="300px"
                  touched={name.touched}
                  valid={name.valid}
                  changed={nameChangedHandler}
                />
                {!name.valid && name.touched ? <label className={classes.ErrorLabel}>Enter a Name </label> : null}
              </div>
              <div className={classes.InputContainer}>
                <label className={classes.Label}>Username</label>
                <Input
                  value={username.value}
                  type="text"
                  placeholder=""
                  width="300px"
                  touched={username.touched}
                  valid={username.valid}
                  changed={usernameChangedHandler}
                />
                {!username.valid && username.touched ? (
                  <label className={classes.ErrorLabel}>Enter a Username </label>
                ) : null}
              </div>
              <div className={classes.InputContainer}>
                <label className={classes.Label}>Password</label>
                <Input
                  value={password.value}
                  type="password"
                  placeholder=""
                  width="300px"
                  touched={password.touched}
                  valid={password.valid}
                  changed={passwordChangedHandler}
                />
                {!password.valid && password.touched ? (
                  <label className={classes.ErrorLabel}>{errorMessage}</label>
                ) : null}
              </div>
              <div className={classes.InputContainer}>
                <label className={classes.Label}>E-mail</label>
                <Input
                  value={email.value}
                  type="email"
                  placeholder=""
                  width="300px"
                  touched={email.touched}
                  valid={email.valid}
                  changed={emailChangedHandler}
                  enterEvent={generateOtp}
                />
                {!email.valid && email.touched ? <label className={classes.ErrorLabel}>Enter an Email </label> : null}
              </div>
              <Button clicked={generateOtp} width="200px">
                Sign Up
              </Button>
              <p style={{ marginBottom: 30 }}>
                Already a user?{" "}
                <label className={classes.SignIn} onClick={props.signInInstead}>
                  Sign In
                </label>
              </p>
            </div>
          </React.Fragment>
      }
    </div>

  );
};

export default SignUp;
