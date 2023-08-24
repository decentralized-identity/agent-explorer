import { Dropdown } from 'antd'
import React from 'react'
import { useVeramo } from '@veramo-community/veramo-react'
import { useNavigate } from 'react-router-dom'

const AgentDropdown: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { agents, setActiveAgentId, activeAgentId } = useVeramo()
  const navigate = useNavigate()
  return (
    <Dropdown
      
      menu={{
        selectedKeys: activeAgentId ? [activeAgentId] : [],
        items: [
          ...agents.map((_agent: any) => {
            return {
              key: _agent.context?.id,
              onClick: () => setActiveAgentId(_agent.context?.id),
              label: _agent.context?.name,
            }
          }),
          ...[
            { type: 'divider' as const },
            {
              key: 'manage',
              label: 'Magage',
              onClick: () => navigate('/settings/agents'),
            },
          ],
        ],
      }}
    >
      {children}
    </Dropdown>
  )
}
export default AgentDropdown
