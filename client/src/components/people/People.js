import React, { Component, useEffect, useState } from "react";
import classes from "./People.module.css";
import Student from "../../assets/images/student.svg";
// import Teacher from "../../assets/images/teacher.svg";
// import Book from "../../assets/images/book.png";
import Teacher from "../../assets/images/t2.svg";
import axios from "axios";
import { useDispatch } from "react-redux";
import actionType from "../../store/actionType";

const People = (props) => {

  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    refreshPeople();
  }, [])

  function refreshPeople() {
    axios.post('http://localhost:3001/classes/people', { classCode: props.classCode })
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          setStudents(res.data.students);
          setTeacher(res.data.teacher);
        } else {
          dispatch({
            type: actionType.SHOW_ERROR_TOASTER,
            payload: "Something went wrong! Please try agian later ",
          });
        }
      }).catch(err => {
        dispatch({
          type: actionType.SHOW_ERROR_TOASTER,
          payload: "Something went wrong! Please try agian later ",
        });
      })
  }

  return (
    <div className={classes.People}>
      <label className={classes.Heading}>
        Teacher
      </label>
      <label className={classes.Row}>
        <img src={Teacher} alt="" style={{ border: `1px solid black`, width: "40px", borderRadius: "50%", padding: "5px", marginRight: "20px", backgroundColor: `${teacher.color}90` }} />
        {teacher.name}
      </label>
      <label className={classes.Heading}>Students </label>
      {students
        ? students.map((student) => {
          return (
            <label className={classes.Row} key={student.email}>
              <img src={Student} alt="" style={{ border: `1px solid black`, width: "40px", borderRadius: "50%", padding: "5px", marginRight: "20px", backgroundColor: `${student.color}90` }} />
              {student.name}
            </label>
          );
        })
        : null}
    </div>
  );
};

export default People;
