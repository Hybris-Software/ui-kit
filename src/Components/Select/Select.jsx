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
      placeholder,
      setValue,
      items,
      label,
      value,
      icon = <IoIosArrowDown />,
      maxHeightOpened = 150,
      styleOpened = {
        maxHeight: maxHeightOpened,
        overflow: "auto",
        position: "absolute",
        opacity: 1,
        zIndex: 3,
        transition: "all 0.3s",
        visibility: "visible",
      },
      styleClosed = {
        maxHeight: 0,
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
    },
    ref
  ) => {
    const themeContext = useContext(ThemeContext);

    // States
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

    // Const
    const computedItems = items || [];
    const isntNormalList = computedItems.some((el) => typeof el === "object");

    // Refs
    const defaultRef = useRef(null);
    const selectRef = ref || defaultRef;
    const childRef = useRef(null);
    const selectOpenedRef = useRef(null);

    // Methods
    useImperativeHandle(selectRef, () => ({
      open: () => {
        setOpen(true);
        onSelectOpen();
      },
      close: () => {
        setOpen(false);
        onSelectClose();
      },
      toggle: () =>
        setOpen((OldState) => {
          if (OldState) {
            onSelectClose();
          } else {
            onSelectOpen();
          }
          return !OldState;
        }),
      getValue: () => value,
      setValue: (value) => {
        setValue(value);
        setSelectedItem(value);
        onSelectChange(value);
      },
    }));

    // Functions
    const checkPosition = (refOpened, state) => {
      selectRef.current.toggle();
      const selectOpened = refOpened.current;
      const selectTop = selectOpened.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (!state) {
        if (windowHeight - selectTop < maxHeightOpened) {
          setPosition("top");
          selectOpened.style.bottom = `${childRef.current.clientHeight}px`;
          selectOpened.style.top = `auto`;
          selectOpened.style.borderTopColor = "inherit";
        }
        if (windowHeight - selectTop >= maxHeightOpened) {
          setPosition("bottom");
          selectOpened.style.top = `${childRef.current.clientHeight}px`;
          selectOpened.style.bottom = "auto";
          selectOpened.style.borderBottomColor = "inherit";
        }
      }
    };

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
            checkPosition(selectOpenedRef, open);
          }}
          onMouseLeave={() => {
            selectRef.current.close();
            position === "top"
              ? (selectOpenedRef.current.style.bottom = "0")
              : (selectOpenedRef.current.style.top = "0");
          }}
        >
          <div className={Style.selected}>
            <span>{selectedItem || placeholder}</span>
            <span className={open ? Style.arrowOpened : Style.arrow}>
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
                    }
                  : {
                      ...styleOpened,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                    }
                : styleClosed
            }
          >
            {isntNormalList
              ? computedItems
                  .filter((item) => item.searchable !== false)
                  .map((option, i) => (
                    <div
                      key={i}
                      className={computedClassNameOption}
                      onClick={() => {
                        const tmpValue = option[value]
                          ? option[value]
                          : option.value;
                        selectRef.current.setValue(tmpValue);
                        onSelectChange(tmpValue);
                      }}
                    >
                      {label ? option[label] : option.label}
                    </div>
                  ))
              : computedItems.map((option, i) => (
                  <div
                    key={i}
                    className={computedClassNameOption}
                    onClick={() => {
                      selectRef.current.setValue(option);
                      onSelectChange(option);
                    }}
                  >
                    {option}
                  </div>
                ))}
          </div>
        </div>
      </div>
    );
  }
);

export default Select;
