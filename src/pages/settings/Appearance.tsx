import React from 'react'
import { Checkbox, Radio, Space } from 'antd'
import { useTheme } from '../../context/ThemeProvider'
import { PageContainer } from '@ant-design/pro-components'

const themes = [
  {
    name: 'light',
    label: 'Light theme',
  },
  {
    name: 'dark',
    label: 'Dark theme',
  },
  {
    name: 'system',
    label: 'Follow System settings',
  },
]

export const Appearance = () => {
  const { theme, switchTheme, isCompact, setIsCompact } = useTheme()
  return (
    <PageContainer>
      <Space direction='vertical'>

      <Radio.Group value={theme} onChange={(e) => switchTheme(e.target.value)}>
        <Space direction="vertical">
          {themes.map((themeOptions) => {
            return (
              <Radio key={themeOptions.name} value={themeOptions.name}>
                {themeOptions.label}
              </Radio>
            )
          })}
        </Space>
      </Radio.Group>

        <Checkbox
          onChange={(e) => setIsCompact(e.target.checked)}
          checked={isCompact}
          >
          Compact mode
        </Checkbox>
            </Space>
    </PageContainer>
  )
}


