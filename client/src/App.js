import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import { useSelector } from "react-redux";
import Classes from "./components/classes/Classes";
import Sidebar from "./components/sidebar/Sidebar";
import Welcome from "./components/Welcome/Welcome";
import ErrorBar from "./components/ui/toaster/ErrorBar";
import SuccessBar from "./components/ui/toaster/SuccessBar";
import InfoBar from "./components/ui/toaster/InfoBar";
import './App.css'


function App() {

  const signedIn = useSelector(state => state.auth.signedIn);
  const toaster = useSelector(state => state.toaster);
  

  return (
    <BrowserRouter basename='/'>
      <SuccessBar show={toaster.successToaster} message={toaster.successToasterMessage} />
      <ErrorBar show={toaster.errorToaster} message={toaster.errorToasterMessage} />
      <InfoBar show={toaster.infoToaster} message={toaster.infoToasterMessage} />
      <div style={{ display: "flex", position: "fixed", top: "0px", left: "0px", height: "100%", width: "100%" }}>
        {signedIn ?
          <React.Fragment>
            <Sidebar />
            <Routes>
              <Route
                path="/classes"
                exact
                element={
                  <Classes />
                }
              />
              <Route
                path="/"
                element={
                  <Classes />
                }
              />
            </Routes>
          </React.Fragment> : <Welcome />
        }
      </div>
    </BrowserRouter>
  );
}

export default App;
