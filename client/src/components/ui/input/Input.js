import React from 'react';

import classes from './Input.module.css';

const Input = React.forwardRef((props, ref) => {

    let style = {};
    let attachedClasses = [classes.Input];
    let attachedTextareaClasses = [classes.Textarea];

    if (props.touched && !props.valid) {
        attachedClasses.push(classes.Invalid);
    }

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

    let myInput = <input ref={ref} disabled={props.disabled} onKeyDown={e => performEnterEvent(e)} value={props.value} type="text" placeholder={props.placeholder} style={style} className={attachedClasses.join(' ')} onChange={props.changed} />;

    switch (props.type) {
        case 'text': myInput = <input ref={ref} disabled={props.disabled} onKeyDown={e => performEnterEvent(e)} value={props.value} type="text" placeholder={props.placeholder} style={style} className={attachedClasses.join(' ')} onChange={props.changed} />; break;
        case "password": myInput = <input ref={ref} disabled={props.disabled} onKeyDown={e => performEnterEvent(e)} value={props.value} type="password" placeholder={props.placeholder} style={style} className={attachedClasses.join(' ')} onChange={props.changed} />; break;
        case 'email': myInput = <input ref={ref} disabled={props.disabled} onKeyDown={e => performEnterEvent(e)} value={props.value} type="email" placeholder={props.placeholder} style={style} className={attachedClasses.join(' ')} onChange={props.changed} />; break;
        case 'date': myInput = <input ref={ref} disabled={props.disabled} onKeyDown={e => performEnterEvent(e)} value={props.value} type="date" placeholder={props.placeholder} style={style} className={attachedClasses.join(' ')} onChange={props.changed} />; break;
        case 'datetime-local': myInput = <input ref={ref} disabled={props.disabled} onKeyDown={e => performEnterEvent(e)} value={props.value} type="datetime-local" placeholder={props.placeholder} style={style} className={attachedClasses.join(' ')} onChange={props.changed} />; break;
        
        case 'textarea': myInput = <textarea value={props.value} rows={props.rows} cols={props.columns} placeholder={props.placeholder} style={style} className={attachedTextareaClasses.join(' ')} onChange={props.changed} > </textarea>; break;

        default: break;
    }


    function performEnterEvent(e){
        if( props.enterEvent && e.key==='Enter'){
            props.enterEvent()
        }
    }

    return (
        <React.Fragment>
            { myInput}
        </React.Fragment>
    );
})

export default Input;
