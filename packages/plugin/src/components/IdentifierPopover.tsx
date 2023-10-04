import React, { PropsWithChildren } from 'react'
import { Typography, Popover, Space } from 'antd'
import { shortId } from '../utils/did.js'
import { usePlugins } from '../PluginProvider.js'
import { IIdentifierHoverComponentProps } from '../types.js'

type IdentifierProfileProps = PropsWithChildren <{
  did: string
}>

export const IdentifierPopover: React.FC<IdentifierProfileProps> = ({
  did,
  children,
}) => {

  const { plugins } = usePlugins()

  const hoverComponents = React.useMemo(() => {
    let components: React.FC<IIdentifierHoverComponentProps>[] = []
    plugins.forEach((plugin) => {
      if (plugin.config?.enabled && plugin.getIdentifierHoverComponent) {
        const Component = plugin.getIdentifierHoverComponent()
        if (Component) {
          components.push(Component)
        }
      }
    })
    return components
  }, [plugins])

  return (
    <Popover 
      content={
      <Space direction='vertical'>
        {hoverComponents.map((Component, index) => (
          React.createElement(Component, { key: index, did: did })
        ))}
        <Typography.Text type="secondary">
          {shortId(did)}
        </Typography.Text>
      </Space>
    }>
      {children}
    </Popover>
  )
}
