import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { decryptPassword } from '../../utility/common';
import classes from './SignIn.module.css'
import Input from '../ui/input/Input';
import Button from '../ui/button/Button';
import axios from 'axios';
import actionType from '../../store/actionType';
import SignInLogo from '../../assets/images/signIn.svg';
import fire from '../../firebase/Fire';

const SignIn = (props) => {
    let initialState = {
        value: '',
        isValid: true,
        touched: false
    };
    const [username, setUsername] = useState(initialState);
    const [password, setPassword] = useState(initialState);

    const inputRef = useRef(null);

    const dispatch = useDispatch();

    let attachedClass = [classes.Wrapper];
    if (props.visible) {
        attachedClass.push(classes.Visible);
    }

    useEffect(() => {
        inputRef.current.focus();
    }, [props.visible])


    const usernameChangedHandler = event => {
        validateInput(event.target.value, 'username');
    }

    const passwordChangedHandler = event => {
        validateInput(event.target.value, 'password');
    }

    function signInUser() {

        console.log(username.value);
        let action = {
            type: actionType.SIGN_IN,
            payload: username.value
        }
        dispatch(action)
    }

    function signIn() {


        axios.get('http://localhost:3001/users')
            .then(res => {

                if (res.data.status === 'SUCCESS') {
                    let usersList = res.data.usersList;
                    let usernameFound = false;
                    let passwordCorrect = false;
                    for (let index in usersList) {
                        if (username.value.trim() === usersList[index].username.trim()) {
                            usernameFound = true;
                            if (password.value === decryptPassword(usersList[index].password)) {
                                passwordCorrect = true;
                                signInUser();
                                setUsername(initialState);
                                setPassword(initialState);
                                break;
                            } else {
                                break;
                            }
                        }
                    }
                    if (!usernameFound) {
                        dispatch({
                            type: actionType.SHOW_ERROR_TOASTER,
                            payload: "User does not exist"
                        })
                    } else if (!passwordCorrect) {
                        dispatch({
                            type: actionType.SHOW_ERROR_TOASTER,
                            payload: "Invalid credentials"
                        })
                    }
                } else {
                    dispatch({
                        type: actionType.SHOW_ERROR_TOASTER,
                        payload: "Something went wrong! Try again later."
                    })
                }
            })
            .catch(err => dispatch({
                type: actionType.SHOW_ERROR_TOASTER,
                payload: "Something went wrong! Try again later."
            })
            )
    }

    function validateInput(value, field) {
        switch (field) {
            case 'username':
                let updatedUsername = { ...username };
                if (!updatedUsername.touched) {
                    updatedUsername.touched = true;
                }
                updatedUsername.isValid = value.trim() === '' ? false : true;
                updatedUsername.value = value;
                setUsername(updatedUsername);
                break;

            case 'password':
                let updatedPassword = { ...password };
                if (!updatedPassword.touched) {
                    updatedPassword.touched = true;
                }
                updatedPassword.isValid = value.trim() === '' ? false : true;
                updatedPassword.value = value;
                setPassword(updatedPassword);
                break;

            default: break;
        }
    }

    return (
        <div className={attachedClass.join(' ')}>
            <div className={classes.Image}>
                <img src={SignInLogo} alt="" style={{ width: 570 }} />
            </div>
            <div className={classes.SignInModal}>
                <h2 style={{ marginTop: 30 }}>Sign in to your account</h2>
                <div className={classes.InputContainer}>
                    <label className={classes.Label}>Username</label>
                    <Input ref={inputRef} type="text" value={username.value} placeholder='' changed={usernameChangedHandler} width="300px" touched={username.touched} valid={username.isValid} />
                    {!username.isValid && username.touched ? <label className={classes.ErrorLabel}>This is a required field.</label> : null}
                </div>
                <div className={classes.InputContainer}>
                    <label className={classes.Label}>Password</label>
                    <Input type="password" value={password.value} placeholder='' changed={passwordChangedHandler} width="300px" touched={password.touched} valid={password.isValid} enterEvent={signIn} />
                    {!password.isValid && password.touched ? <label className={classes.ErrorLabel}>This is a required field.</label> : null}
                </div>

                <Button clicked={signIn} width="200px">Sign In</Button>
                <p style={{ marginBottom: 30 }}>New to E-class? <label className={classes.SignUp} onClick={props.signUpInstead}> Sign Up</label></p>

            </div>
        </div>
    )
}

export default SignIn;
