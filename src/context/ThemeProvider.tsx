import React, { createContext, useState, useEffect, useContext } from 'react'

const ThemeContext = createContext<any>({})

const ThemeProvider = (props: any) => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

  const defaultTheme = isDarkMode ? 'dark-theme' : 'light-theme'
  const [theme, setTheme] = useState(defaultTheme)

  useEffect(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        const colorScheme = event.matches ? 'dark' : 'light'
        switchTheme(`${colorScheme}-theme`)
      })
  }, [])

  const switchTheme = (theme: string) => {
    document.getElementsByTagName('body')[0].className = theme
    setTheme(theme)
  }

  useEffect(() => {
    switchTheme(defaultTheme)
  }, [defaultTheme])

  return (
    <ThemeContext.Provider value={{ theme }}>
      {props.children}
    </ThemeContext.Provider>
  )
}

const useTheme = () => useContext(ThemeContext)

export { ThemeProvider, useTheme }
