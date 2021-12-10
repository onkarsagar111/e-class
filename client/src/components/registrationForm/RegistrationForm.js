import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import Input from '../ui/input/Input';
import Button from '../ui/button/Button';
import actionType from '../../store/actionType';
import classes from './RegistrationForm.module.css';
import Icon from '../../assets/images/vaccine.svg';
import Approved from '../../assets/images/approved2.svg';
import Decline from '../../assets/images/decline.svg';
import Pending from '../../assets/images/approval.svg';
import Spinner from '../ui/spinner/Spinner';


const RegistrationForm = (props) => {

    let initialState = {
        value: "",
        touched: false,
        valid: true,
    };

    const [vaccinationLink, setvaccinationLink] = useState(initialState);
    const [status, setstatus] = useState(false);
    const [seats, setseats] = useState(0);
    const [loading, setloading] = useState(true);

    const dispatch = useDispatch();
    const username = useSelector(state => state.auth.username);


    useEffect(() => {
        getRequestStatus();
    }, [])


    function getRequestStatus() {
        let obj = {
            classCode: props.classCode,
            username: username
        }
        axios.post('http://localhost:3001/offline/request-status', obj)
            .then(res => {
                setloading(false);
                if (res.data.status === 'SUCCESS') {
                    setstatus(res.data.reqFound);
                    setseats(res.data.availableSeats);
                } else {
                    dispatch({
                        type: actionType.SHOW_ERROR_TOASTER,
                        payload: "Something went wrong! Try again later.",
                    });
                }
            })
            .catch(err => {
                setloading(false);
                dispatch({
                    type: actionType.SHOW_ERROR_TOASTER,
                    payload: "Something went wrong! Try again later.",
                })
            })
    }


    function inputChangedHandler(e) {
        let updatedState = { ...vaccinationLink };
        updatedState.value = e.target.value;
        if (!updatedState.touched) {
            updatedState.touched = true;
        }
        updatedState.valid = e.target.value.trim() === "" ? false : true;
        setvaccinationLink(updatedState);
    }


    function unregister() {
        let obj = {
            username: username,
            classCode: props.classCode,
        }

        axios
            .post("http://localhost:3001/offline/unregister", obj)
            .then((res) => {
                if (res.data.status === "SUCCESS") {
                    dispatch({
                        type: actionType.SHOW_SUCCESS_TOASTER,
                        payload: "You have been unregistered from offline classes.",
                    });
                    setvaccinationLink(initialState);
                    getRequestStatus();
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
    }


    function apply() {
        if (seats === 0) {
            dispatch({
                type: actionType.SHOW_ERROR_TOASTER,
                payload: "Seats not available.",
            });
        } else {

            if (validateForm()) {
                let date = new Date();
                let obj = {
                    username: username,
                    classCode: props.classCode,
                    link: vaccinationLink.value,
                    raisedOn: date.getTime()
                };

                axios
                    .post("http://localhost:3001/offline/request", obj)
                    .then((res) => {
                        if (res.data.status === "SUCCESS") {
                            dispatch({
                                type: actionType.SHOW_SUCCESS_TOASTER,
                                payload: "Request has been sent.",
                            });
                            setvaccinationLink(initialState);
                            getRequestStatus();
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
    }

    function validateForm() {
        let isValid = true;
        if (vaccinationLink.value.trim() === "") {
            let updatedState = { ...vaccinationLink };
            updatedState.valid = false;
            updatedState.touched = true;
            setvaccinationLink(updatedState);
            isValid = false;
        }
        return isValid;
    }




    return (
        <div>
            {loading ? <Spinner /> :
                status === 'pending' ? <div className={classes.Pending}>
                    <img src={Pending} alt="" style={{width: 350}} />
                    <label style={{marginTop: 50}}>Your request for offline lecture has been submitted.</label>
                    <label>You will be notified over your registered e-mail once your teacher approves your request.</label>
                </div> :
                    status === 'registered' ?
                        <div className={classes.Registered}>
                            <img src={Approved} alt='' style={{ width: 300 }} />
                            <label style={{marginTop: 50}}>You've Registered for an offline Lecture.</label>
                            <p style={{fontSize: 20, marginTop: 30}}> If you cannot attend the offline lecture, kindly unregister so that other students can get the seat.</p>
                            <Button clicked={unregister} width="200px" marginTop ="40px">
                                Unregister
                            </Button>
                        </div> :
                        <React.Fragment>
                            <div className={classes.Header}>
                                <label>Register for an offline Lecture</label>
                                <label style={{fontSize: 30, marginTop: 20, color: seats===0? 'red' : 'green' }}>Available seats: {seats}</label>
                            </div>
                            <div className={classes.RegistrationForm}>
                                <div className={classes.Instructions}>
                                    <label style={{ padding: 12, textAlign: "center", fontSize: 26, fontWeight: 600 }}>Steps to get your vaccination status link</label>
                                    <ul>
                                        <li style={{ padding: 12 }}>Go to <a href="https://cdn-api.co-vin.in/api/v3/vaccination/status/knowYourStatus" target="_blank">CoWIN portal</a> and select 'Share Vaccination Status'.</li>
                                        <li style={{ padding: 12 }}>Enter your details and click on 'Get OTP' button.</li>
                                        <li style={{ padding: 12 }}>Enter the recieved OTP and submit.</li>
                                        <li style={{ padding: 12 }}>Click 'Share vaccination status in you social circle'.</li>
                                        <li style={{ padding: 12 }}>Copy the link of your vaccination status evidence.</li>
                                    </ul>
                                </div>
                                <div className={classes.Form}>
                                    <label style={{ marginBottom: 24, fontSize: 26, fontWeight: 600 }}>Enter your vaccination status link</label>
                                    <img src={Icon} alt='' style={{ width: 100, marginTop: 28, marginBottom: 18 }} />
                                    <Input
                                        value={vaccinationLink.value}
                                        type="text"
                                        placeholder="Vaccination Link"
                                        width="500px"
                                        touched={vaccinationLink.touched}
                                        valid={vaccinationLink.valid}
                                        changed={e => inputChangedHandler(e)}
                                        marginTop="18px"
                                        marginBottom="18px"
                                        disabled={seats == 0}
                                    />
                                    <Button clicked={apply} width="200px">
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </React.Fragment>
            }
        </div>
    )
}

export default RegistrationForm;
