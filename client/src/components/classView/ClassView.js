import React, { useState } from "react";
import ClassDashboard from "../classdashboard/ClassDashboard";
import classes from "./ClassView.module.css";
import People from "../people/People";
import BackIcon from "../../assets/images/back.svg";
import MyCalendar from "../myCalendar/MyCalendar";
import RegistrationForm from '../registrationForm/RegistrationForm';
import Requests from "../requests/Requests";
import DashboardIcon from '../../assets/images/trello.svg';
import PeopleIcon from '../../assets/images/users.svg';
import SchedulerIcon from '../../assets/images/calendar.svg';
import RequestIcon from '../../assets/images/request.svg';
import RegisterIcon from '../../assets/images/edit.svg';
import DashboardIcon2 from '../../assets/images/trello2.svg';
import PeopleIcon2 from '../../assets/images/users2.svg';
import SchedulerIcon2 from '../../assets/images/calendar2.svg';
import RequestIcon2 from '../../assets/images/request2.svg';
import RegisterIcon2 from '../../assets/images/edit2.svg';



const ClassView = (props) => {
  const [showDashboard, setshowDashboard] = useState(props.scheduleMode ? false : true);
  const [showScheduler, setshowScheduler] = useState(props.scheduleMode ? true : false);
  const [showPeople, setshowPeople] = useState(false);
  const [showRegister, setshowRegister] = useState(false);

  function viewDashboard() {
    setshowDashboard(true);
    setshowScheduler(false);
    setshowPeople(false);
    setshowRegister(false);
  }

  function viewScheduler() {
    setshowDashboard(false);
    setshowScheduler(true);
    setshowPeople(false);
    setshowRegister(false);
  }

  function viewPeople() {
    setshowDashboard(false);
    setshowScheduler(false);
    setshowPeople(true);
    setshowRegister(false);
  }

  function viewRegister() {
    setshowDashboard(false);
    setshowScheduler(false);
    setshowPeople(false);
    setshowRegister(true);
  }

  return (
    <div className={classes.ClassView}>
      <div className={classes.SideView}>
        <label className={classes.Icon} onClick={props.close}>
          <img src={BackIcon} alt="back" style={{ width: 40 }} />
        </label>
        <label
          className={classes.SideLink}
          style={showDashboard ? { backgroundColor: "#185473", color: 'white', boxShadow: "0px 8px 15px rgba(0,0,0,0.2)" } : {}}
          onClick={viewDashboard}
        >
          <img src={showDashboard ? DashboardIcon2 :DashboardIcon} alt="back" style={{ width: 40 }} />
          <label style={{paddingLeft: 18}}>Dashboard</label>
        </label>
        <label
          className={classes.SideLink}
          style={showScheduler ? { backgroundColor: "#185473", color: 'white', boxShadow: "0px 8px 15px rgba(0,0,0,0.2)" } : {}}
          onClick={viewScheduler}
        >
          <img src={showScheduler ? SchedulerIcon2 :SchedulerIcon} alt="back" style={{ width: 40 }} />
          <label style={{paddingLeft: 18}}>Scheduler</label>
        </label>
        <label
          className={classes.SideLink}
          style={showPeople ? { backgroundColor: "#185473", color: 'white', boxShadow: "0px 8px 15px rgba(0,0,0,0.2)" } : {}}
          onClick={viewPeople}
        >
          <img src={showPeople ? PeopleIcon2 :PeopleIcon} alt="back" style={{ width: 40 }} />
          <label style={{paddingLeft: 18}}>People</label>
        </label>
        <label
          className={classes.SideLink}
          style={showRegister ? { backgroundColor: "#185473", color: 'white', boxShadow: "0px 8px 15px rgba(0,0,0,0.2)" } : {}}
          onClick={viewRegister}
        >
          {props.type === 'Student' ? <> <img src={showRegister ? RegisterIcon2 :RegisterIcon} alt="back" style={{ width: 40 }} /><label style={{paddingLeft: 18}}>Registration</label></> :
            <> <img src={showRegister ? RequestIcon2 :RequestIcon} alt="back" style={{ width: 40 }} /><label style={{paddingLeft: 18}}>Requests</label></>}
        </label>
      </div>
      <div className={classes.MainView}>
        {showDashboard ? (
          <ClassDashboard
            classObj={props.classObj}
            type={props.type}
          />
        ) : null}
        {showScheduler ? <MyCalendar classCode={props.classObj.classCode} type={props.type} /> : null}
        {showPeople ? <People teacher={props.classObj.teacher} students={props.classObj.students} classCode={props.classObj.classCode}/> : null}
        {showRegister ? props.type === 'Student' ? <RegistrationForm classCode={props.classObj.classCode} /> : <Requests classCode={props.classObj.classCode} /> : null}
      </div>
    </div>
  );
};

export default ClassView;
