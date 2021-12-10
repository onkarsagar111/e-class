import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actionType from '../../../store/actionType';
import classes from './Toaster.module.css';
import InfoIcon from '../../../assets/images/info.svg'
const InforBar = (props) => {

    const dispatch = useDispatch();

    useEffect(() => {
        let timeout  = setTimeout(() => {
            dispatch({
                type: actionType.HIDE_INFO_TOASTER
            })
        }, 5000);
        return () => {
            clearTimeout(timeout);
        }
    }, [props.show])

    let attachedClasses = [classes.InfoBar];

    if(props.show){
        attachedClasses.push(classes.Show)
    }
    return (
        <div className={attachedClasses.join(' ')}>
            <label style={{width: 24, marginRight:12, display: 'flex'}}><img src= {InfoIcon} alt='cancel'/></label>
            <label className={classes.Message}>{props.message}</label>
        </div>
    )
}

export default InforBar;