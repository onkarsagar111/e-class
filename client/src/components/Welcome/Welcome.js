import React, { useState } from 'react';
import Cover from '../../assets/images/photo.svg';
import SignIn from '../signIn/SignIn';
import SignUp from '../signUp/SignUp';
import classes from './Welcome.module.css';
import Button from '../ui/button/Button';
import Logo from '../../assets/images/logo1.svg';
import WelcomeLogo from '../../assets/images/WelcomeIcon2.svg';

const Welcome = (props) => {


    const [openSignInModal, setOpenSignInModal] = useState(false);
    const [openSignUpModal, setOpenSignUpModal] = useState(false);
    const [openOtpModal, setOpenOtpModal] = useState(false);

    function signIn() {
        setOpenSignInModal(true);
        console.log('opening signin modal')
    }

    function signUp() {
        setOpenSignUpModal(true);
        console.log('opening signup modal')
    }

    function signUpInstead() {
        setOpenSignInModal(false);
        setOpenSignUpModal(true);
    }

    function signInInstead() {
        setOpenSignUpModal(false);
        setOpenSignInModal(true);
    }

    let attachedClass = [classes.Wrapper];
    if (openSignInModal || openSignUpModal) {
        attachedClass.push(classes.Slide);
    }

    return (
        <div style={{
            backgroundImage: `url(${Cover})`,
        }} className={classes.Background}>
            <SignIn visible={openSignInModal} signUpInstead={signUpInstead} />
            <SignUp visible={openSignUpModal} signInInstead={signInInstead} />
            <div className={attachedClass.join(' ')}>
                <div className={classes.Image}>
                    <img src={WelcomeLogo} alt="" style={{width: 610}} />
                </div>

                <div className={classes.Welcome}>

                    <img src={Logo} alt="Logo" style={{ width: '130px' }}
                    />
                    <label style={{
                        color: "#515151",
                        fontSize: "88px",
                        textAlign: "center",
                        marginBottom: 24
                    }}>E-Class</label>

                    <p style={{
                        color: "#515151",
                        fontSize: "24px",
                        textAlign: "center",
                        marginBottom: 24
                    }}>Organise your classes, enroll for offline lectures, schedule lectures and announcements and stay updated. </p>
                    <label style={{
                        display: "flex",
                        justifyContent: "space-around"
                    }}>
                        <Button type="Secondary" clicked={signIn} height="50px" width="250px" >
                            Sign In
                        </Button>
                        <Button clicked={signUp}  height="50px" width="250px" color="white">
                            Sign Up
                        </Button>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default Welcome;