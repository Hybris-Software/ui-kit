import React from 'react'

// Utils 
import classNames from '../../Utils/classNames'

// Styles
import Style from '../GridBasic.module.css'

const Container = ({ className, style, children }) => {
    console.log(className)
    return (
        <div
            style={style}
            className={classNames(Style.container, className)}
        >
            {children}
        </div>
    )
}

export default Container

// Language: javascript
// # className, add one or more class names to the element
// # style, add inline styles to the element
// # children: Rendered children
// # width: Change the width of the container