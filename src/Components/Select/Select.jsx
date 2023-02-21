import React, { useState, useRef } from "react";

// Icons
import { IoIosArrowDown } from "react-icons/io";

// Utils
import classNames from "../../Utils/classNames";

// Styles
import Style from "./Select.module.css";

// Contexts
import ThemeContext from "../../Contexts/ThemeContext";

const Select = ({
    className,
    classNameOpened,
    classNameOption,
    placeholder,
    setValue,
    items,
    label,
    value,
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
    }
}) => {
    const themeContext = useContext(ThemeContext);

    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState("")
    const [selectedItem, setSelectedItem] = useState(null);
    const computedItems = items || [];
    const isntNormalList = computedItems.some((el) => typeof el === "object");

    const selectRef = useRef(null);
    const selectOpenedRef = useRef(null);

    const checkPosition = (refSelect, refOpened, state) => {
        setOpen((OldState) => !OldState);
        const refSelectClose = refSelect.current;
        const selectOpened = refOpened.current;
        const selectTop = selectOpened.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (!state) {
            if (windowHeight - selectTop < maxHeightOpened) {
                setPosition("top")
                selectOpened.style.bottom = `${refSelectClose.clientHeight}px`;
                selectOpened.style.top = `auto`;
                selectOpened.style.borderTopColor = "inherit";
                selectOpened.style.borderBottomColor = "transparent";
                selectOpened.style.borderRadius = "3px 3px 0 0";
                refSelectClose.style.borderRadius = "0 0 3px 3px";
            }
            if (windowHeight - selectTop >= maxHeightOpened) {
                setPosition("bottom")
                selectOpened.style.top = `${refSelectClose.clientHeight}px`;
                selectOpened.style.bottom = "auto";
                selectOpened.style.borderTopColor = "transparent";
                selectOpened.style.borderBottomColor = "inherit";
                selectOpened.style.borderRadius = "0 0 3px 3px";
                refSelectClose.style.borderRadius = "3px 3px 0 0";
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
        <div
            ref={selectRef}
            style={{ position: "relative" }}
            className={classNames(Style.select, computedClassName)}
            onClick={() => {
                checkPosition(selectRef, selectOpenedRef, open);
                if (open === true) selectRef.current.style.borderRadius = "3px";
            }}
            onMouseLeave={() => {
                setOpen(false);
                position === "top"
                    ? selectOpenedRef.current.style.bottom = "0"
                    : selectOpenedRef.current.style.top = "0";
                selectRef.current.style.borderRadius = "3px";
            }}
        >
            <div className={Style.selected}>
                <span>{selectedItem || placeholder}</span>
                <span className={open ? Style.arrowOpened : Style.arrow}>
                    <IoIosArrowDown />
                </span>
            </div>

            <div
                ref={selectOpenedRef}
                className={computedClassNameOpened}
                style={
                    open
                        ? styleOpened
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
                                    setValue(value ? option[value] : option.value);
                                    setSelectedItem(value ? option[value] : option.value)
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
                                setValue(option);
                                setSelectedItem(option);
                            }}
                        >
                            {option}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Select;
