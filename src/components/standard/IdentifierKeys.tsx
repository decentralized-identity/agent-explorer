import React, { useState } from 'react'
import { Button, Card, List, message } from 'antd'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import IdentifierKey from './IdentifierKey'
import AddKeyModalForm, { AddKeyModalValues } from './AddKeyModalForm'
import { TKeyType } from '@veramo/core'

interface IdentifierModuleProps {
  title: string
  identifier: string
  cacheKey: any
}

const IdentifierKeys: React.FC<IdentifierModuleProps> = ({
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

  const handleOk = (values: AddKeyModalValues) => {
    agent?.didManagerAddKey({
      did: identifier,
      key: { ...values, type: values.type as TKeyType },
    })
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
      actions={[<Button onClick={() => showModal()}>Add Key</Button>]}
    >
      <AddKeyModalForm
        visible={isModalVisible}
        onAdd={handleOk}
        onCancel={() => {
          handleCancel()
        }}
      />
      <List
        dataSource={
          data?.didDocument?.verificationMethod || data?.didDocument?.publicKey
        }
        renderItem={(item: any, i: number) => {
          return (
            <IdentifierKey i={i} item={item} did={data?.didDocument?.id!} />
          )
        }}
      ></List>
    </Card>
  )
}

export default IdentifierKeys
