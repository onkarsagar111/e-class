import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import classes from './JoinClass.module.css';
import Input from "../../ui/input/Input";
import Button from "../../ui/button/Button";
import { useSelector } from 'react-redux';
import axios from 'axios';
import actionType from '../../../store/actionType';


const JoinClass = (props) => {

    let initialState = {
        value: "",
        valid: true,
        touched: false,
    };
    const [classCode, setClassCode] = useState(initialState);
    const username = useSelector(state => state.auth.username)
    const dispatch = useDispatch();
    
    function inputChangedHandler(e) {
        validateInput(e.target.value);
    }

    function validateInput(value) {
        let updatedClassCode = { ...classCode };
        updatedClassCode.value = value;
        if (!updatedClassCode.touched) {
            updatedClassCode.touched = true;
        }
        updatedClassCode.valid = updatedClassCode.value.trim() === "" ? false : true;
        setClassCode(updatedClassCode);
    }

    function close() {
        setClassCode(initialState);
        props.closeModal();
    }

    function joinClass() {
        let obj = {
            classCode: classCode.value,
            username: username
        }

        axios.post('http://localhost:3001/classes/join', obj)
        .then(res => {
            if(res.data.status==="SUCCESS"){
                dispatch({
                    type: actionType.SHOW_SUCCESS_TOASTER,
                    payload: "Enrolled Successfully!"
                })
                props.fetchClasses();
                close();

            } else if(res.data.status==='Already enrolled to this Class'){
                dispatch({
                    type: actionType.SHOW_INFO_TOASTER,
                    payload: res.data.status
                })
            } else if(res.data.status==="Invalid class code"){
                dispatch({
                    type: actionType.SHOW_ERROR_TOASTER,
                    payload: res.data.status
                })
            } else if(res.data.status==="You cannot join a Class created by you"){
                dispatch({
                    type: actionType.SHOW_INFO_TOASTER,
                    payload: res.data.status
                })
            } else {
                dispatch({
                    type: actionType.SHOW_ERROR_TOASTER,
                    payload:"Something went wrong! Try again later."
                })
            }
        })
        .catch( err => dispatch({
                type: actionType.SHOW_ERROR_TOASTER,
                payload:"Something went wrong! Try again later."
            })
        )

    }



    return (
        <div className={classes.JoinClass} onClick={(event) => event.stopPropagation()}>
            <h2 style={{ marginTop: 30 }}>Join a Class</h2>
            <div className={classes.InputContainer}>
                <p style={{ fontSize: 16, fontWeight: 'normal' }} className={classes.Label}>Ask your teacher for the class code, then enter it here.</p>

                <Input
                    value={classCode.value}
                    type="text"
                    placeholder="Class Code"
                    width="300px"
                    touched={classCode.touched}
                    valid={classCode.valid}
                    changed={inputChangedHandler}
                />
                {!classCode.valid && classCode.touched ? <label className={classes.ErrorLabel}>Required Field</label> : null}
            </div>
            <ul style={{ width: 350, marginTop: 40, marginBottom: 40 }}>
                <label style={{ fontSize: 17, fontWeight: 600 }}>To sign in with a class code</label>
                <li>Use an authorised account</li>
                <li>Use a class code staring with 'CL-' followed by a 6-digit code. for eg: 'CL-123456'.</li>
            </ul>
            <div className={classes.ButtonContainer}>
                <Button clicked={close} width="100px" marginBottom='28px' type='Secondary'>
                    Cancel
                </Button>
                <Button clicked={joinClass} width="100px" marginBottom='28px'>
                    Join
                </Button>
            </div>
        </div>
    )
}

export default JoinClass;