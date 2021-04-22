import React, { memo, useReducer, useRef, useEffect } from "react";

//--------------------------
// constants
//--------------------------

const initialState = {
  canMove: false,
  touchDown: { X: 0, Y: 0 },
  prevX: 0,
  prevY: 0,
  gesture: "",
  allowedTime: 200,
  threshold: 150,
  elapsedTime: 0,
  startTime: 0
};

//--------------------------
// Reducer
//--------------------------
function reducer(state, action) {
  switch (action.type) {
    case "canMove":
      return {
        ...state,
        ...{ canMove: action.value }
      };
    case "gesture":
      debugger;
      return {
        ...state,
        ...{ gesture: action.value }
      };
    case "prevX":
      return {
        ...state,
        ...{ prevX: action.value }
      };
    case "prevY":
      return {
        ...state,
        ...{ prevY: action.value }
      };
    case "touchDown":
      return {
        ...state,
        ...{ touchDownX: action.value },
        ...{ startTime: action.startTime }
      };
    case "touchEnd":
      return {
        ...state,
        ...{
          canMove: false,
          touchDown: { X: 0, Y: 0 },
          prevX: 0,
          gesture: "",
          prevY: 0
        }
      };
    default:
      state;
  }
}

function Swipe({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    canMove,
    prevX,
    touchDown,
    threshold,
    allowedTime,
    elapsedTime,
    prevY
  } = state;
  const swipeRef = useRef();

  //---------------------------
  // On load
  //---------------------------
  useEffect(() => {
    if (swipeRef && swipeRef.current) {
      const element = swipeRef.current;

      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("touchmove", handleTouchMove);
      element.addEventListener("touchend", handleTouchEnd);
      element.addEventListener("mousedown", handleMouse);
      element.addEventListener("mouseup", handleMouse);
      element.addEventListener("mousemove", handleMove);
      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchmove", handleTouchMove);
        element.removeEventListener("touchend", handleTouchEnd);
        element.addEventListener("mousedown", handleMouse);
        element.addEventListener("mouseup", handleMouse);
        element.addEventListener("mousemove", handleMove);
      };
    }
  }, []);

  //-----------------------------------
  // Swiping logic
  //-----------------------------------
  /* Mouse handlers  start*/
  const handleMouse = (e) => {
    if (e.type === "mouseup") {
      dispatch({ type: "canMove", value: false });
    } else {
      dispatch({ type: "canMove", value: true });
    }
  };
  const handleMove = (e) => {
    debugger;
    if (e.pageX < prevX && canMove) {
      debugger;
      /* to left */
      dispatch({ type: "gesture", value: "Swiping left!" });
      dispatch({ type: "canMove", value: false });
    } else if (e.pageX > prevX && canMove) {
      debugger;
      /* to right */
      dispatch({ type: "gesture", value: "Swiping right!" });
      dispatch({ type: "canMove", value: false });
    } else if (e.pageY > prevY && canMove) {
      /* to Bottom */

      dispatch({ type: "gesture", value: "Swiping Down!" });
      dispatch({ type: "canMove", value: false });
    } else if (e.pageY < prevY && canMove) {
      /* to Top */

      dispatch({ type: "gesture", value: "Swiping Up!" });
      dispatch({ type: "canMove", value: false });
    }
    dispatch({ type: "prevX", value: e.pageX });
    dispatch({ type: "prevY", value: e.pageY });
  };

  /* Mouse handlers  ends*/

  /* Touch handlers  start*/
  const handleTouchStart = (e) => {
    dispatch({
      type: "touchDown",
      value: { X: e.touches[0].clientX, Y: e.touches[0].clientY },
      startTime: new Date().getTime()
    });
  };

  const handleTouchMove = (e) => {
    if (!touchDown || !touchDown.X || !touchDown.Y) {
      return;
    }

    const xUp = e.touches[0].clientX;
    const yUp = e.touches[0].clientY;

    const xDiff = touchDown.X - xUp;
    const yDiff = touchDown.Y - yUp;
    const elapsedTime = new Date().getTime();
    if (elapsedTime <= allowedTime) {
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /*most significant*/
        if (xDiff > 0) {
          /* left swipe */
          dispatch({ type: "gesture", value: "Swiping left!" });
        } else {
          dispatch({ type: "gesture", value: "Swiping right!" });
          /* right swipe */
        }
      } else {
        if (yDiff > 0) {
          /* up swipe */

          dispatch({ type: "gesture", value: "Swiping Up!" });
        } else {
          /* down swipe */
          dispatch({ type: "gesture", value: "Swiping Down!" });
        }
      }
    }
    dispatch({ type: "touchEnd" });
  };

  const handleTouchEnd = (event) => {
    dispatch({ type: "touchEnd" });
  };

  return (
    (children && (
      <div className="swipe-container" ref={swipeRef}>
        {React.cloneElement(children, { ...state })}
      </div>
    )) ||
    null
  );
}

export default memo(Swipe);
