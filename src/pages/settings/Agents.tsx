import React, { useState } from 'react'
import { Button, Drawer, Tag, App } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import {
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { PageContainer, ProList } from '@ant-design/pro-components'
import md5 from 'md5'
import { Connect } from './Connect'
const GRAVATAR_URI = 'https://www.gravatar.com/avatar/'

export const Agents = () => {
  const { notification } = App.useApp()
  const { agents, removeAgent, activeAgentId, setActiveAgentId } = useVeramo()
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <PageContainer
      extra={[
        <Button
          key={'add'}
          icon={<PlusOutlined />}
          type="primary"
          
          title="Connect to a new agent"
          onClick={() => setDrawerOpen(true)}
        />,
      ]}
    >
      <ProList<{ title: string, id: string }>
        rowKey="id"
        ghost
        dataSource={agents.map((agent) => ({ 
          id: agent.context.id || '',
          description: agent.context.schema,
          avatar: agent?.context?.name && GRAVATAR_URI + md5(agent?.context?.name) + '?s=200&d=retro',
          title: agent.context.name || 'Empty',
          subTitle: agent.context.id === activeAgentId ? <Tag color='green'>Active</Tag> : null,
          actions: [
            agent.context.id !== 'web3Agent' && <Button
              icon={<DeleteOutlined />}
              type='text'
              danger
              onClick={() => {
                if (window.confirm(`Delete ${agent.context.name}?`)) {
                  removeAgent(agent.context.id || '')
                  notification.success({
                    message: 'Agent connection deleted',
                  })
                } 
              }}
            />,
          ]
        }))}
        metas={{
          id:{},
          title: {
            render: (text, record) => <a onClick={() => {
              if (record.id !== activeAgentId) {
                setActiveAgentId(record.id)
              }
            }
            }>{text}</a>,
          },
          description: {},
          avatar: {},
          actions: {},
          subTitle: {},
        }}
      />
      <Drawer
        title="Add new agent connection"
        placement={'right'}
        width={500}
        onClose={() => setDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <Connect onSuccess={() => setDrawerOpen(false)}/>
      </Drawer>
    </PageContainer>
  )
}
