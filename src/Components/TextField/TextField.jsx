import React, { useContext } from "react";

// Utils
import classNames from "../../Utils/classNames";
import generateRandomCharacters from "../../Utils/generateRandomCharacters";

// Styles
import Style from "./TextField.module.css";

// Contexts
import ThemeContext from "../../Contexts/ThemeContext";

/**
 * @param {Object} props - props
 * @param {string} props.autoComplete - autoComplete
 * @param {string} props.className - Class name for the container
 * @param {string} props.baseClassName - Class name for the base
 * @param {string} props.successClassName - Class name for the success
 * @param {string} props.errorMessageClassName - Class name for the error message
 * @param {string} props.errorClassName - Class name for the error
 * @param {string} props.labelClassName - Class name for the label
 * @param {boolean} props.isValid - Is valid
 * @param {string} props.errorDetails - Error details
 * @param {string} props.label - Label
 * @param {boolean} props.onPaste - On paste
 * @param {boolean} props.onCopy - On copy
 * @param {string} props.placeholder - Placeholder
 * @param {function} props.setValue - Set value
 * @param {function} props.setShowErrors - Set show errors
 * @param {Object} props.style - Style
 * @param {string} props.value - Value
 * @param {boolean} props.showError - Show error
 * @param {number} props.maxLength - Max length
 * @param {function} props.onBlur - On blur
 * @param {function} props.onInput - On input
 * @param {function} props.onChange - On change
 * @param {boolean} props.readOnly - Read only
 * @param {string} props.inputId - Input id
 * @param {number} props.rows - Rows
 * @param {number} props.cols - Cols
 */

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
    (themeContext?.theme &&
      themeContext?.theme?.inputField &&
      themeContext?.theme?.inputField?.baseClassName) ||
    Style.inputFieldBase;

  const computedErrorClassName =
    errorClassName ||
    (themeContext?.theme &&
      themeContext?.theme?.inputField &&
      themeContext?.theme?.inputField?.errorClassName) ||
    Style.inputFieldError;

  const computedSuccessClassName =
    successClassName ||
    (themeContext?.theme &&
      themeContext?.theme?.inputField &&
      themeContext?.theme?.inputField?.successClassName) ||
    Style.inputFieldSuccess;

  const computedLabelClassName =
    labelClassName ||
    (themeContext?.theme &&
      themeContext?.theme?.inputField &&
      themeContext?.theme?.inputField?.labelClassName) ||
    Style.label;

  const computedErrorMessageClassName =
    errorMessageClassName ||
    (themeContext?.theme &&
      themeContext?.theme?.inputField &&
      themeContext?.theme?.inputField?.errorMessageClassName) ||
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
