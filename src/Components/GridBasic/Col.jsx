import React from 'react'

// Utils
import classNames from '../../Utils/classNames'

// Styles
import Style from '../GridBasic.module.css'

const Col = ({ sm, md, lg, xl, xxl, offsetSm, offsetMd, offsetLg, offsetXl, offsetXxl, orderSm, orderMd, orderlg, orderXl, orderXxl, className, style, children }) => {
    return (
        <div
            className={classNames(
                [!sm, !md, !lg, !xl, !xxl].includes(false) && !className ? ('').trim : Style.col,
                sm && Style[`col-sm-${sm}`],
                md && Style[`col-md-${md}`],
                lg && Style[`col-lg-${lg}`],
                xl && Style[`col-xl-${xl}`],
                xxl && Style[`col-xxl-${xxl}`],
                offsetSm && Style[`offset-sm-${offsetSm}`],
                offsetMd && Style[`offset-md-${offsetMd}`],
                offsetLg && Style[`offset-lg-${offsetLg}`],
                offsetXl && Style[`offset-xl-${offsetXl}`],
                offsetXxl && Style[`offset-xxl-${offsetXxl}`],
                orderSm && Style[`order-sm-${orderSm}`],
                orderMd && Style[`order-md-${orderMd}`],
                orderlg && Style[`order-lg-${orderlg}`],
                orderXl && Style[`order-xl-${orderXl}`],
                orderXxl && Style[`order-xxl-${orderXxl}`],
                className
            )}
            style={style}
        >
            {children}
        </div>
    )
}

export default Col

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
// # orderlg: Set the order of the column for large screens (first - 1 to 5 - last)
// # orderXl: Set the order of the column for extra large screens (first - 1 to 5 - last)
// # orderXxl: Set the order of the column for extra extra large screens (first - 1 to 5 - last)
// # className, add one or more class names to the element
// # children: Rendered children
// # style: Add inline styles to the element