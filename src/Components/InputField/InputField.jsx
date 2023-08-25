import React, { useState, useContext, useRef, forwardRef } from "react";

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
import useWindowSize from "../../Utils/useWindowSize";

/**
 * @param {Object} props - props
 * @param {string} props.autoComplete - Auto complete
 * @param {JSX.Element} props.icon - Icon
 * @param {string} props.className - Class name for the input field
 * @param {string} props.baseClassName - Base class name for the input field
 * @param {string} props.successClassName - Success class name for the input field
 * @param {string} props.errorMessageClassName - Error message class name for the input field
 * @param {string} props.errorClassName - Error class name for the input field
 * @param {string} props.labelClassName - Label class name for the input field
 * @param {boolean} props.isValid - Is valid
 * @param {string} props.errorDetails - Error details
 * @param {string} props.type - Type
 * @param {string} props.label - Label
 * @param {boolean} props.onPaste - On paste
 * @param {boolean} props.onCopy - On copy
 * @param {string} props.placeholder - Placeholder
 * @param {function} props.setValue - Set value
 * @param {function} props.setShowErrors - Set show errors
 * @param {Object} props.style - Style
 * @param {boolean} props.errorIconVisibility - Error icon visibility
 * @param {JSX.Element} props.errorIcon - Error icon
 * @param {boolean} props.successIconVisibility - Success icon visibility
 * @param {JSX.Element} props.successIcon - Success icon
 * @param {boolean} props.showPasswordIconVisibility - Show password icon visibility
 * @param {JSX.Element} props.showPasswordIcon - Show password icon
 * @param {JSX.Element} props.showPasswordIconOff - Show password icon off
 * @param {boolean} props.showPasswordIconAlwaysMobile - Show password icon Always Mobile
 * @param {number} props.mobileMaximumSize - Mobile Maximum Size
 * @param {boolean} props.showArrows - Show arrows
 * @param {string} props.value - Value
 * @param {boolean} props.showError - Show error
 * @param {number} props.maxLength - Max length
 * @param {function} props.onBlur - On blur
 * @param {function} props.onInput - On input
 * @param {function} props.onChange - On change
 * @param {boolean} props.readOnly - Read only
 * @param {string} props.inputId - Input id
 * @param {Object} props.inputRef - Input ref
 */

const InputFieldComponent = (
  {
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
    showPasswordIconAlwaysMobile = false,
    mobileMaximumSize = 767,
    showArrows = false,
    value,
    showError = true,
    maxLength,
    onBlur = () => {},
    onInput = () => {},
    onChange = () => {},
    readOnly = false,
    inputId,
  },
  ref
) => {
  const defaultRef = useRef(null);
  const computedInputRef = ref || defaultRef;

  // Variables
  const [inputType, setInputType] = useState(type);
  const [eyeIconVisibility, setEyeIconVisibility] = useState(false);
  const [eyeIcon, setEyeIcon] = useState(showPasswordIcon);

  const computedInputId = inputId || generateRandomCharacters();

  const themeContext = useContext(ThemeContext);

  const windowSize = useWindowSize();

  const errorMessageString =
    errorDetails == null
      ? null
      : typeof errorDetails === "object"
      ? errorDetails.message
      : errorDetails;

  const computedBaseClassName =
    baseClassName ||
    (themeContext?.theme &&
      themeContext?.theme?.inputField &&
      themeContext?.theme?.inputField.baseClassName) ||
    Style.inputFieldBase;

  const computedErrorClassName =
    errorClassName ||
    (themeContext?.theme &&
      themeContext?.theme?.inputField &&
      themeContext?.theme?.inputField.errorClassName) ||
    Style.inputFieldError;

  const computedSuccessClassName =
    successClassName ||
    (themeContext?.theme &&
      themeContext?.theme?.inputField &&
      themeContext?.theme?.inputField.successClassName) ||
    Style.inputFieldSuccess;

  const computedLabelClassName =
    labelClassName ||
    (themeContext?.theme &&
      themeContext?.theme?.inputField &&
      themeContext?.theme?.inputField.labelClassName) ||
    Style.label;

  const computedErrorMessageClassName =
    errorMessageClassName ||
    (themeContext?.theme &&
      themeContext?.theme?.inputField &&
      themeContext?.theme?.inputField.errorMessageClassName) ||
    Style.errorMessageClassName;

  const computedSuccessIcon = successIcon ||
    (themeContext?.theme &&
      themeContext?.theme?.inputField &&
      themeContext?.theme?.inputField.succesIcon) || (
      <AiOutlineCheck className={classNames(Style.icon, Style.successIcon)} />
    );

  const computedErrorIcon = errorIcon ||
    (themeContext?.theme &&
      themeContext?.theme?.inputField &&
      themeContext?.theme?.inputField.errorIcon) || (
      <FiAlertTriangle className={classNames(Style.icon, Style.alertIcon)} />
    );

  const computedErrorIconVisibility =
    errorIconVisibility !== undefined
      ? errorIconVisibility
      : (themeContext?.theme &&
          themeContext?.theme?.inputField &&
          themeContext?.theme?.inputField.errorIconVisibility) !== undefined
      ? themeContext?.theme?.inputField.errorIconVisibility
      : false;

  const computedSuccessIconVisibility =
    successIconVisibility !== undefined
      ? successIconVisibility
      : (themeContext?.theme &&
          themeContext?.theme?.inputField &&
          themeContext?.theme?.inputField.successIconVisibility) !== undefined
      ? themeContext?.theme?.inputField.successIconVisibility
      : false;

  return (
    <div
      className={Style.componentContainer}
      onMouseOver={() => {
        setEyeIconVisibility(true);
      }}
      onMouseLeave={() => {
        setEyeIconVisibility(false);
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
        {type === "password" &&
        showPasswordIconVisibility === true &&
        ((eyeIconVisibility === true &&
          windowSize.width >= mobileMaximumSize) ||
          (showPasswordIconAlwaysMobile === true &&
            windowSize.width < mobileMaximumSize)) ? (
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

const InputField = forwardRef(InputFieldComponent);

export default InputField;
