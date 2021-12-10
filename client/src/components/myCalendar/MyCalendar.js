import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    DayView,
    Appointments,
    AppointmentForm,
    AppointmentTooltip,
    ConfirmationDialog,
    WeekView,
    ViewSwitcher,
    Toolbar,
    MonthView,
    DateNavigator,
    EditRecurrenceMenu,
    AllDayPanel,
    DragDropProvider
} from '@devexpress/dx-react-scheduler-material-ui';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import actionType from '../../store/actionType';
import Spinner from '../ui/spinner/Spinner';

// import { appointments } from './appointments';

function MyCalendar(props) {

    const [data, setdata] = useState([]);
    const [loading, setloading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        setloading(true);
        let obj = {
            classCode: props.classCode
        }
        axios.post("http://localhost:3001/schedule/my-schedules", obj)
            .then(res => {
                setloading(false);
                if (res.data.status === "SUCCESS") {
                    setdata(res.data.schedules);
                } else {
                    dispatch({
                        type: actionType.SHOW_ERROR_TOASTER,
                        payload: "Something went wrong! Try again later.",
                    });
                }
            })
            .catch(err => {
                setloading(false);
                dispatch({
                    type: actionType.SHOW_ERROR_TOASTER,
                    payload: "Something went wrong! Try again later.",
                })
            })
    }, [])

    function commitChanges({ added, changed, deleted }) {
        setloading(true);
        if (added) {
            let obj = {
                classCode: props.classCode,
                action: 'ADD',
                schedule: { ...added }
            }
            axios.post('http://localhost:3001/schedule/update-schedules', obj)
                .then(res => {
                    setloading(false);
                    if (res.data.status === 'SUCCESS') {
                        setdata(res.data.schedules);
                        dispatch({
                            type: actionType.SHOW_SUCCESS_TOASTER,
                            payload: "Event scheduled.",
                        });
                    } else {
                        dispatch({
                            type: actionType.SHOW_ERROR_TOASTER,
                            payload: "Something went wrong! Try again later.",
                        })
                    }
                })
                .catch(err => {
                    setloading(false);
                    dispatch({
                        type: actionType.SHOW_ERROR_TOASTER,
                        payload: "Something went wrong! Try again later.",
                    })
                })
            console.log('added : ', added);
        }

        if (changed) {
            let obj = {
                classCode: props.classCode,
                action: 'UPDATE',
                schedule: changed
            }
            axios.post('http://localhost:3001/schedule/update-schedules', obj)
                .then(res => {
                    setloading(false);
                    if (res.data.status === 'SUCCESS') {
                        setdata(res.data.schedules);
                        dispatch({
                            type: actionType.SHOW_SUCCESS_TOASTER,
                            payload: "Event updated.",
                        });
                    } else {
                        dispatch({
                            type: actionType.SHOW_ERROR_TOASTER,
                            payload: "Something went wrong! Try again later.",
                        })
                    }
                })
                .catch(err => {
                    setloading(false);
                    dispatch({
                        type: actionType.SHOW_ERROR_TOASTER,
                        payload: "Something went wrong! Try again later.",
                    })
                })
            console.log('changed : ', changed);
        }

        if (deleted !== undefined) {
            let obj = {
                classCode: props.classCode,
                action: 'DELETE',
                schedule: deleted
            }
            axios.post('http://localhost:3001/schedule/update-schedules', obj)
                .then(res => {
                    setloading(false);
                    if (res.data.status === 'SUCCESS') {
                        setdata(res.data.schedules);
                        dispatch({
                            type: actionType.SHOW_SUCCESS_TOASTER,
                            payload: "Event deleted.",
                        });
                    } else {
                        dispatch({
                            type: actionType.SHOW_ERROR_TOASTER,
                            payload: "Something went wrong! Try again later.",
                        })
                    }
                })
                .catch(err => {
                    setloading(false);
                    dispatch({
                        type: actionType.SHOW_ERROR_TOASTER,
                        payload: "Something went wrong! Try again later.",
                    })
                })
            console.log('deleted : ', deleted);
        }
    }

    let permissions = {
        allowAdding: false,
        allowDeleting: false,
        allowResizing: false,
        allowDragging: false,
        allowUpdating: false,
    }

    let flag = props.type === 'Teacher' ? true : false;


    return (
        <React.Fragment>
            {loading ? <Spinner /> : <Paper>
                <Scheduler
                    data={data}
                >
                    <ViewState
                        defaultCurrentDate={new Date()}
                        defaultCurrentViewName="Week"
                    />
                    <EditingState
                        onCommitChanges={commitChanges}
                        allowUpdating={false}
                    />
                    <DayView
                        startDayHour={0}
                        endDayHour={24}
                    />
                    <WeekView
                        startDayHour={0}
                        endDayHour={24}
                    />
                    <WeekView
                        name="work-week"
                        displayName="Work Week"
                        excludedDays={[0, 6]}
                        startDayHour={0}
                        endDayHour={24}
                    />
                    <MonthView />
                    <EditRecurrenceMenu />
                    <Toolbar />
                    <ViewSwitcher />
                    <DateNavigator />
                    <ConfirmationDialog />
                    <Appointments />
                    <AllDayPanel />
                    <AppointmentTooltip
                        showOpenButton={flag}
                        showDeleteButton={flag}
                    />
                    {flag ? <AppointmentForm /> : null}
                </Scheduler>
            </Paper>}
        </React.Fragment>
    );
}

export default MyCalendar;
