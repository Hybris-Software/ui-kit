import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Children,
} from "react";

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

function isMobile() {
  return (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.indexOf("IEMobile") !== -1
  );
}

function isSafariDesktop() {
  const ua = navigator.userAgent.toLowerCase();

  if (ua.indexOf("safari") != -1) {
    if (ua.indexOf("chrome") > -1) {
      return false;
    } else {
      if (isMobile()) {
        return false;
      } else {
        return true;
      }
    }
  }
}

/**
 * @param {string} animation - Animation type
 * @param {number} animationDuration - Animation duration
 * @param {boolean} disableDrag - Disable drag
 * @param {boolean} autoPlay - Enable autoplay
 * @param {number} autoPlayTransitionSpeed - Autoplay transition speed
 * @param {number} autoPlaySpeed - Autoplay speed
 * @param {Object} breakPoints - Breakpoints
 * @param {string} buttonClass - Class name for the buttons
 * @param {JSX.Element} children - Children
 * @param {number} dragSlideRatio - Drag slide ratio
 * @param {number} gap - Gap between elements
 * @param {string} nextChild - Next child
 * @param {boolean} paginationButtons - Enable pagination buttons
 * @param {string} paginationClass - Class name for the pagination buttons
 * @param {string} prevChild - Previous child
 * @param {number} slidePerView - Number of elements per view
 */

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
  dragSlideRatio = 0.02,
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

  const childrenList = Children.toArray(children);

  // Context Variables
  const themeContext = useContext(ThemeContext);
  const windowSize = themeContext.windowSize;

  const elementPerView = getSlidePerView(breakPoints, slidePerView);

  const computedDisabledDrag = disableDrag || isSafariDesktop();

  const sliderContainerRef = useRef(null);

  // Drag Functions
  function dragRepositioning() {
    setIsDown(false);
    const sliderContainer = sliderContainerRef.current;

    sliderContainer.style.marginLeft = `${
      -index * ((elTranslate / containerWidth) * 100)
    }%`;
  }

  function onDragDesktop(e) {
    const sliderContainer = sliderContainerRef.current;

    if (isDown && !disableAnimation) {
      sliderContainer.style.marginLeft = `${
        e.clientX - offSet - index * elTranslate
      }px`;

      if (index < childrenList.length - elementPerView) {
        if (offSet - e.clientX > dragMovement) {
          increaseIndex(index, setIndex, childrenList, elementPerView);
          setIsDown(false);
        }
      }

      if (index > 0) {
        if (offSet - e.clientX < -dragMovement) {
          decreaseIndex(index, setIndex, childrenList, elementPerView);
          setIsDown(false);
        }
      }
    }
  }

  function onDragMobile(e) {
    const sliderContainer = sliderContainerRef.current;
    if (isDown && !disableAnimation) {
      setDisableAnimation(true);

      sliderContainer.style.marginLeft = `${
        e.touches[0].clientX - offSet - index * elTranslate
      }px`;

      if (index < childrenList.length - elementPerView) {
        if (offSet - e.touches[0].clientX > dragMovement) {
          increaseIndex(index, setIndex, childrenList, elementPerView);
          setIsDown(false);
        }
        setTimeout(() => {
          setDisableAnimation(false);
        }, transitionSpeed);
      }

      if (index > 0) {
        if (offSet - e.touches[0].clientX < -dragMovement) {
          decreaseIndex(index, setIndex, childrenList, elementPerView);
          setIsDown(false);
        }
        setTimeout(() => {
          setDisableAnimation(false);
        }, transitionSpeed);
      }
    }
  }

  useEffect(() => {
    setTransitionSpeed(
      autoPlay || computedDisabledDrag
        ? autoPlayTransitionSpeed
        : animationDuration
    );

    if (windowSize.width) {
      const element = sliderContainerRef.current;
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
    if (autoPlay || computedDisabledDrag) {
      const interval = setInterval(() => {
        increaseIndex(index, setIndex, childrenList, elementPerView);
      }, autoPlaySpeed);
      return () => clearInterval(interval);
    }
  }, [index, elementPerView]);

  return (
    <div className={Style.slideshow}>
      <div
        ref={sliderContainerRef}
        // Desktop
        onMouseDown={(e) => {
          if (!computedDisabledDrag) {
            setIsDown(true);
            setOffSet(e.clientX);
          }
        }}
        onMouseMove={(e) => {
          if (!computedDisabledDrag) {
            onDragDesktop(e);
          }
        }}
        onMouseUp={dragRepositioning}
        // Mobile
        onTouchStart={(e) => {
          if (!computedDisabledDrag) {
            setIsDown(true);
            setOffSet(e.touches[0].clientX);
          }
        }}
        onTouchMove={(e) => {
          if (!computedDisabledDrag) {
            onDragMobile(e);
          }
        }}
        onTouchEnd={() => {
          if (!computedDisabledDrag) {
            dragRepositioning();
          }
        }}
        // Check
        onMouseLeave={() => {
          if (!computedDisabledDrag) {
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
          childrenList.map((child, index) => (
            <Slide key={index} width={elWidth} marginRight={gap}>
              {child}
            </Slide>
          ))}
      </div>
      {paginationButtons && (
        <PaginationButtons
          index={index}
          setIndex={setIndex}
          children={childrenList}
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
