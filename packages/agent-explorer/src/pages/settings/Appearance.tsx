import React from 'react'
import { Button, Checkbox, Radio, Space, Typography } from 'antd'
import { useTheme } from '../../context/ThemeProvider'
import { PageContainer } from '@ant-design/pro-components'

const colors = [
  '#017AFF',
  '#A54FA6',
  '#F74F9E',
  '#FE5258',
  '#F7821A',
  '#FFC600',
  '#62BA46',
  '#8C8B8C',
]

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
  const { theme, switchTheme, isCompact, setIsCompact, switchPrimaryColor, primaryColor } = useTheme()
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

        <Typography.Title level={5}>Accent color</Typography.Title>
        <Space>
          {colors.map((color) => <Button 
            shape='circle'
            key={color}
            type={color === primaryColor ? 'dashed' : 'primary'}
            onClick={() => switchPrimaryColor(color)}
            style={{backgroundColor: color}}
            size='small'
          />)}
        </Space>
      </Space>
    </PageContainer>
  )
}


