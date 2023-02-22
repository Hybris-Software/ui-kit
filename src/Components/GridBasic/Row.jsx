import React, {
  isValidElement,
  cloneElement,
  useEffect,
  useState,
  useContext,
  Children,
} from "react";

// Utils
import classNames from "../../Utils/classNames";

// Styles
import Style from "./GridBasic.module.css";

// Contexts
import ThemeContext from "../../Contexts/ThemeContext";

// Data
import bootStrapBreakPoint from "../../Data/bootstrapBreakPoint";

function getColWidth(childProps, windowSize) {
  let colWidth = 12;

  if (childProps.xs && windowSize.width >= bootStrapBreakPoint.xs) {
    colWidth = childProps.xs;
  }

  if (childProps.sm && windowSize.width >= bootStrapBreakPoint.sm) {
    colWidth = childProps.sm;
  }

  if (childProps.md && windowSize.width >= bootStrapBreakPoint.md) {
    colWidth = childProps.md;
  }

  if (childProps.lg && windowSize.width >= bootStrapBreakPoint.lg) {
    colWidth = childProps.lg;
  }

  if (childProps.xl && windowSize.width >= bootStrapBreakPoint.xl) {
    colWidth = childProps.xl;
  }

  if (childProps.xxl && windowSize.width >= bootStrapBreakPoint.xxl) {
    colWidth = childProps.xxl;
  }

  return colWidth;
}

function getColGap(gapBreakPoints, windowSize) {
  let colGap = 0;

  if (gapBreakPoints.xs && windowSize.width >= bootStrapBreakPoint.xs) {
    colGap = gapBreakPoints.xs;
  }

  if (gapBreakPoints.sm && windowSize.width >= bootStrapBreakPoint.sm) {
    colGap = gapBreakPoints.sm;
  }

  if (gapBreakPoints.md && windowSize.width >= bootStrapBreakPoint.md) {
    colGap = gapBreakPoints.md;
  }

  if (gapBreakPoints.lg && windowSize.width >= bootStrapBreakPoint.lg) {
    colGap = gapBreakPoints.lg;
  }

  if (gapBreakPoints.xl && windowSize.width >= bootStrapBreakPoint.xl) {
    colGap = gapBreakPoints.xl;
  }

  if (gapBreakPoints.xxl && windowSize.width >= bootStrapBreakPoint.xxl) {
    colGap = gapBreakPoints.xxl;
  }

  return colGap;
}

/**
 * @param {Object} props - props
 * @param {string} props.className - Class name for the row
 * @param {JSX.Element} props.children - Children
 * @param {Object} props.columnGap - Column gap
 * @param {boolean} props.useGap - Use gap
 */

const Row = ({ className, style, children, columnGap, useGap = true }) => {
  const childrenList = Children.toArray(children);

  const [horizontalGaps, setHorizontalGaps] = useState(
    Array(childrenList.length).fill(0)
  );
  const [verticalGaps, setVerticalGaps] = useState(
    Array(childrenList.length).fill(0)
  );

  const themeContext = useContext(ThemeContext);
  const windowSize = themeContext.windowSize;

  const computedClassName =
    themeContext?.theme &&
    themeContext?.theme?.row &&
    themeContext?.theme?.row?.rowClassName
      ? themeContext?.theme?.row?.rowClassName
      : "";

  useEffect(() => {
    if (windowSize) {
      const columnHorizontalGap = !useGap
        ? 0
        : columnGap && columnGap?.horizontal
        ? getColGap(columnGap?.horizontal, windowSize)
        : themeContext.theme &&
          themeContext.theme?.row &&
          themeContext.theme?.row?.columnGap &&
          themeContext.theme?.row?.columnGap?.horizontal
        ? getColGap(themeContext.theme?.row?.columnGap?.horizontal, windowSize)
        : 0;

      const columnVerticalGap = !useGap
        ? 0
        : columnGap && columnGap?.vertical
        ? getColGap(columnGap?.vertical, windowSize)
        : themeContext.theme &&
          themeContext.theme?.row &&
          themeContext.theme?.row?.columnGap &&
          themeContext.theme?.row?.columnGap?.vertical
        ? getColGap(themeContext.theme?.row?.columnGap?.vertical, windowSize)
        : 0;

      const newHorizontalGaps = [];
      const newVerticalGaps = [];
      let rowSize = 0;
      let rowElements = 0;
      let rowCount = 0;

      Children.forEach(childrenList, (child) => {
        const colSize = getColWidth(child.props, windowSize);

        if (rowSize + colSize > 12) {
          newHorizontalGaps.push(
            ...Array(rowElements).fill(columnHorizontalGap * (rowElements - 1))
          );
          newVerticalGaps.push(...Array(rowElements).fill(columnVerticalGap));
          rowCount += 1;
          rowSize = colSize;
          rowElements = 1;
        } else {
          rowSize += colSize;
          rowElements += 1;
        }
      });

      if (rowElements > 0) {
        newHorizontalGaps.push(
          ...Array(rowElements).fill(columnHorizontalGap * (rowElements - 1))
        );
        newVerticalGaps.push(...Array(rowElements).fill(0));
      }
      setHorizontalGaps(newHorizontalGaps);
      setVerticalGaps(newVerticalGaps);
    }
  }, [windowSize, columnGap, children, useGap]);

  return (
    <div
      className={classNames(Style.row, computedClassName, className)}
      style={style}
    >
      {childrenList.map((child, index) => {
        if (isValidElement(child)) {
          const colWidth = getColWidth(child.props, windowSize);
          return cloneElement(child, {
            colsize: `calc((100% - ${horizontalGaps[index]}px) * ${colWidth} / 12)`,
            marginbottom: verticalGaps[index],
            key: index,
          });
        }
        return child;
      })}
    </div>
  );
};

export default Row;

// Language: javascript
// # style: Add inline styles to the element
// # className, add one or more class names to the element
// # children: Rendered children
