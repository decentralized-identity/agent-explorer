import React, { useState } from 'react'
import { Button, Card, List } from 'antd'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import IdentifierService from './IdentifierService'
import AddServiceModalForm, {
  AddServiceModalValues,
} from './AddServiceModalForm'

interface IdentifierModuleProps {
  title: string
  identifier: string
  cacheKey: any
}

const IdentifierServices: React.FC<IdentifierModuleProps> = ({
  title,
  identifier,
  cacheKey,
}) => {
  const { agent } = useVeramo()
  const { data, isLoading } = useQuery(
    [cacheKey],
    () => agent?.resolveDid({ didUrl: identifier }),
    { enabled: !!identifier },
  )
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = (values: AddServiceModalValues) => {
    agent?.didManagerAddService({ did: identifier, service: values })
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <Card
      title={title}
      style={{ flexWrap: 'wrap' }}
      loading={isLoading}
      actions={[<Button onClick={() => showModal()}>Add Service</Button>]}
    >
      <AddServiceModalForm
        visible={isModalVisible}
        onAdd={handleOk}
        onCancel={() => {
          handleCancel()
        }}
      />
      <List
        dataSource={(data as any)?.service}
        renderItem={(item: any, i: number) => {
          return <IdentifierService i={i} item={item} did={(data as any).id} />
        }}
      ></List>
    </Card>
  )
}

export default IdentifierServices
