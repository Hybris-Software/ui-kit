import React, { useState, useContext, useRef } from "react";

// Icons
import { FiAlertTriangle } from "react-icons/fi";
import { AiOutlineCheck } from "react-icons/ai";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

// Utils
import classNames from "../../Utils/classNames";
import generateRandomCharacters from "../../Utils/generateRandomCharacters";

// Styles
import Style from "./InputField.module.css";

// Contexts
import ThemeContext from "../../Contexts/ThemeContext";

const InputField = ({
  autoComplete = "new-password",
  icon = null,
  className,
  baseClassName,
  successClassName,
  errorMessageClassName,
  errorClassName,
  labelClassName,
  isValid,
  errorDetails,
  type,
  label,
  onPaste = true,
  onCopy = true,
  placeholder,
  setValue = () => {},
  setShowErrors = () => {},
  style,
  errorIconVisibility,
  errorIcon,
  successIconVisibility,
  successIcon,
  showPasswordIconVisibility = true,
  showPasswordIcon = <HiOutlineEye />,
  showPasswordIconOff = <HiOutlineEyeOff />,
  showArrows = false,
  value,
  showError = true,
  maxLength,
  onBlur = () => {},
  onInput = () => {},
  onChange = () => {},
  readOnly = false,
  inputId,
  inputRef,
}) => {
  const defaultRef = useRef(null);
  const computedInputRef = inputRef || defaultRef;

  // Variables
  const [inputType, setInputType] = useState(type);
  const [eyeIconVisibility, setEyeIconVisibility] = useState(false);
  const [eyeIcon, setEyeIcon] = useState(showPasswordIcon);

  const computedInputId = inputId || generateRandomCharacters();

  const themeContext = useContext(ThemeContext);

  const errorMessageString =
    errorDetails == null
      ? null
      : typeof errorDetails === "object"
      ? errorDetails.message
      : errorDetails;

  const computedBaseClassName =
    baseClassName ||
    (themeContext.theme &&
      themeContext.theme.inputField &&
      themeContext.theme.inputField.baseClassName) ||
    Style.inputFieldBase;

  const computedErrorClassName =
    errorClassName ||
    (themeContext.theme &&
      themeContext.theme.inputField &&
      themeContext.theme.inputField.errorClassName) ||
    Style.inputFieldError;

  const computedSuccessClassName =
    successClassName ||
    (themeContext.theme &&
      themeContext.theme.inputField &&
      themeContext.theme.inputField.successClassName) ||
    Style.inputFieldSuccess;

  const computedLabelClassName =
    labelClassName ||
    (themeContext.theme &&
      themeContext.theme.inputField &&
      themeContext.theme.inputField.labelClassName) ||
    Style.label;

  const computedErrorMessageClassName =
    errorMessageClassName ||
    (themeContext.theme &&
      themeContext.theme.inputField &&
      themeContext.theme.inputField.errorMessageClassName) ||
    Style.errorMessageClassName;

  const computedSuccessIcon = successIcon ||
    (themeContext.theme &&
      themeContext.theme.inputField &&
      themeContext.theme.inputField.succesIcon) || (
      <AiOutlineCheck className={classNames(Style.icon, Style.successIcon)} />
    );

  const computedErrorIcon = errorIcon ||
    (themeContext.theme &&
      themeContext.theme.inputField &&
      themeContext.theme.inputField.errorIcon) || (
      <FiAlertTriangle className={classNames(Style.icon, Style.alertIcon)} />
    );

  const computedErrorIconVisibility =
    errorIconVisibility !== undefined
      ? errorIconVisibility
      : (themeContext.theme &&
          themeContext.theme.inputField &&
          themeContext.theme.inputField.errorIconVisibility) !== undefined
      ? themeContext.theme.inputField.errorIconVisibility
      : false;

  const computedSuccessIconVisibility =
    successIconVisibility !== undefined
      ? successIconVisibility
      : (themeContext.theme &&
          themeContext.theme.inputField &&
          themeContext.theme.inputField.successIconVisibility) !== undefined
      ? themeContext.theme.inputField.successIconVisibility
      : false;

  return (
    <div
      className={Style.componentContainer}
      onMouseOver={() => {
        if (type === "password" && showPasswordIconVisibility === true) {
          setEyeIconVisibility(true);
        }
      }}
      onMouseLeave={() => {
        if (type === "password" && showPasswordIconVisibility === true) {
          setEyeIconVisibility(false);
        }
      }}
    >
      {label && (
        <label htmlFor={computedInputId} className={computedLabelClassName}>
          {label}
        </label>
      )}
      <div
        className={classNames(
          Style.inputField,
          isValid === true
            ? computedSuccessClassName
            : isValid === false
            ? computedErrorClassName
            : computedBaseClassName,
          className
        )}
        style={style}
      >
        <span>{icon && icon}</span>
        {/* Input */}
        <input
          ref={computedInputRef}
          className={classNames(
            Style.input,
            showArrows === false && Style.inputArrows
          )}
          autoComplete={autoComplete}
          id={computedInputId}
          type={inputType}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          readOnly={readOnly}
          // onInput Function
          onInput={(e) => {
            setValue(e.target.value);
            onInput(e);
          }}
          onChange={onChange}
          // onBlur Function
          onBlur={(e) => {
            setShowErrors();
            onBlur(e);
          }}
          // onPaste Function
          onPaste={(e) => {
            if (!onPaste) {
              e.preventDefault();
            }
          }}
          // onCopy Function
          onCopy={(e) => {
            if (!onCopy) {
              e.preventDefault();
            }
          }}
        />

        {/* Status icon */}
        {eyeIconVisibility === true ? (
          <span
            className={classNames(Style.icon, Style.eyeIcon)}
            onClick={() => {
              if (inputType === "password") {
                setInputType("text");
                setEyeIcon(showPasswordIconOff);
              } else {
                setInputType("password");
                setEyeIcon(showPasswordIcon);
              }
            }}
          >
            {eyeIcon}
          </span>
        ) : (
          <span className={Style.icon}>
            {isValid === true
              ? computedSuccessIconVisibility === true && computedSuccessIcon
              : isValid === false &&
                computedErrorIconVisibility === true &&
                computedErrorIcon}
          </span>
        )}
      </div>

      {showError && (
        <div
          title={errorMessageString}
          className={computedErrorMessageClassName}
        >
          {errorMessageString && errorMessageString}
        </div>
      )}
    </div>
  );
};

export default InputField;
