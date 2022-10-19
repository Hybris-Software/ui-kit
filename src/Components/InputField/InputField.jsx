import React, { useState } from "react";

// Icons
import { FiAlertTriangle } from "react-icons/fi";
import { AiOutlineCheck } from "react-icons/ai";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

// Utils
import classNames from "../../Utils/classNames";

// Styles
import Style from "./InputField.module.css";

const InputField = ({
  className,
  inputFieldContainer = Style.inputFieldContainer,
  inputFieldContainerError = Style.inputFieldContainerError,
  inputFieldContainerEmpty = Style.inputFieldContainerEmpty,
  isValid,
  errorDetails,
  type,
  label,
  onPaste = true,
  onCopy = true,
  placeholder,
  required,
  setValue = () => {},
  setShowErrors = () => {},
  style,
  errorIconVisibility = false,
  errorIcon = <FiAlertTriangle className={classNames(Style.icon, Style.alertIcon)} />,
  successIconVisibility = false,
  succesIcon = <AiOutlineCheck className={classNames(Style.icon, Style.successIcon)} />,
  showPasswordIconVisibility = type === "password" ? true : false,
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
}) => {
  // Variables
  const [inputType, setInputType] = useState(type);
  const [eyeIconVisibility, setEyeIconVisibility] = useState(false);
  const [eyeIcon, setEyeIcon] = useState(showPasswordIcon);

  const errorMessageString = errorDetails == null ? null : typeof errorDetails === "object" ? errorDetails.message : errorDetails;

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
      {label && <div className={Style.label}>{label}</div>}
      <div
        className={classNames(Style.inputField,
          isValid === null
            ? inputFieldContainerEmpty
            : isValid === false
              ? inputFieldContainerError
              : inputFieldContainer,
          className
        )}
        style={style}
      >
        {/* Input */}
        <input
          className={classNames(Style.input, showArrows === false && Style.inputArrows)}
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
              }
              else {
                setInputType("password");
                setEyeIcon(showPasswordIcon);
              }
            }}
          >
            {eyeIcon}
          </span>
        ) : (
          <span>
            {isValid === true
              ? successIconVisibility === true && required && (succesIcon)
              : isValid === false && errorIconVisibility === true && (errorIcon)
            }
          </span>
        )}
      </div>

      {showError && (
        <div title={errorMessageString} className={Style.errorMessage}>
          {errorMessageString && errorMessageString}
        </div>
      )}
    </div>
  );
};

export default InputField;
