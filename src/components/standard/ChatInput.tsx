import React, { useState } from 'react'
import { Input, Button, Row, Modal, Table, Tag } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { useVeramo } from '@veramo-community/veramo-react'
import { useChat } from '../../context/ChatProvider'
import { useQuery } from 'react-query'
import { v4 } from 'uuid'
import { useHistory } from 'react-router-dom'
import { UniqueVerifiableCredential } from '@veramo/data-store'
import { signVerifiablePresentation } from '../../utils/signing'

const { TextArea } = Input

interface ChatInputProps {
  viewer: string
  recipient?: string
  threadId: string
}

const ChatInput: React.FC<ChatInputProps> = ({
  viewer,
  recipient: existingRecipient,
  threadId,
}) => {
  const [message, setMessage] = useState<string>()
  const [profileCredential, setProfileCredential] = useState<any>()
  const { agent } = useVeramo()
  const { composing, setComposing, newRecipient, setNewRecipient } = useChat()
  const recipient = existingRecipient || newRecipient
  const history = useHistory()
  const _threadId = threadId === 'new-thread' ? v4() : threadId

  const sendMessage = async (msg: string, attachment?: any) => {
    await agent?.sendMessageDIDCommAlpha1({
      data: {
        id: _threadId,
        from: viewer as string,
        to: recipient as string,
        type: 'veramo.io-chat-v1',
        body: {
          message: msg,
          attachment: attachment,
        },
        // @ts-ignore
        iat: new Date().getTime(),
      },
      save: true,
    })

    setMessage('')

    if (composing) {
      setNewRecipient('')
      setComposing(false)

      history.push('/chats/threads/' + _threadId)
    }
  }

  const columns = [
    {
      title: 'Issuer',
      dataIndex: 'verifiableCredential',
      render: (verifiableCredential: any) => verifiableCredential.issuer.id,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: 'Subject',
      dataIndex: 'verifiableCredential',
      render: (verifiableCredential: any) =>
        verifiableCredential.credentialSubject.id,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: 'Type',
      dataIndex: 'verifiableCredential',
      render: (verifiableCredential: any) =>
        verifiableCredential.type.map((type: string, i: number) => (
          <Tag color="geekblue" key={i}>
            {type}
          </Tag>
        )),
      responsive: ['lg'],
      width: 200,
    },
  ]

  const [isModalVisible, setIsModalVisible] = useState(false)
  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const handleOk = async () => {
    setIsModalVisible(false)

    const profilePresentation = await agent?.createVerifiablePresentation({
      presentation: {
        holder: viewer,
        verifier: [],
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://example.com/1/2/3',
        ],
        type: ['VerifiablePresentation', 'Custom'],
        issuanceDate: new Date().toISOString(),
        verifiableCredential: [profileCredential],
      },
      proofFormat: 'jwt',
    })

    const signedPresentation = await signVerifiablePresentation(
      agent,
      viewer,
      [viewer],
      profilePresentation,
      'jwt',
    )

    console.log(signedPresentation)

    sendMessage('Attached Profile', signedPresentation)
  }

  const { data: credentials, isLoading } = useQuery(
    ['credentials', { agentId: agent?.context.name }],
    () => agent?.dataStoreORMGetVerifiableCredentials(),
  )

  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: UniqueVerifiableCredential[],
    ) => {
      setProfileCredential(selectedRows[0].verifiableCredential)
    },
  }

  return (
    <div>
      <Row
        style={{
          flexFlow: 'nowrap',
          background: '#eaeaea',
          padding: 20,
          position: 'absolute',
          bottom: 30,
          left: 0,
          right: 0,
          height: 120,
        }}
      >
        <TextArea
          style={{ marginRight: 20 }}
          placeholder={`Sending from ` + viewer}
          autoSize
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          disabled={!message || !recipient}
          type="link"
          icon={<SendOutlined style={{ fontSize: 28 }} />}
          onClick={() => message && sendMessage(message)}
        />
      </Row>
      <Row
        style={{
          flexFlow: 'nowrap',
          background: '#eaeaea',
          padding: 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
        }}
      >
        <Button disabled={false} type="link" onClick={showModal}>
          Attach a verifiable profile
        </Button>
      </Row>
      <Modal
        title="Verifiable Profiles"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <Table
          loading={isLoading}
          rowKey={(record) => record.hash}
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          dataSource={credentials}
          // bordered
          // @ts-ignore
          columns={columns}
        />
      </Modal>
    </div>
  )
}

export default ChatInput
