import React, { memo } from "react";

export default memo(function Child(props) {
  const { gesture } = props;
  console.log(props);
  return (
    <div>
      <h3> This is chlild of Swipe </h3>
      <p> Swipe left or right to verify</p>

      {`You are ${gesture}`}
    </div>
  );
});
