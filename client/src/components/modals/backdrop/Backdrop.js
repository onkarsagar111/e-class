import React from "react";

const Backdrop = (props) => {
  return (
    <div
      style={{
        backgroundColor: "#e3e3e300",
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        left: props.left || "0px",
        top: props.top || "0px",
        height: "100vh",
        width: "100vw",
        zIndex: "500",
        backdropFilter: 'blur(10px)'
      }}

      onClick={props.closeModal}
    >
      {props.children}
    </div>
  );
};

export default Backdrop;
