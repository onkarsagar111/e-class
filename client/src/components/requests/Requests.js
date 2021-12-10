import React, { useEffect, useState } from 'react';

import classes from './Requests.module.css';
import Button from '../ui/button/Button';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Spinner from '../ui/spinner/Spinner';
import actionType from '../../store/actionType';
import { customSort } from '../../utility/common';
import Pending from '../../assets/images/pending-request.svg';


const Requests = (props) => {

    const [allRequests, setallRequests] = useState([]);
    const [loading, setloading] = useState(true);
    const [availableSeats, setAvailableSeats] = useState(0)
    const dispatch = useDispatch();

    useEffect(() => {
        refreshList();
    }, [])


    function refreshList() {
        let obj = {
            classCode: props.classCode
        }
        setloading(true);
        axios.post('http://localhost:3001/offline', obj)
            .then(res => {
                setloading(false);
                if (res.data.status === 'SUCCESS') {
                    setallRequests(customSort(res.data.requestList, 'raisedOn'));
                    setAvailableSeats(res.data.availableSeats);
                } else {
                    dispatch({
                        type: actionType.SHOW_ERROR_TOASTER,
                        payload: "Something went wrong! Try again later.",
                    })
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


    function verify(link) {
        window.open(link);
    }

    function approve(request) {
        let obj = {
            username: request.username,
            classCode: props.classCode
        }
        setloading(true);
        axios.post('http://localhost:3001/offline/approve', obj)
            .then(res => {
                setloading(false);
                if (res.data.status === 'SUCCESS') {
                    refreshList();
                    dispatch({
                        type: actionType.SHOW_SUCCESS_TOASTER,
                        payload: "Request Approved!",
                    });
                } else {
                    dispatch({
                        type: actionType.SHOW_ERROR_TOASTER,
                        payload: "Something went wrong! Try again later.",
                    })
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

    function decline(request) {
        let obj = {
            username: request.username,
            classCode: props.classCode
        }
        setloading(true);
        axios.post('http://localhost:3001/offline/decline', obj)
            .then(res => {
                setloading(false);
                if (res.data.status === 'SUCCESS') {
                    refreshList();
                    dispatch({
                        type: actionType.SHOW_SUCCESS_TOASTER,
                        payload: "Request Declined!",
                    });
                } else {
                    dispatch({
                        type: actionType.SHOW_ERROR_TOASTER,
                        payload: "Something went wrong! Try again later.",
                    })
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


    function resolveTime(timestamp) {
        let date = new Date(timestamp);
        return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }


    return (
        <div className={classes.Requests}>

            {loading ? <Spinner /> :
                <React.Fragment>
                    <label style={{textAlign: 'right', fontSize: 20, color: availableSeats!==0 ? 'green' : 'red', fontWeight: 600, paddingBottom: 20}}>Available offline seats : {availableSeats}</label>

                    <div className={classes.Header}>
                        <label className={classes.col1}>Username</label>
                        <label className={classes.col2}>Raised On</label>
                        <label className={classes.col3}>Action</label>
                    </div>

                    <div className={classes.List}>
                        {
                            allRequests.length > 0 ? allRequests.map(request => {
                                return <div className={classes.Row} key={request.username}>
                                    <label className={classes.col1}>{request.username}</label>
                                    <label className={classes.col2}>{resolveTime(request.raisedOn)}</label>
                                    <div className={classes.ButtonContainer}>
                                        <Button clicked={e => verify(request.link)} width="110px" height='24px' backgroundColor="#185473" >Verify</Button>
                                        <Button clicked={e => approve(request)} width="110px" height='24px' backgroundColor="#00a651" borderColor="#00a651">Approve</Button>
                                        <Button clicked={e => decline(request)} width="110px" height='24px' backgroundColor="#c00" borderColor="#c00">Decline</Button>
                                    </div>
                                </div>
                            }) : <label className={classes.Label}>
                                <p>No Pending Requests!</p>
                                <img src={Pending} alt="" style={{width: 450}} />
                               </label>
                        }
                    </div>
                </React.Fragment>
            }



        </div>
    )
}

export default Requests;
