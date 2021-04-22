import React from 'react'
import { Card, Radio } from 'antd'
import { useTheme } from '../../context/ThemeProvider'

const themes = [
  {
    name: 'light-theme',
    label: 'Light',
  },
  {
    name: 'dark-theme',
    label: 'Dark',
  },
  // {
  //   name: 'system-theme',
  //   label: 'System',
  // },
]

const ThemeSwitcher = () => {
  const { theme, switchTheme } = useTheme()
  return (
    <Card>
      <Radio.Group value={theme} onChange={(e) => switchTheme(e.target.value)}>
        {themes.map((themeOptions) => {
          console.log(themeOptions, theme)

          return (
            <Radio key={themeOptions.name} value={themeOptions.name}>
              {themeOptions.label}
            </Radio>
          )
        })}
      </Radio.Group>
    </Card>
  )
}

export default ThemeSwitcher
