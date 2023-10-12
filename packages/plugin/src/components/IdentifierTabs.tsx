import React from 'react'
import { Tabs } from 'antd'
import { usePlugins } from '../PluginProvider.js'
import { IIdentifierTabsComponentProps } from '../types.js'

type IdentifierTabsProps = {
  did: string
}

export const IdentifierTabs: React.FC<IdentifierTabsProps> = ({
  did
}) => {

  const { plugins } = usePlugins()

  const tabComponents = React.useMemo(() => {
    let components: Array<{label: string, component: React.FC<IIdentifierTabsComponentProps>}> = []
    plugins.forEach((plugin) => {
      if (plugin.config?.enabled && plugin.getIdentifierTabsComponents) {
        const Components = plugin.getIdentifierTabsComponents()
        if (Components) {
          components = components.concat(Components)
        }
      }
    })
    return components
  }, [plugins])

  return (
    <Tabs 
      defaultActiveKey='0'
      items={
        tabComponents.map((component, index) => ({
          key: `${index}`,
          label: component.label,
          children: React.createElement(component.component, { did: did })
        }))   
      }
      
    />
      
  )
}
