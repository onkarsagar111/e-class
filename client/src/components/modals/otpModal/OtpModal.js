import React, { useState } from 'react';
import classes from './OtpModal.module.css';
import Button from '../../ui/button/Button';
import Input from '../../ui/input/Input';

const OtpModal = (props) => {

    let initialState = {
        value: '',
        touched: false,
        valid: true
    }
    const [otp, setOtp] = useState(initialState);
    // const dispatch = useDispatch();


    function validateForm() {
        let isValid = true;
        if (otp.value.trim() === '') {
            let updatedState = { ...otp };
            updatedState.valid = false;
            updatedState.touched = true;
            setOtp(updatedState);
            isValid = false;
        }
        return isValid;
    }

    function otpChangedHandler(e) {
        let updatedOtp = { ...otp };
        updatedOtp.value = e.target.value;
        if (!updatedOtp.touched) {
            updatedOtp.touched = true;
        }
        updatedOtp.valid = e.target.value.trim() === '' ? false : true;
        setOtp(updatedOtp);
    }


    function submit() {
        if (validateForm() && (props.otp === otp.value)) {
            props.signUp();
        }
    }

    return (
        <div className={classes.OtpModal} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 30 }}>OTP has been sent to your registered email. Check your inbox.</h2>
            <div className={classes.InputContainer}>
                <Input value={otp.value} type='text' placeholder='OTP' width='300px' touched={otp.touched} valid={otp.valid} changed={otpChangedHandler} />
                {!otp.valid && otp.touched ? <label className={classes.ErrorLabel}>Required!</label> : null}
            </div>
            <Button clicked={submit} width="200px">Submit</Button>

        </div>
    )
}

export default OtpModal;
