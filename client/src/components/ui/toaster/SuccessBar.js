import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actionType from '../../../store/actionType';
import classes from './Toaster.module.css';
import SuccessIcon from '../../../assets/images/success.svg'

const SuccessBar = (props) => {

    const dispatch = useDispatch();

    useEffect(() => {
        let timeout  = setTimeout(() => {
            dispatch({
                type: actionType.HIDE_SUCCESS_TOASTER
            })
        }, 5000);
        return () => {
            clearTimeout(timeout);
        }
    }, [props.show])

    let attachedClasses = [classes.SuccessBar];

    if (props.show) {
        attachedClasses.push(classes.Show)
    }
    return (
        <div className={attachedClasses.join(' ')}>
            <label style={{width: 24, marginRight:12, display: 'flex'}}><img src= {SuccessIcon} alt='cancel'/></label>
            <label className={classes.Message}>{props.message}</label>
        </div>
    )
}

export default SuccessBar;