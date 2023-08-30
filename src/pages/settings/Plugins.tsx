import React, { useState } from 'react'
import { Button, Input, List, Space, Switch, App, Drawer } from 'antd'
import { DeleteOutlined, MenuOutlined, PlusOutlined} from '@ant-design/icons'
import { usePlugins } from '../../context/PluginProvider'
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
import { AgentPlugin } from '../../types'

const SortableItem = ({ item }: { item: AgentPlugin}) => {
  const { notification } = App.useApp()
  const { removePluginConfig, switchPlugin } = usePlugins()
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.config.url });
  const actions: React.ReactNode[] = []
  if (!item.config.url.startsWith('core://')) {
    actions.push(<Button
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
    />)
  }

  actions.push(<Switch checked={item.config.enabled} onChange={(checked) => switchPlugin(item.config.url, checked)} />)
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
      const activeIndex = plugins.findIndex((plugin) => plugin.config.url === active.id);
      const overIndex = plugins.findIndex((plugin) => plugin.config.url === over.id);
  
      if (activeIndex !== -1 && overIndex !== -1) {
        const reorderedPlugins = [...plugins];
        [reorderedPlugins[activeIndex], reorderedPlugins[overIndex]] = [reorderedPlugins[overIndex], reorderedPlugins[activeIndex]];
  
        updatePluginConfigs(reorderedPlugins.map((plugin) => plugin.config));
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
          />,
        ]}
      >

        <SortableContext 
          items={plugins.map((plugin) => plugin.config.url)} 
          strategy={verticalListSortingStrategy}
          >
          <List
            dataSource={plugins}
            renderItem={(item) => <SortableItem item={item} key={item.config.url}/>}
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
    </DndContext>
  )
}

