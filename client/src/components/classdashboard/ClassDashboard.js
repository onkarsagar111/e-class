import React, { useEffect, useState } from 'react'
import classes from './ClassDashboard.module.css';
import Button from '../ui/button/Button';
import Input from '../ui/input/Input';
import Meet from '../../assets/images/meet.png';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import actionType from '../../store/actionType';
import Head from '../../assets/images/head.svg';
import copy from '../../assets/images/copy.svg';


const ClassDashboard = (props) => {

    const [msg, setmsg] = useState("");
    const [discussions, setdiscussions] = useState([]);
    const [copied, setCopied] = useState(false);
    const username = useSelector(state => state.auth.username)
    const dispatch = useDispatch();

    useEffect(() => {
        refreshDiscussion();
    }, [])

    function joinMeet(event) {
        window.open('https://apps.google.com/meet/');
    }
    function copyCode() {
        navigator.clipboard.writeText(props.classObj.classCode);
        setCopied(true);
    }

    function refreshDiscussion() {

        axios.post("http://localhost:3001/classes/discussions", { classCode: props.classObj.classCode })
            .then((res) => {
                if (res.data.status === 'SUCCESS') {
                    setdiscussions(res.data.discussion);
                } else {
                    dispatch({
                        type: actionType.SHOW_ERROR_TOASTER,
                        payload: "Something went wrong! Try again later.",
                    });
                }
            })
            .catch((err) => dispatch({
                type: actionType.SHOW_ERROR_TOASTER,
                payload: "Something went wrong! Try again later.",
            }))
    }

    function postMsg() {
        if (msg === '') {
            return
        } else {
            let obj = {
                msg: msg,
                classCode: props.classObj.classCode,
                username: username
            }

            //axios call for posting query and announcement
            axios.post("http://localhost:3001/classes/post-msg", obj)
                .then((res) => {
                    setmsg('');
                    if (res.data.status === "SUCCESS") {
                        refreshDiscussion();
                    } else {
                        dispatch({
                            type: actionType.SHOW_ERROR_TOASTER,
                            payload: "Something went wrong! Try again later.",
                        });
                    }
                })
                .catch((err) => {
                    setmsg('');
                    dispatch({
                        type: actionType.SHOW_ERROR_TOASTER,
                        payload: "Something went wrong! Try again later.",
                    });
                })

        }
    }


    return (
        <div className={classes.ClassDashboard}>

            <div style={{ backgroundImage: `url(${Head})` }} className={classes.Header}>
                <label style={{ fontSize: 50, fontWeight: 600, marginTop: 8 }}>{props.classObj.subject}</label>
                <label style={{ fontSize: 40, fontWeight: 600, marginTop: 8 }}>{props.classObj.classname}</label>
                <label style={{ fontSize: 18, fontWeight: 400, marginTop: 8 }}>Section : {props.classObj.section}</label>
                <label style={{ fontSize: 18, fontWeight: 400, marginTop: 8 }}>Room No. : {props.classObj.room_no}</label>
            </div>

            <div className={classes.Content}>
                <div className={classes.SideView}>
                    <div className={classes.ClassCode}>
                        <label style={{ fontSize: 18, fontWeight: 600 }}> Class code</label>
                        <label style={{ marginTop: 8, display: "flex", justifyContent: "space-between", cursor: 'pointer' }}>
                            <label style={{fontSize: 24}}> {props.classObj.classCode} </label> 
                            <img style={{}} src={copy} alt='copy' onClick ={copyCode}/>
                        </label>
        {copied ? <label style={{color: 'green', marginTop: 10, fontWeight: 600}}>Copied</label> : null}
                    </div>
                    <div className={classes.Meet}>
                        <label style={{
                            fontSize: 18, fontWeight: 600, display: "flex", justifyContent: "flex-start", alignItems: "center"
                        }}><img src={Meet} alt='meet' style={{ width: 30 }} />
                            <label style={{ marginLeft: 8 }}>Lecture link</label></label>
                        <Button clicked={e => joinMeet(e)} width="110px" marginBottom='0px'>Meet</Button>
                    </div>
                    {/* <div className={classes.Meet}>
                        <label style={{ fontSize: 18, fontWeight: 600 }}>Register for offline lectures</label>
                        <Button clicked={e => joinMeet(e)} width="110px" marginBottom='0px'>Register</Button>

                    </div> */}
                </div>
                <div className={classes.Stream}>
                    <div className={classes.Editor}>
                        <Input
                            value={msg}
                            type="textarea"
                            placeholder={props.type === 'Teacher' ? "Make an Announcement" : 'Got something to ask or say? Write here...'}
                            rows='5'
                            columns='100'
                            changed={e => setmsg(e.target.value)}
                            marginLeft='0'
                            marginRight='0'
                            marginTop='0'
                            marginBottom='0'
                        />
                        <div className={classes.ButtonContainer}>
                            <Button clicked={postMsg} width="110px" marginTop='0px'>Post</Button>
                            <Button clicked={e => setmsg('')} type='Secondary' width="110px" marginBottom='0px'>Clear</Button>
                        </div>
                    </div>
                    <div className={classes.Chat}>
                        {discussions.map(discussion => {
                            return <div className={classes.Discussion} key={Math.floor(10000000 + Math.random() * 90000000)}>
                                <label style={{ fontWeight: "bold", color: discussion.color}}>{discussion.username}: </label>
                                <label style={{}}>{discussion.msg}</label>
                            </div>
                        })}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ClassDashboard