import React, { memo, useReducer, useRef, useEffect, useCallback } from "react";

//--------------------------
// constants
//--------------------------

const initialState = {
  gesture: "",
  allowedTime: 200,
  threshold: 150,
  timeOfLastDragEvent: 0,
  touchStartX: 0,
  touchStartY: 0,
  beingTouched: false,
};

//--------------------------
// Reducer
//--------------------------
function reducer(state, action) {
  switch (action.type) {

    case "gesture":
      debugger;
      return {
        ...state,
        ...{ gesture: action.value }
      };
    case "start":
    case "end":
      return {
        ...state,
        ...action.value
      } 
    case "captureTime":
      return {
        ...state,
        ...action.value
      }  
    default:
      state;
  }
}

function Swipe({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    beingTouched,
    timeOfLastDragEvent,
    touchStartX,
    touchStartY
  } = state;
  const swipeRef = useRef();


  //-----------------------------------
  // Swiping logic
  //-----------------------------------
  /* Mouse handlers  start*/

  const handleStart = useCallback((e)=>{
    console.log('start', e.clientX, e.clientY);
    dispatch({type: 'start', value: {
        touchStartX: e.clientX,
        touchStartY: e.clientY,
        beingTouched: true,
        timeOfLastDragEvent: Date.now(),
      } 
    });
  },[]);
  const handleEnd = useCallback(()=>{
    console.log('start');
    dispatch({type:'end', value: {
      beingTouched: false,
      touchStartX: 0,
      touchStartY: 0,
    }})
  },[])
  const handleMouseDown = useCallback((e)=>{
    console.log('mouse down');
    e.preventDefault();
    handleStart(e);
  },[]);
  const handleMouseUp = useCallback((e)=>{
    console.log('mouse up');
    handleEnd(e);
  },[]);
  const handleMouseLeave = useCallback((e)=>{
    console.log('mouse leave');
    handleEnd(e);
  },[]);


  const handleMove = useCallback((e) => {
    
    if (beingTouched){
      const currTime = Date.now();
      if (e.pageX < touchStartX) {
          /* to left */
          dispatch({ type: "gesture", value: "Swiping left!" });
        } else if (e.pageX > touchStartX ) {
          /* to right */
          dispatch({ type: "gesture", value: "Swiping right!" });
        } else if (e.pageY > touchStartY) {
          /* to Bottom */
          dispatch({ type: "gesture", value: "Swiping Down!" });
        } else if (e.pageY < touchStartY) {
          /* to Top */
          dispatch({ type: "gesture", value: "Swiping Up!" });
        }
      dispatch({type: 'captureTime', value : { timeOfLastDragEvent: currTime, touchStartX: e.pageX, touchStartY:e.pageY }})

    }
  },[beingTouched, timeOfLastDragEvent, touchStartX, touchStartY]);

  /* Mouse handlers  ends*/

  /* Touch handlers  start*/
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    handleStart(targetTouches[0]);
  },[]);

  const handleTouchMove = useCallback((e) => {
    handleMove(e.targetTouches[0]);
    dispatch({ type: "touchEnd" });
  },[]);

  const handleTouchEnd = useCallback((e) => {
    handleEnd();
  },[]);


  //---------------------------
  // On load
  //---------------------------
  useEffect(() => {
    if (swipeRef && swipeRef.current) {
      const element = swipeRef.current;

      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("touchmove", handleTouchMove);
      element.addEventListener("touchend", handleTouchEnd);
      element.addEventListener("mouseup", handleMouseUp);
      element.addEventListener("mousedown", handleMouseDown);
      element.addEventListener("mousemove", handleMove);
      element.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchmove", handleTouchMove);
        element.removeEventListener("touchend", handleTouchEnd);
        element.removeEventListener("mousedown", handleMouseDown);
        element.removeEventListener("mouseup", handleMouseUp);
        element.removeEventListener("mousemove", handleMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [handleMove, handleTouchStart, handleTouchMove, handleMouseDown, handleMouseDown, handleMouseLeave]);

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
