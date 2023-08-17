import React from 'react'
import { Button, Card, Input, List, Space } from 'antd'
import { usePlugins } from '../context/PluginProvider'


const ThemeSwitcher = () => {
  const { addPluginUrl, pluginUrls, removePluginUrl } = usePlugins()
  const [url, setUrl] = React.useState('')

  return (
    <Card title="Plugins">
      <List
        dataSource={pluginUrls}
        renderItem={(item) => <List.Item
          actions={[
            <Button 
              type="text" 
              danger 
              onClick={() => removePluginUrl(item)}
              >Remove</Button>
          ]}
        >{item}</List.Item>}
      />
      <Space.Compact style={{ width: '100%' }}>
      <Input 
        defaultValue="https://example.com/plugin.js" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
        />
      <Button 
        type="primary"
        onClick={() => {
          addPluginUrl(url)
          setUrl('')
        }}
        >Add</Button>
    </Space.Compact>
    </Card>
  )
}

export default ThemeSwitcher
