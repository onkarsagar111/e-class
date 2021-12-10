import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import classes from "./Scheduler.module.css";
import { DataManager, WebApiAdaptor, ODataV4Adaptor, UrlAdaptor, Query, ODataAdaptor } from '@syncfusion/ej2-data';

const Scheduler = (props) => {

  const ref = useRef();

  let remoteData = new DataManager({
    url: 'http://localhost:3001/schedule/getData',
    crudUrl: 'http://localhost:3001/schedule/updateData',
    batchUrl: 'http://localhost:3001/schedule/updateData',
    insertUrl: 'http://localhost:3001/schedule/updateData',
    updateUrl: 'http://localhost:3001/schedule/updateData',
    removeUrl: 'http://localhost:3001/schedule/updateData',
    adaptor: new UrlAdaptor(),
    crossDomain: true,
  })

  async function getEvent(){
    let events = await axios.post('http://localhost:3001/schedule/getData', {}).then(res => res.data).catch(err => []);
    
  }
  
  useEffect(() => {
    remoteData.executeQuery(new Query().take(100)) 
    .then(e => { 
      ref.current.eventSettings.dataSource = e.result;
      console.log(e, ref.current)
    }); 
  })


  return (
    <div className={classes.scheduler}>
      <ScheduleComponent
        onChange={console.log('changed')}
        currentView="Week"
        selectedDate={new Date()}
        ref={ref}
        // created={createSchedule} 
        eventSettings={{ dataSource: remoteData }}
      >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
      </ScheduleComponent>
    </div>
  )
};

export default Scheduler;
