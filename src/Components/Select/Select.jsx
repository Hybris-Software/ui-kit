import React, {
  useState,
  useRef,
  forwardRef,
  useContext,
  useImperativeHandle,
} from "react";

// Icons
import { IoIosArrowDown } from "react-icons/io";

// Utils
import classNames from "../../Utils/classNames";

// Styles
import Style from "./Select.module.css";

// Contexts
import ThemeContext from "../../Contexts/ThemeContext";

const Select = forwardRef(
  (
    {
      style,
      className,
      classNameOpened,
      classNameOption,
      classNamePlaceholder,
      placeholder,
      value,
      setValue,
      items,
      labelKey = "label",
      icon = <IoIosArrowDown />,
      iconTransitionSpeed,
      scrollToTopOnClose = true,
      maxHeightOpened = 150,
      styleOpened = {
        overflow: "auto",
        position: "absolute",
        opacity: 1,
        zIndex: 3,
        transition: "all 0.3s",
        visibility: "visible",
      },
      styleClosed = {
        overflow: "hidden",
        position: "absolute",
        visibility: "hidden",
        transition: "all 0.2s",
        zIndex: 3,
        opacity: 0,
      },
      onSelectOpen = () => {},
      onSelectClose = () => {},
      onSelectChange = () => {},
      renderOption = (item, fullItem) => item,
      renderPlaceholder = (item) => item,
    },
    ref
  ) => {
    const themeContext = useContext(ThemeContext);

    // States
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState("");

    // Const
    const computedItems = items || [];
    const isObject = computedItems.some((el) => typeof el === "object");
    const seconds = parseFloat(
      styleClosed.transition.match(/(\d+(?:\.\d+)?)s/)[1]
    );

    // Refs
    const defaultRef = useRef(null);
    const selectRef = ref || defaultRef;
    const childRef = useRef(null);
    const selectOpenedRef = useRef(null);

    // Functions
    const checkPosition = (refOpened, state) => {
      const selectOpened = refOpened.current;
      const selectTop = selectOpened.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (!state) {
        if (windowHeight - selectTop < maxHeightOpened) {
          setPosition("top");
          selectOpened.style.bottom = `${childRef.current.clientHeight}px`;
          selectOpened.style.top = `auto`;
        }
        if (windowHeight - selectTop >= maxHeightOpened) {
          setPosition("bottom");
          selectOpened.style.top = `${childRef.current.clientHeight}px`;
          selectOpened.style.bottom = "auto";
        }
      }
    };

    // Methods
    useImperativeHandle(selectRef, () => ({
      open: () => {
        checkPosition(selectOpenedRef, open);
        setOpen(true);
        onSelectOpen();
      },
      close: () => {
        position === "top"
          ? (selectOpenedRef.current.style.bottom = "0")
          : (selectOpenedRef.current.style.top = "0");
        checkPosition(selectOpenedRef, open);
        setOpen(false);
        onSelectClose();
      },
      toggle: () => {
        checkPosition(selectOpenedRef, open);
        setOpen((OldState) => {
          if (OldState) {
            onSelectClose();
          } else {
            onSelectOpen();
          }
          return !OldState;
        });
      },
      getValue: () => value,
      updateValue: (value) => {
        setValue(value);
        onSelectChange(value);
      },
    }));

    // Theme Classes
    const computedClassName =
      className ||
      (themeContext.theme &&
        themeContext.theme.select &&
        themeContext.theme.select.selectClassName) ||
      Style.selectClass;

    const computedClassNameOpened =
      classNameOpened ||
      (themeContext.theme &&
        themeContext.theme.select &&
        themeContext.theme.select.selectOpenedClassName) ||
      Style.selectClassOpened;

    const computedClassNameOption =
      classNameOption ||
      (themeContext.theme &&
        themeContext.theme.select &&
        themeContext.theme.select.selectOptionClassName) ||
      Style.selectClassOption;

    const computedClassNamePlaceholder =
      classNamePlaceholder ||
      (themeContext.theme &&
        themeContext.theme.select &&
        themeContext.theme.select.selectPlaceholderClassName) ||
      Style.selectClassPlaceholder;

    return (
      <div ref={selectRef} style={style}>
        <div
          ref={childRef}
          style={
            !open
              ? { position: "relative" }
              : position === "top"
              ? {
                  position: "relative",
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }
              : {
                  position: "relative",
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }
          }
          className={classNames(Style.select, computedClassName)}
          onClick={() => {
            selectRef.current.toggle();
          }}
          onMouseLeave={() => {
            selectRef.current.close();

            if (scrollToTopOnClose) {
              setTimeout(() => {
                selectOpenedRef.current.scrollTop = 0;
              }, seconds * 1000);
            }
          }}
        >
          <div className={Style.selected}>
            <span>
              {value ? (
                isObject ? (
                  value[labelKey]
                ) : (
                  value
                )
              ) : (
                <span className={computedClassNamePlaceholder}>
                  {renderPlaceholder}
                </span>
              )}
            </span>
            <span
              className={open ? Style.arrowOpened : Style.arrow}
              style={{ transition: `all ${iconTransitionSpeed || seconds}s` }}
            >
              {icon}
            </span>
          </div>

          <div
            ref={selectOpenedRef}
            className={computedClassNameOpened}
            style={
              open
                ? position === "top"
                  ? {
                      ...styleOpened,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      maxHeight: maxHeightOpened,
                    }
                  : {
                      ...styleOpened,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      maxHeight: maxHeightOpened,
                    }
                : { ...styleClosed, maxHeight: 0 }
            }
          >
            {isObject
              ? computedItems
                  .filter((item) => item.searchable !== false)
                  .map((option, i) => (
                    <div
                      key={i}
                      className={computedClassNameOption}
                      onClick={() => {
                        selectRef.current.updateValue(option);
                      }}
                    >
                      {renderOption(option[labelKey], option)}
                    </div>
                  ))
              : computedItems.map((option, i) => (
                  <div
                    key={i}
                    className={computedClassNameOption}
                    onClick={() => {
                      selectRef.current.updateValue(option);
                    }}
                  >
                    {renderOption(option)}
                  </div>
                ))}
          </div>
        </div>
      </div>
    );
  }
);

export default Select;
