import React from 'react';
import classes from './Spinner.module.css';

const Spinner = (props) => {
    return (
        <div className={classes.Spinner}>
            <div className={classes.loader}></div>
            <label className={classes.Label}>Please wait</label>
        </div>
    )
}

export default Spinner;
