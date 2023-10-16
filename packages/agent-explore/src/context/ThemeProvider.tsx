import { ConfigProvider, theme as antdTheme, App } from 'antd'
import { ProConfigProvider } from '@ant-design/pro-components'
import React, { createContext, useState, useEffect, useContext } from 'react'
import en_US from 'antd/es/locale/en_US'
import { useWeb3ModalTheme } from '@web3modal/wagmi/react'

const ThemeContext = createContext<any>({})

function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getStoredIsCompact(): boolean {
  return localStorage.getItem('isCompact') === 'true'
}

function storeIsCompact(isCompact: boolean) {
  localStorage.setItem('isCompact', isCompact.toString())
}

function storePrimaryColor(color: string) {
  localStorage.setItem('primaryColor', color)
}

function getStoredPrimaryColor(): string {
  return localStorage.getItem('primaryColor') || '#017AFF'
}

const ThemeProvider = (props: any) => {
  const { setThemeMode } = useWeb3ModalTheme()
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>(
    getSystemTheme(),
  )
  const [primaryColor, setPrimaryColor] = useState<string>(
    getStoredPrimaryColor(),
  )
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(systemTheme)
  const [isCompact, setIsCompact] = useState<boolean>(getStoredIsCompact())

  useEffect(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        setSystemTheme(event.matches ? 'dark' : 'light')
      })
  }, [])

  const switchTheme = (theme: 'dark' | 'light' | 'system') => {
    localStorage.setItem('theme', theme)
    setTheme(theme)
  }

  const switchPrimaryColor = (color: string) => {
    storePrimaryColor(color)
    setPrimaryColor(color)
  }

  useEffect(() => {
    const setThemeFromLocalStore = () => {
      const _theme = localStorage.getItem('theme') as
        | 'dark'
        | 'light'
        | 'system'
      if (_theme) {
        switchTheme(_theme)
      } else {
        switchTheme(getSystemTheme())
      }
    }

    setThemeFromLocalStore()
  }, [])

  useEffect(() => {
    storeIsCompact(isCompact)
  }, [isCompact])

  let algorithm = [antdTheme.defaultAlgorithm]
  let isDark = false

  if (theme === 'system') {
    algorithm = [
      systemTheme === 'dark'
        ? antdTheme.darkAlgorithm
        : antdTheme.defaultAlgorithm,
    ]
    isDark = systemTheme === 'dark'
  } else if (theme === 'dark') {
    algorithm = [antdTheme.darkAlgorithm]
    isDark = true
  }

  if (isCompact) {
    algorithm.push(antdTheme.compactAlgorithm)
  }

  setThemeMode(isDark ? 'dark' : 'light')

  return (
    <ThemeContext.Provider
      value={{ theme, switchTheme, isCompact, setIsCompact, primaryColor, switchPrimaryColor }}
    >
      <ConfigProvider
        locale={en_US}
        theme={{
          token: {
            colorPrimary: primaryColor,
            borderRadius: 3,
          },
          algorithm,
        }}
        >
        <ProConfigProvider
          hashed={false}
          dark={isDark}
        >
          <App>
            {props.children}
          </App>
        </ProConfigProvider>
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

const useTheme = () => useContext(ThemeContext)

export { ThemeProvider, useTheme }
