import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actionType from '../../../store/actionType';
import classes from './Toaster.module.css';
import CancelIcon from '../../../assets/images/cancel.svg';

const ErrorBar = (props) => {

    const dispatch = useDispatch();

    useEffect(() => {
        let timeout  = setTimeout(() => {
            dispatch({
                type: actionType.HIDE_ERROR_TOASTER
            })
        }, 5000);
        return () => {
            clearTimeout(timeout);
        }
    }, [props.show])

    let attachedClasses = [classes.ErrorBar];

    if(props.show){
        attachedClasses.push(classes.Show)
    }
    return (
        <div className={attachedClasses.join(' ')}>
            <label style={{width: 24, marginRight:12, display: 'flex'}}><img src= {CancelIcon} alt='cancel'/></label>
            <label className={classes.Message}>{props.message}</label>
        </div>
    )
}

export default ErrorBar;
