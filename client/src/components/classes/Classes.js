import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import ClassCard from "../classCard/ClassCard";
import Button from "../ui/button/Button";
import classes from "./Classes.module.css";
import Backdrop from "../modals/backdrop/Backdrop";
import CreateClass from "../modals/createClassModal/CreateClass";
import JoinClass from "../modals/joinClassModal/JoinClass";
import actionType from "../../store/actionType";
import HomeCover from "../../assets/images/l3.svg";
import Spinner from "../ui/spinner/Spinner";
import ClassView from "../classView/ClassView";
import Background from '../../assets/images/Numbers.svg';

const Classes = (props) => {
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showJoinClassModal, setShowJoinClassModal] = useState(false);
  const [showClassView, setShowClassView] = useState(false);
  const [selectedClass, setselectedClass] = useState(null);

  const loading = useSelector((state) => state.class.loading);
  const enrolledClassCards = useSelector((state) => state.class.enrolledClasses);
  const myClassCards = useSelector((state) => state.class.myClasses);
  const username = useSelector((state) => state.auth.username);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .post("http://localhost:3001/classes", { username: username })
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          dispatch({
            type: actionType.SET_CLASSES,
            payload: {
              enrolledClasses: res.data.enrolledClassesData,
              myClasses: res.data.myClassesData,
              loading: false,
            },
          });
        } else {
          dispatch({
            type: actionType.SHOW_ERROR_TOASTER,
            payload: "Something went Wrong! Try again later.",
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: actionType.SET_CLASSES,
          payload: {
            enrolledClasses: [],
            myClasses: [],
            loading: false,
          },
        });
        dispatch({
          type: actionType.SHOW_ERROR_TOASTER,
          payload: "Something went Wrong! Try again later.",
        });
      });
  }, []);

  function fetchClasses() {
    axios
      .post("http://localhost:3001/classes", { username: username })
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          dispatch({
            type: actionType.SET_CLASSES,
            payload: {
              enrolledClasses: res.data.enrolledClassesData,
              myClasses: res.data.myClassesData,
              loading: false,
            },
          });
        } else {
          dispatch({
            type: actionType.SHOW_ERROR_TOASTER,
            payload: "Something went Wrong! Try again later.",
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: actionType.SET_CLASSES,
          payload: {
            enrolledClasses: [],
            myClasses: [],
            loading: false,
          },
        });
        dispatch({
          type: actionType.SHOW_ERROR_TOASTER,
          payload: "Something went Wrong! Try again later.",
        });
      });
  }

  function viewClass(obj, type, schedule) {
    setShowClassView(true);
    setselectedClass(<ClassView close={() => setShowClassView(false)} classObj={obj} type={type} scheduleMode={schedule} />);
  }

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

  return (
    <div className={classes.classes} style={{
      // backgroundImage: `url(${Background})`,
      // backgroundSize: "cover",
      // backgroundRepeat: "no-repeat",
      // width: "100vw",

    }}>
      {showCreateClassModal ? (
        <Backdrop closeModal={closeCreateModal}>
          <CreateClass closeModal={closeCreateModal} fetchClasses={fetchClasses} />
        </Backdrop>
      ) : null}
      {showJoinClassModal ? (
        <Backdrop closeModal={closeJoinModal}>
          <JoinClass closeModal={closeJoinModal} fetchClasses={fetchClasses} />
        </Backdrop>
      ) : null}

      {loading ? (
        <Spinner />
      ) : enrolledClassCards.length === 0 && myClassCards.length === 0 ? (
        <div className={classes.Wrapper}>
          <div className={classes.HomeContainer}>
            <div className={classes.HomeCover}>
              <img style={{ width: "100%", borderRadius: 30 }} src={HomeCover} alt=" " />
            </div>
            <div className={classes.ButtonContainer}>
              <Button type="Secondary" clicked={openCreateModal} height="50px" width="200px">
                Create class
              </Button>
              <Button clicked={openJoinModal} backgroundColor="#185473" height="50px" width="200px" color="white">
                Join class
              </Button>
            </div>
          </div>
          <div className={classes.InfoWrapper}>
            <ul>
              <label style={{fontWeight: 600, fontSize: 30}}>Teacher-</label>
              <li>Create a class</li>
              <li>Schedule, modify and update lectures and events.</li>
              <li>Make announcements and exchange information with students.</li>
              <li>Viewing all students and teachers who joined a particular classroom.</li>
              <li>Verify the vaccination certificate and approve/decline an offline seat request.</li>
            </ul>
            <ul>
             <label style={{fontWeight: 600, fontSize: 30}}>Student-</label>
              <li>Join using an auto-generated classcode.</li>
              <li>Ask doubts and discuss subject in class chat</li>
              <li>Get notified via emails form E-class for every update in scheduler.</li>
              <li>Personal roaster to view scheduled lectures and events.</li>
              <li>Register for an offline lecture Seat</li>
            </ul>
          </div>
        </div>
      ) : showClassView ? (
        selectedClass
      ) : (
        <React.Fragment>
          {myClassCards.map((item) => (
            <ClassCard
              clicked={() => viewClass(item, 'Teacher', false)}
              scheduleClicked={() => viewClass(item, 'Teacher', true)}
              type="Teacher"
              name={item.classname}
              subject={item.subject}
              section={item.section}
              roomNo={item.room_no}
            />
          ))}
          {enrolledClassCards.map((item) => (
            <ClassCard
              clicked={() => viewClass(item, 'Student', false)}
              scheduleClicked={() => viewClass(item, 'Student', true)}
              type="Student"
              name={item.classname}
              subject={item.subject}
              section={item.section}
              roomNo={item.room_no}
            />
          ))}
        </React.Fragment>
      )}
    </div>
  );
};

export default Classes;
