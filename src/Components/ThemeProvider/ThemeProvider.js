import React from 'react'

// Utils
import useWindowSize from '../../Utils/useWindowSize'

// Contexts
import ThemeContext from '../../Contexts/ThemeContext'

const ThemeProvider = ({ children, theme }) => {
    const windowSize = useWindowSize()
    return <ThemeContext.Provider value={{ theme: theme, windowSize: windowSize }}>{children}</ThemeContext.Provider>
}

export default ThemeProvider;