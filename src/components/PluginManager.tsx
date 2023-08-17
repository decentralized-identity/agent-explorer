import React from 'react'
import { Button, Card, Input, List, Space, Switch, notification } from 'antd'
import { DeleteOutlined} from '@ant-design/icons'

import { usePlugins } from '../context/PluginProvider'


const ThemeSwitcher = () => {
  const { addPluginConfig, plugins, removePluginConfig, switchPlugin } = usePlugins()
  const [url, setUrl] = React.useState('')

  return (
    <Card title="Plugins">
      <List
        dataSource={plugins}
        renderItem={(item) => <List.Item
          actions={[
            <Switch checked={item.config.enabled} onChange={(checked) => switchPlugin(item.config.url, checked)} />,
            <Button
              icon={<DeleteOutlined />}
              danger
              type="text"
              onClick={() => {
                if (window.confirm(`Delete ${item.name}`)) {
                  removePluginConfig(item.config.url)
                  notification.success({
                    message: 'Identifier deleted',
                  })
                }
              }}
            />
          ]}
        ><List.Item.Meta
        title={item.name}
        description={item.description}
      /></List.Item>}
      />
      <Space.Compact style={{ width: '100%' }}>
      <Input 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
        />
      <Button 
        type="primary"
        onClick={() => {
          addPluginConfig({url, enabled: true})
          setUrl('')
        }}
        >Add</Button>
    </Space.Compact>
    </Card>
  )
}

export default ThemeSwitcher
