import React, { useState, useEffect } from 'react'

const useTheme = () => {
  const [theme, setTheme] = useState('light')

  const setThemeFromLocalStore = () => {
    const _theme = localStorage.getItem('theme')
    const body = document.body

    if (_theme) {
      setTheme(_theme)
    }
  }

  const switchTheme = (theme: string) => {
    localStorage.setItem('theme', theme)
  }

  useEffect(() => {
    setThemeFromLocalStore()
  }, [])
}

export default useTheme
