import React, { useContext } from "react";

// Utils
import classNames from "../../Utils/classNames";
import generateRandomCharacters from "../../Utils/generateRandomCharacters";

// Styles
import Style from "./TextField.module.css";

// Contexts
import ThemeContext from "../../Contexts/ThemeContext";

const TextField = ({
  autoComplete = "new-password",
  className,
  baseClassName,
  successClassName,
  errorMessageClassName,
  errorClassName,
  labelClassName,
  isValid,
  errorDetails,
  label,
  onPaste = true,
  onCopy = true,
  placeholder,
  setValue = () => {},
  setShowErrors = () => {},
  style,
  value,
  showError = true,
  maxLength,
  onBlur = () => {},
  onInput = () => {},
  onChange = () => {},
  readOnly = false,
  inputId,
  rows = 4,
  cols = 50,
}) => {
  // Variables
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

  return (
    <div className={Style.componentContainer}>
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
        {/* Input */}
        <textarea
          rows={rows}
          cols={cols}
          className={classNames(Style.input)}
          autoComplete={autoComplete}
          id={computedInputId}
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

export default TextField;
