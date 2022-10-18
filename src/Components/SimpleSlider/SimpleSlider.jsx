import React, { useState, useEffect, useContext } from "react";

// Styles
import Style from "./SimpleSlider.module.css";

// Contexts
import ThemeContext from "../../Contexts/ThemeContext";

function getSlidePerView(breakPoints, slidePerView) {
  if (breakPoints == null) {
    return slidePerView;
  } else {
    const sortedBreakpoints = Object.keys(breakPoints).sort((a, b) => a - b);
    for (const breakPoint of sortedBreakpoints) {
      if (window.innerWidth < breakPoint) {
        return breakPoints[breakPoint].slidesPerView;
      }
    }
    return (
      breakPoints[sortedBreakpoints[sortedBreakpoints.length - 1]]
        .slidesPerView || 1
    );
  }
}

function increaseIndex(index, setIndex, children, elementPerView) {
  if (index < children.length - elementPerView) {
    setIndex(index + 1);
  } else {
    setIndex(0);
  }
}

function decreaseIndex(index, setIndex, children, elementPerView) {
  if (index > 0) {
    setIndex(index - 1);
  } else {
    setIndex(children.length - elementPerView);
  }
}

const SimpleSlider = ({
  animation = "ease",
  animationDuration = 200,
  disableDrag = false,
  autoPlay = false,
  autoPlayTransitionSpeed = 1000,
  autoPlaySpeed = 2000,
  breakPoints = null,
  buttonClass = Style.buttons,
  children = [],
  dragSlideRatio = 0.01,
  gap = 40,
  nextChild = "Next",
  paginationButtons = true,
  paginationClass = Style.paginationButtons,
  prevChild = "Prev",
  slidePerView = 3,
}) => {
  const [index, setIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(null);
  const [elWidth, setElWidth] = useState(null);
  const [elTranslate, setElTranslate] = useState(null);
  const [isDown, setIsDown] = useState(false);
  const [offSet, setOffSet] = useState(0);
  const [dragMovement, setDragMovement] = useState(0);
  const [disableAnimation, setDisableAnimation] = useState(false);
  const [transitionSpeed, setTransitionSpeed] = useState(0);

  // Context Variables
  const themeContext = useContext(ThemeContext);
  const windowSize = themeContext.windowSize;

  const elementPerView = getSlidePerView(breakPoints, slidePerView);

  // Drag Functions
  function dragRepositioning() {
    setIsDown(false);
    const sliderContainer = document.getElementById("slider");

    sliderContainer.style.marginLeft = `${
      -index * ((elTranslate / containerWidth) * 100)
    }%`;
  }

  function onDragDesktop(e) {
    const sliderContainer = document.getElementById("slider");

    if (isDown && !disableAnimation) {
      sliderContainer.style.marginLeft = `${
        e.clientX - offSet - index * elTranslate
      }px`;

      if (index < children.length - elementPerView) {
        if (offSet - e.clientX > dragMovement) {
          increaseIndex(index, setIndex, children, elementPerView);
          setIsDown(false);
        }
      }

      if (index > 0) {
        if (offSet - e.clientX < -dragMovement) {
          decreaseIndex(index, setIndex, children, elementPerView);
          setIsDown(false);
        }
      }
    }
  }

  function onDragMobile(e) {
    const sliderContainer = document.getElementById("slider");
    if (isDown && !disableAnimation) {
      setDisableAnimation(true);

      sliderContainer.style.marginLeft = `${
        e.touches[0].clientX - offSet - index * elTranslate
      }px`;

      if (index < children.length - elementPerView) {
        if (offSet - e.touches[0].clientX > dragMovement) {
          increaseIndex(index, setIndex, children, elementPerView);
          setIsDown(false);
        }
        setTimeout(() => {
          setDisableAnimation(false);
        }, transitionSpeed);
      }

      if (index > 0) {
        if (offSet - e.touches[0].clientX < -dragMovement) {
          decreaseIndex(index, setIndex, children, elementPerView);
          setIsDown(false);
        }
        setTimeout(() => {
          setDisableAnimation(false);
        }, transitionSpeed);
      }
    }
  }

  useEffect(() => {
    setTransitionSpeed(autoPlay ? autoPlayTransitionSpeed : animationDuration);

    if (windowSize.width) {
      const element = document.getElementById("slider");
      const elementStyle = getComputedStyle(element);
      const containerMargin = parseInt(elementStyle.marginLeft);
      const containerW =
        parseInt(elementStyle.width.toString().replace("px", "")) +
        containerMargin;

      const elementW =
        (containerW - gap * (elementPerView - 1)) / elementPerView;
      setContainerWidth(containerW);
      setElWidth(elementW);
      setElTranslate(elementW + gap);
      setDragMovement(elementW * dragSlideRatio);
    }
  }, [windowSize]);

  useEffect(() => {
    if (autoPlay && !isDown) {
      const interval = setInterval(() => {
        increaseIndex(index, setIndex, children, elementPerView);
      }, autoPlaySpeed);
      return () => clearInterval(interval);
    }
  }, [index, elementPerView]);

  return (
    <div id="slider-container" className={Style.slideshow}>
      <div
        id="slider"
        // Desktop
        onMouseDown={(e) => {
          if (!disableDrag) {
            setIsDown(true);
            setOffSet(e.clientX);
          }
        }}
        onMouseMove={(e) => {
          if (!disableDrag) {
            onDragDesktop(e);
          }
        }}
        onMouseUp={dragRepositioning}
        // Mobile
        onTouchStart={(e) => {
          if (!disableDrag) {
            setIsDown(true);
            setOffSet(e.touches[0].clientX);
          }
        }}
        onTouchMove={(e) => {
          if (!disableDrag) {
            onDragMobile(e);
          }
        }}
        onTouchEnd={() => {
          if (!disableDrag) {
            dragRepositioning();
          }
        }}
        // Check
        onMouseLeave={() => {
          if (!disableDrag) {
            dragRepositioning();
          }
        }}
        className={Style.slideshowSlider}
        style={{
          cursor: disableDrag ? "unset" : isDown ? "grabbing" : "grab",
          transition: `all ${transitionSpeed}ms ${animation}`,
          marginLeft: `${-index * ((elTranslate / containerWidth) * 100)}%`,
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
      {paginationButtons && (
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
      )}
    </div>
  );
};

export default SimpleSlider;

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
          decreaseIndex(index, setIndex, children, elementPerView);
        }}
      >
        {prevChild}
      </div>
      <div
        className={buttonClass}
        onClick={() => {
          increaseIndex(index, setIndex, children, elementPerView);
        }}
      >
        {nextChild}
      </div>
    </div>
  );
};
