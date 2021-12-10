import React from 'react';

import classes from './ClassCard.module.css';
import StudentBackground from '../../assets/images/StudentBackground.svg';
import TeacherBackground from '../../assets/images/TeacherBackground.svg';
import Icon from '../../assets/images/schedule.svg';

function ClassCard(props) {

    return (
        <div className={classes.ClassCard} >
            <div style={{
                backgroundImage: `url(${props.type === 'Teacher' ? TeacherBackground : StudentBackground})`,
            }} className={classes.Header} onClick={props.clicked}>
                <label style={{ fontSize: "40px", cursor: 'pointer', fontWeight: 600 }}>{props.name}</label>
                <label style={{ fontSize: "24px", cursor: 'pointer', fontWeight: 400 }}>{props.subject}</label>
                <label style={{ fontSize: "24px", cursor: 'pointer', fontWeight: 400 }}>{props.section}</label>
            </div>
            <div className={classes.Footer}>
                <p>Room-No: {props.roomNo}</p>
                <label onClick={props.scheduleClicked} className={classes.Icon}>
                    <img style={{ width: 30 }} src={Icon} alt='' />
                </label>
            </div>
        </div>
    )
}

export default ClassCard;