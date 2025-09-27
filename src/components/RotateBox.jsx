import React from "react";

function RotateBox(props) {
  // Randomises rotation of element with an inline style
  let rotateDegrees = Math.random() * 0.02 - 0.01;

  return (
    <div style={{ transform: `rotateDegrees(${rotateDegrees}turn)` }}>
      {props.children}
    </div>
  );
}

export default RotateBox;
// TODO: to remove --randomRotation from CSS files and wrap RotateBox around all relevant elements
