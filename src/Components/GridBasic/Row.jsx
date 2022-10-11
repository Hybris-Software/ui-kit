import React from 'react'

// Utils 
import classNames from '../../Utils/classNames'

// Styles
import Style from './GridBasic.module.css'

const Row = ({ className, style, children }) => {
    return (
        <div
            className={classNames(Style.row, className)}
            style={style}
        >
            {children}
        </div>
    )
}

export default Row

// Language: javascript
// # style: Add inline styles to the element
// # className, add one or more class names to the element
// # children: Rendered children