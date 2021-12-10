import React from 'react';

import classes from './Button.module.css';

const Button = (props) => {

    let style = {};

    if(props.backgroundColor){
        style['backgroundColor'] = props.backgroundColor;
    }
    if(props.height){
        style['height'] = props.height;
    }
    if(props.width){
        style['width'] = props.width;
        style['maxWidth'] = props.width;
        style['minWidth'] = props.width;
    }
    if(props.color){
        style['color'] = props.color;
    }
    if(props.marginBottom){
        style['marginBottom'] = props.marginBottom;
    }
    if(props.marginTop){
        style['marginTop'] = props.marginTop;
    }
    if(props.marginRight){
        style['marginRight'] = props.marginRight;
    }
    if(props.marginLeft){
        style['marginLeft'] = props.marginLeft;
    }
    if(props.borderColor){
        style['borderColor'] = props.borderColor;
    }

    let attachedClasses = [classes.button];
    if(props.type==="Secondary"){
        attachedClasses.push(classes.secondary)
    } else if(props.type==="icon"){
        attachedClasses.push(classes.icon)
    }
    return (
        <div style={style} className={attachedClasses.join(' ')} onClick = {props.clicked}>
            {props.children}
        </div>
    )
}

export default Button;
