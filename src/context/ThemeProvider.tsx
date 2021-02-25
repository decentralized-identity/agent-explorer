import React, { createContext, useState, useEffect, useContext } from 'react'

const ThemeContext = createContext<any>({})

const ThemeProvider = (props: any) => {
  const [theme, setTheme] = useState('light-theme')

  const switchTheme = (theme: string) => {
    document.getElementsByTagName('body')[0].className = theme
    localStorage.setItem('theme', theme)
    setTheme(theme)
  }

  useEffect(() => {
    const setThemeFromLocalStore = () => {
      const _theme = localStorage.getItem('theme')
      if (_theme) {
        switchTheme(_theme)
      } else {
        switchTheme('light-theme')
      }
    }

    setThemeFromLocalStore()
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      {props.children}
    </ThemeContext.Provider>
  )
}

const useTheme = () => useContext(ThemeContext)

export { ThemeProvider, useTheme }
