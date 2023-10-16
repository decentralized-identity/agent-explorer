import React, { useState } from 'react'
import { Button, Modal, List, Space } from 'antd'
import { CloudServerOutlined, DeleteOutlined } from '@ant-design/icons'
import { useVeramo } from '@veramo-community/veramo-react'
import { useNavigate } from 'react-router'

interface IdentifierModuleProps {
  i: number
  item: any
  did: string
  isManaged?: boolean
}

const IdentifierServices: React.FC<IdentifierModuleProps> = ({
  i,
  item,
  did,
  isManaged = false,
}) => {
  const { agent, agents } = useVeramo()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const navigate = useNavigate()

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    agent?.didManagerRemoveService({ did, id: item.id })
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const serviceEndpoint = item.serviceEndpoint[0]?.uri || item.serviceEndpoint

  const actions: React.ReactNode[] = []

  if (item.type === 'VeramoAgentSchema') {
    actions.push(
      <Button
        type='primary'
        disabled={!!agents.find((a) => a.context.schema === item.serviceEndpoint)}
        onClick={() => {
          navigate('/settings/agents/'+ encodeURIComponent(item.serviceEndpoint))
        }}
      >Connect</Button>,
    )
  }

  if (isManaged) {
    actions.push(
      <Button
        type='text'
        icon={<DeleteOutlined />}
        disabled={false /* check if current agent controls this DID */}
        onClick={() => {
          console.log('remove service')
          showModal()
        }}
      />,
    )
  }

  return (
    <List.Item
      key={i}
      actions={actions}
    >
      <Space direction='vertical' style={{overflow: 'hidden', width: '100%'}}>
        <List.Item.Meta
          avatar={<CloudServerOutlined />}
          title={item.type}
          description={`${item.description} - ${serviceEndpoint}`}
          />
      </Space>
      <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okType="danger"
      >
        <p>Are you sure you want to remove this service?</p>
      </Modal>
    </List.Item>
  )
}

export default IdentifierServices
