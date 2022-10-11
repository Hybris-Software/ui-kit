import React from "react";

// Libraries
import TailSpin from "react-loading-icons/dist/esm/components/tail-spin";

// Utils
import classNames from "../../Utils/classNames";

// Styles
import Style from "./Button.module.css";

const Button = ({
  basicClass = true,
  children,
  className,
  disabled = false,
  isLoading = false,
  loader = <TailSpin height={25} />,
  onClick,
  style,
}) => {
  return (
    <div
      style={{
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
        ...style,
      }}
      className={classNames(
        basicClass && Style.buttonClass,
        basicClass && (disabled || isLoading) && Style.buttonDisabled,
        className
      )}
      onClick={() => {
        if (disabled === false && isLoading === false) {
          if (onClick) {
            onClick();
          }
        }
      }}
    >
      {isLoading ? loader : children}
    </div>
  );
};

export default Button;
