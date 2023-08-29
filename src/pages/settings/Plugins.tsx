import React, { useState } from 'react'
import { Button, Input, List, Space, Switch, App, Drawer } from 'antd'
import { DeleteOutlined, PlusOutlined} from '@ant-design/icons'
import { usePlugins } from '../../context/PluginProvider'
import { PageContainer } from '@ant-design/pro-components'

export const Plugins = () => {
  const { notification } = App.useApp()
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { addPluginConfig, plugins, removePluginConfig, switchPlugin } = usePlugins()
  const [url, setUrl] = React.useState('')

  return (
    <PageContainer
      extra={[
        <Button
          key={'add'}
          icon={<PlusOutlined />}
          type="primary"
          title="Add new external plugin"
          onClick={() => setDrawerOpen(true)}
        />,
      ]}
    >
      <List
        dataSource={plugins}
        renderItem={(item) => <List.Item
          actions={[
            <Switch checked={item.config.enabled} onChange={(checked) => switchPlugin(item.config.url, checked)} />,
            !item.config.url.startsWith('core://') && <Button
              icon={<DeleteOutlined />}
              danger
              type="text"
              onClick={() => {
                if (window.confirm(`Delete ${item.name}`)) {
                  removePluginConfig(item.config.url)
                  notification.success({
                    message: 'Plugin removed',
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

      <Drawer
        title="Add external plugin"
        placement={'right'}
        width={500}
        onClose={() => setDrawerOpen(false)}
        open={isDrawerOpen}
      >        
        <Space.Compact style={{ width: '100%' }}>
          <Input 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            />
          <Button 
            type="primary"
            onClick={() => {
              setDrawerOpen(false)
              addPluginConfig({url, enabled: true})
              setUrl('')
            }}
            >Add</Button>
        </Space.Compact>
      </Drawer>
    </PageContainer>
  )
}

