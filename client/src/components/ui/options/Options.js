import React, { useEffect, useRef } from 'react';

import classes from './Options.module.css';

const Options = (props) => {

    const ref = useRef();

    function checkIfClickedOutside(e) {
        if (props.open && ref.current && !ref.current.contains(e.target)) {
            props.closeOptions()
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", checkIfClickedOutside);
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside);
        }
    }, [])

    let style = {};

    if(props.marginRight){
        style['marginRight'] = props.marginRight;
    }
    if(props.marginLeft){
        style['marginLeft'] = props.marginLeft;
    }
    if(props.marginBottom){
        style['marginBottom'] = props.marginBottom;
    }
    if(props.marginTop){
        style['marginTop'] = props.marginTop;
    }
    if(props.width){
        style['width'] = props.width;
        style['minWidth'] = props.width;
        style['minWidth'] = props.width;
    }


    return (
        <div className={classes.Options} ref={ref} style={style} >
            {
                props.options.map(row => <Option value={row.value} clicked={row.clicked} closeOptions={props.closeOptions} />)
            }
        </div>
    )
}

export default Options;



const Option = (props) => {

    function clickedHandler() {
        props.clicked();
        props.closeOptions();
    }

    return (
        <div className={classes.Option} onClick={clickedHandler}>
            <label style={{ cursor: 'pointer' }}>{props.value}</label>
        </div>
    )
}
