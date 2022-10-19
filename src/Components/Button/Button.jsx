import React, { useContext } from "react";

// Libraries
import TailSpin from "react-loading-icons/dist/esm/components/tail-spin";

// Utils
import classNames from "../../Utils/classNames";

// Styles
import Style from "./Button.module.css";

// Contexts
import ThemeContext from "../../Contexts/ThemeContext";

const Button = ({
  buttonClassName,
  disabledClassName,
  children,
  className,
  disabled = false,
  isLoading = false,
  loader,
  onClick,
  style,
}) => {
  const themeContext = useContext(ThemeContext);

  const computedClassName =
    buttonClassName ||
    (themeContext.theme &&
      themeContext.theme.button &&
      themeContext.theme.button.buttonClassName) ||
    Style.buttonClass;

  const computedDisabledClassName =
    disabledClassName ||
    (themeContext.theme &&
      themeContext.theme.button &&
      themeContext.theme.button.buttonDisabledClassName) ||
    Style.buttonDisabled;

  const buttonLoader = loader ||
    (themeContext.theme &&
      themeContext.theme.button &&
      themeContext.theme.button.loader) || <TailSpin height={25} />;

  return (
    <div
      style={{
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
        ...style,
      }}
      className={classNames(
        computedClassName,
        (disabled || isLoading) && computedDisabledClassName,
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
      {isLoading ? buttonLoader : children}
    </div>
  );
};

export default Button;
