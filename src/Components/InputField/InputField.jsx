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
  error = { value: null },
  type,
  label,
  onPaste = true,
  onCopy = true,
  placeholder,
  required,
  setValue,
  style,
  errorIconVisibility = false,
  errorIcon = <FiAlertTriangle className={classNames(Style.icon, Style.alertIcon)} />,
  successIconVisibility = false,
  succesIcon = <AiOutlineCheck className={classNames(Style.icon, Style.successIcon)} />,
  showPasswordIconVisibility = type === "password" ? true : false,
  showPasswordIcon = <HiOutlineEye />,
  showPasswordIconOff = <HiOutlineEyeOff />,
  validationOnBlur = true,
  validationOnInput = true,
  showArrows = false,
  value,
}) => {
  // Variables
  const [inputType, setInputType] = useState(type);
  const [eyeIconVisibility, setEyeIconVisibility] = useState(false);
  const [eyeIcon, setEyeIcon] = useState(showPasswordIcon);

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
          error.value === null
            ? inputFieldContainerEmpty
            : error.value === false
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
          // onInput Function
          onInput={(e) => {
            if (validationOnInput) {
              setValue(e.target.value);
            } else {
              setValue(e.target.value, false);
            }
          }}
          // onBlur Function
          onBlur={(e) => {
            if (validationOnBlur) {
              setValue(e.target.value);
            }
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
            {error.value === true
              ? successIconVisibility === true && required && (succesIcon)
              : error.value === false && errorIconVisibility === true && (errorIcon)
            }
          </span>
        )}
      </div>

      <div title={error.message} className={Style.errorMessage}>{error.message && error.message}</div>

    </div>
  );
};

export default InputField;
