import React from "react";

// Utils
import classNames from "../../Utils/classNames";

// Styles
import Style from "./GridBasic.module.css";

const Col = ({
  orderSm,
  orderMd,
  orderLg,
  orderXl,
  orderXxl,
  className,
  style,
  children,
  colSize,
  marginBottom,
}) => {
  return (
    <div
      className={classNames(
        orderSm && Style[`order-sm-${orderSm}`],
        orderMd && Style[`order-md-${orderMd}`],
        orderLg && Style[`order-lg-${orderLg}`],
        orderXl && Style[`order-xl-${orderXl}`],
        orderXxl && Style[`order-xxl-${orderXxl}`],
        className
      )}
      style={{
        flex: "0 0 auto",
        width: colSize,
        marginBottom: marginBottom,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Col;

// Language: javascript
// # sm: Set the width of the column for small screens (1 to 12)
// # md: Set the width of the column for medium screens (1 to 12)
// # lg: Set the width of the column for large screens (1 to 12)
// # xl: Set the width of the column for extra large screens (1 to 12)
// # xxl: Set the width of the column for extra extra large screens (1 to 12)
// # offsetSm: Set the offset of the column for small screens (1 to 12)
// # offsetMd: Set the offset of the column for medium screens (1 to 12)
// # offsetLg: Set the offset of the column for large screens (1 to 12)
// # offsetXl: Set the offset of the column for extra large screens (1 to 12)
// # offsetXxl: Set the offset of the column for extra extra large screens (1 to 12)
// # orderSm: Set the order of the column for small screens (first - 1 to 5 - last)
// # orderMd: Set the order of the column for medium screens (first - 1 to 5 - last)
// # orderLg: Set the order of the column for large screens (first - 1 to 5 - last)
// # orderXl: Set the order of the column for extra large screens (first - 1 to 5 - last)
// # orderXxl: Set the order of the column for extra extra large screens (first - 1 to 5 - last)
// # className, add one or more class names to the element
// # children: Rendered children
// # style: Add inline styles to the element
// # colSize: Change the width of the column
// # marginBottom: Change the margin bottom of the column
