import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import classes from './Sidebar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import actionType from '../../store/actionType';
import Logo from '../../assets/images/logo1.svg';
import AddIcon from '../../assets/images/add.svg';
import Options from '../ui/options/Options';
import CreateClass from '../modals/createClassModal/CreateClass';
import JoinClass from '../modals/joinClassModal/JoinClass';
import Backdrop from '../modals/backdrop/Backdrop';
import UserIcon from '../../assets/images/userIcon.svg';
import axios from 'axios';

function Sidebar(props) {

    const dispatch = useDispatch();
    const username = useSelector(state => state.auth.username);
    const [showAddOptions, setShowAddOptions] = useState(false);
    const [showProfileOptions, setshowProfileOptions] = useState(false);

    const [showCreateClassModal, setShowCreateClassModal] = useState(false);
    const [showJoinClassModal, setShowJoinClassModal] = useState(false);

    let navigate = useNavigate();

    function openCreateModal() {
        setShowCreateClassModal(true);
    }

    function openJoinModal() {
        setShowJoinClassModal(true);
    }
    function closeCreateModal() {
        setShowCreateClassModal(false);
    }

    function closeJoinModal() {
        setShowJoinClassModal(false);
    }

    function signOut() {
        let action = {
            type: actionType.SIGN_OUT
        }
        dispatch(action);
        dispatch({
            type: actionType.SET_CLASSES,
            payload: {
                enrolledClasses: [],
                myClasses: [],
                loading: true
            }
        })
        navigate("/");
    }

    function fetchClasses() {
        axios.post('http://localhost:3001/classes', { username: username })
            .then(res => {
                if (res.data.status === "SUCCESS") {
                    dispatch({
                        type: actionType.SET_CLASSES,
                        payload: {
                            enrolledClasses: res.data.enrolledClassesData,
                            myClasses: res.data.myClassesData,
                            loading: false
                        }
                    })
                } else {
                    dispatch({
                        type: actionType.SHOW_ERROR_TOASTER,
                        payload: "Something went Wrong! Try again later."
                    })
                }
            })
            .catch(err => {
                dispatch({
                    type: actionType.SET_CLASSES,
                    payload: {
                        enrolledClasses: [],
                        myClasses: [],
                        loading: false
                    }
                })
                dispatch({
                    type: actionType.SHOW_ERROR_TOASTER,
                    payload: "Something went Wrong! Try again later."
                })
            })
    }

    return (
        <div className={classes.sidebar}>

            {showCreateClassModal ? <Backdrop closeModal={closeCreateModal} >
                <CreateClass closeModal={closeCreateModal} fetchClasses={fetchClasses} />
            </Backdrop> : null}
            {showJoinClassModal ? <Backdrop closeModal={closeJoinModal} >
                <JoinClass closeModal={closeJoinModal} fetchClasses={fetchClasses} />
            </Backdrop> : null}

            <label className={classes.LogoContainer}>
                <img src={Logo} alt="Logo" style={{ width: '75px', marginLeft: 24 }} />
                <label style={{ fontSize: '48px', fontWeight: 400, marginLeft: 24, whiteSpace: 'nowrap' }}>E-Class</label>
            </label>

            {/* <ul className={classes.ul}>
                <NavLink to="/classes"
                    className={classes.Inactive}
                // activeClassName={classes.ActiveClass}
                // activeStyle={{
                //     color: '#185473',
                // }}
                >
                    <li className={classes.li}>Classes</li>
                </NavLink>

                <NavLink to="/scheduler"
                    className={classes.Inactive}
                // activeClassName={classes.ActiveClass}
                // activeStyle={{
                //     color: '#185473',
                // }}
                >
                    <li className={classes.li}>Scheduler</li>
                </NavLink>
            </ul> */}

            <div className={classes.ProfileContainer}>
                <div className={classes.AddIcon}><img src={AddIcon} alt='add' onClick={() => setShowAddOptions(!showAddOptions)} /></div>
                {showAddOptions ? <Options options={[
                    { value: "Create Class", clicked: openCreateModal },
                    { value: "Join Class", clicked: openJoinModal }
                ]} closeOptions={() => setShowAddOptions(false)} open={showAddOptions} marginLeft='-150px' marginTop='200px' /> : null}
                <div className={classes.Username}
                    onClick={() => setshowProfileOptions(!showProfileOptions)}>
                    <label style={{ display: 'flex', width: 38, border: '1px solid #ddd', borderRadius: 19, backgroundColor: '#ddd', marginRight: 10 }}>
                        <img src={UserIcon} alt='userIcon' />
                    </label>
                    {username}

                </div>

                {showProfileOptions ? <Options options={[{ value: "Sign out", clicked: signOut }]}
                    closeOptions={() => setshowProfileOptions(false)} open={showProfileOptions}
                    marginLeft='80px'
                /> : null}

            </div>
        </div>
    )
}

export default Sidebar