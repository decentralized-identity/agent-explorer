import React, { useState } from 'react'
import { Button, Input, List, Space, Switch, App, Drawer, Typography } from 'antd'
import { DeleteOutlined, MenuOutlined, PlusOutlined} from '@ant-design/icons'
import { usePlugins } from '@veramo-community/agent-explorer-plugin'
import { PageContainer } from '@ant-design/pro-components'
import { DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
 } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { IAgentExplorerPlugin } from '@veramo-community/agent-explorer-plugin'

const communityPlugins: IAgentExplorerPlugin[] = [
  {
    config: {
      url: 'https://cdn.jsdelivr.net/gh/veramolabs/agent-explorer-plugin-brainshare@main/dist/plugin.js',
      enabled: true,
    },
    name: 'Brain share',
    description: 'Decentralized wiki',
    requiredMethods: [],
    routes: [],
    menuItems: [],
  },
  {
    config: {
      url: 'https://cdn.jsdelivr.net/gh/veramolabs/agent-explorer-plugin-social-feed/dist/plugin.js',
      enabled: true,
    },
    name: 'Social Feed',
    description: 'Decentralized reputation and social feed',
    requiredMethods: [],
    routes: [],
    menuItems: [],
  },
  {
    config: {
      url: 'https://cdn.jsdelivr.net/gh/veramolabs/agent-explorer-plugin-kudos/dist/plugin.js',
      enabled: true,
    },
    name: 'Kudos',
    description: 'Explore and give kudos',
    requiredMethods: [],
    routes: [],
    menuItems: [],
  },
  {
    config: {
      url: 'https://cdn.jsdelivr.net/gh/veramolabs/agent-explorer-plugin-graph-view/dist/plugin.js',
      enabled: true,
    },
    name: 'Graph View',
    description: 'Explore contacts and credentials in a graph view',
    requiredMethods: [],
    routes: [],
    menuItems: [],
  },
  {
    config: {
      url: 'https://cdn.jsdelivr.net/gh/veramolabs/agent-explorer-plugin-developer-tools/dist/plugin.js',
      enabled: true,
    },
    name: 'Developer Tools',
    description: 'Collection of tools for experimenting with verifiable data',
    requiredMethods: [],
    routes: [],
    menuItems: [],
  },
  {
    config: {
      url: 'https://cdn.jsdelivr.net/gh/simonas-notcat/agent-explorer-plugin-codyfight/dist/plugin.js',
      enabled: true,
    },
    name: 'Codyfight',
    description: 'AI Bot for Codyfight.com',
    requiredMethods: [],
    routes: [],
    menuItems: [],
  },
]

const SortableItem = ({ item }: { item: IAgentExplorerPlugin}) => {
  const { notification } = App.useApp()
  const { removePluginConfig, switchPlugin } = usePlugins()
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.config?.url || '' });
  const actions: React.ReactNode[] = []
  if (!item.config?.url.startsWith('core://')) {
    actions.push(<Button
      icon={<DeleteOutlined />}
      danger
      type="text"
      onClick={() => {
        if (window.confirm(`Delete ${item.name}`)) {
          removePluginConfig(item.config?.url || '')
          notification.success({
            message: 'Plugin removed',
          })
        }
      }}
    />)
  }

  actions.push(<Switch checked={item.config?.enabled} onChange={(checked) => switchPlugin(item.config?.url || '', checked)} />)
  actions.push(<MenuOutlined ref={setNodeRef} {...attributes} {...listeners} className="draggable-item"/>)
  return (
    <List.Item 
      ref={setNodeRef} 
      style={{ transform: CSS.Transform.toString(transform), transition }}
      actions={actions}
    ><List.Item.Meta
    title={item.name}
    description={item.description}
  />
  </List.Item>
  );
};

export const Plugins = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { addPluginConfig, plugins, updatePluginConfigs } = usePlugins()
  const [url, setUrl] = React.useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
  
    if (active.id !== over.id) {
      const activeIndex = plugins.findIndex((plugin) => plugin.config?.url === active.id);
      const overIndex = plugins.findIndex((plugin) => plugin.config?.url === over.id);
  
      if (activeIndex !== -1 && overIndex !== -1) {
        const reorderedPlugins = [...plugins];
        [reorderedPlugins[activeIndex], reorderedPlugins[overIndex]] = [reorderedPlugins[overIndex], reorderedPlugins[activeIndex]];
  
        updatePluginConfigs(reorderedPlugins.map((plugin) => plugin.config || {url: '', enabled: true}));
      }
    }
  };

  
  
  return (
    <DndContext 
      onDragEnd={handleDragEnd} 
      sensors={sensors}
      collisionDetection={closestCenter}
    >
      <PageContainer
        extra={[
          <Button
            key={'add'}
            icon={<PlusOutlined />}
            type="primary"
            title="Add new external plugin"
            onClick={() => setDrawerOpen(true)}
          >Add</Button>,
        ]}
      >

        <SortableContext 
          items={plugins.map((plugin) => plugin.config?.url || '')} 
          strategy={verticalListSortingStrategy}
          >
          <List
            dataSource={plugins}
            renderItem={(item) => <SortableItem item={item} key={item.config?.url}/>}
          />
        </SortableContext>
        <DragOverlay />

        <Drawer
          title="Add external plugin"
          placement={'right'}
          width={500}
          onClose={() => setDrawerOpen(false)}
          open={isDrawerOpen}
        > 
          <Space direction='vertical' style={{width: '100%'}}>
            <Typography.Title level={5}>Community plugins</Typography.Title>
              <List
                dataSource={communityPlugins}
                renderItem={(item) => <List.Item 
                    actions={[
                      <Button 
                      type="primary"
                      disabled={plugins.find((plugin) => plugin.config?.url === item.config?.url) !== undefined}
                      onClick={() => {
                        setDrawerOpen(false)
                        addPluginConfig({url: item.config?.url || '', enabled: true})
                        setUrl('')
                      }}
                      >Add</Button>
                    ]}
                    ><List.Item.Meta
                    title={item.name}
                    description={item.description}
                />
              </List.Item>}
              />
            <Typography.Title level={5}>Custom plugin</Typography.Title>            
            <Space.Compact style={{ width: '100%' }}>
              <Input 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/plugin.js"
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
          </Space>       
        </Drawer>
      </PageContainer>
    </DndContext>
  )
}

