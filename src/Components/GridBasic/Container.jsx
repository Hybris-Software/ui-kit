import React, { useContext, useEffect, useState } from "react";

// Utils
import classNames from "../../Utils/classNames";

// Styles
import Style from "./GridBasic.module.css";

// Contexts
import ThemeContext from "../../Contexts/ThemeContext";

/**
 * @param {Object} props - props
 * @param {string} props.className - Class name for the container
 * @param {JSX.Element} props.children - Children
 */

const Container = ({ className, style, children }) => {
  const themeContext = useContext(ThemeContext);

  const computedClassName =
    (themeContext?.theme &&
      themeContext?.theme?.container &&
      themeContext?.theme?.container?.containerClassName) ||
    "";

  return (
    <div
      style={style}
      className={classNames(Style.container, computedClassName, className)}
    >
      {children}
    </div>
  );
};

export default Container;

// Language: javascript
// # className, add one or more class names to the element
// # style, add inline styles to the element
// # children: Rendered children
// # width: Change the width of the container
