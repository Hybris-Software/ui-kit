import React, { useState, useEffect } from "react";

// Styles
import Style from "./SimpleSlider.module.css";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

function getSlidePerView(breakPoints, slidePerView) {
  var sortedBreakpoints = [];
  for (var key in breakPoints) {
    sortedBreakpoints[sortedBreakpoints.length] = parseInt(key);
  }
  sortedBreakpoints.sort((a, b) => {
    return a - b;
  });
  console.log(sortedBreakpoints);
  if (breakPoints == null) {
    return slidePerView;
  } else {
    for (var i = 0; i < sortedBreakpoints.length; i++) {
      if (window.innerWidth < sortedBreakpoints[i]) {
        return breakPoints[sortedBreakpoints[i - 1]].slidesPerView;
      }
    }
    return breakPoints[sortedBreakpoints[sortedBreakpoints.length - 1]]
      .slidesPerView;
  }
}

const SimpleSlider = ({
  animation = "transform 1s ease-in-out",
  autoPlay = false,
  autoPlaySpeed = 2000,
  children = [],
  breakPoints = null,
  buttonClass = Style.buttons,
  gap = 40,
  nextChild = "Next",
  paginationClass = Style.paginationButtons,
  prevChild = "Prev",
  slidePerView = 3,
}) => {
  const [index, setIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(null);
  const [elWidth, setElWidth] = useState(null);
  const [elTranslate, setElTranslate] = useState(null);

  const windowSize = useWindowSize();

  useEffect(() => {
    const elementPerView = getSlidePerView(breakPoints, slidePerView);
    const element = document.getElementById("slider-container");
    const elementStyle = getComputedStyle(element);
    const containerW = parseInt(
      elementStyle.width.toString().replace("px", "")
    );
    const elementW = (containerW - gap * (elementPerView - 1)) / elementPerView;
    setContainerWidth(containerW);
    setElWidth(elementW);
    setElTranslate(elementW + gap);
  }, [windowSize]);

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        if (index < children.length - slidePerView) {
          setIndex(index + 1);
        } else {
          setIndex(0);
        }
      }, autoPlaySpeed);
      return () => clearInterval(interval);
    }
  }, [index]);

  return (
    <div id="slider-container" className={Style.slideshow}>
      <div
        className={Style.slideshowSlider}
        style={{
          transition: animation,
          transform: `translateX(${
            -index * ((elTranslate / containerWidth) * 100)
          }%)`,
        }}
      >
        {elWidth &&
          containerWidth &&
          elTranslate &&
          children.map((child, index) => (
            <Slide key={index} width={elWidth} marginRight={gap}>
              {child}
            </Slide>
          ))}
      </div>
      <PaginationButtons
        index={index}
        setIndex={setIndex}
        children={children}
        paginationClass={paginationClass}
        buttonClass={buttonClass}
        prevChild={prevChild}
        nextChild={nextChild}
        elementPerView={getSlidePerView(breakPoints, slidePerView)}
      />
    </div>
  );
};

const Slide = ({ children, width, marginRight }) => {
  return (
    <div
      style={{
        width: width,
        marginRight: marginRight,
      }}
      className={Style.slide}
    >
      {children}
    </div>
  );
};

const PaginationButtons = ({
  index,
  setIndex,
  children,
  paginationClass,
  buttonClass,
  prevChild,
  nextChild,
  elementPerView,
}) => {
  return (
    <div className={paginationClass}>
      <div
        className={buttonClass}
        onClick={() => {
          if (index > 0) {
            setIndex(index - 1);
          } else {
            setIndex(children.length - elementPerView);
          }
        }}
      >
        {prevChild}
      </div>
      <div
        className={buttonClass}
        onClick={() => {
          if (index < children.length - elementPerView) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}
      >
        {nextChild}
      </div>
    </div>
  );
};

export default SimpleSlider;
