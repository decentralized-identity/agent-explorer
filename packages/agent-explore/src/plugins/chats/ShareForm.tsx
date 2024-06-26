/* eslint-disable */
import { App, Button, Space, Tabs, Typography, theme } from 'antd'
import React, { useState, useEffect } from 'react'
import { useVeramo } from '@veramo-community/veramo-react'
import { ICredentialIssuer, IDIDManager, IDataStore, IDataStoreORM, IMessage, ProofFormat, TAgent } from '@veramo/core'
import { MarkDown, ActionButton, DIDDiscoveryBar, IdentifierProfile } from '@veramo-community/agent-explorer-plugin'
import Editor from '@monaco-editor/react';
import { ResponsiveContainer } from '../../components/ResponsiveContainer'
import { v4 } from 'uuid'
import { useNavigate } from 'react-router'
import { computeEntryHash } from '@veramo/utils'


export const ShareForm: React.FC = () => {
  const token = theme.useToken()

console.log('here')
  const [message, setMessage] = useState<string>(window.localStorage.getItem('bs-post') || '')
  const attachment = window.localStorage.getItem('attachment')
  const { notification } = App.useApp()
  const navigate = useNavigate()

  const [isSending, setIsSending] = useState<boolean>(false)
  const [recepient, setRecepient] = useState<string | undefined>()


  useEffect(() => {
    window.localStorage.setItem('bs-post', message)
  }, [message])

  console.log("attachment: ", attachment)

  const handleSend = async (did: string, issuerAgent: TAgent<ICredentialIssuer & IDataStore>) => {
    setIsSending(true)
    try {
      const messageId = v4()

      const parsedAttachment = JSON.parse(attachment!)!
      const canonicalCredential = parsedAttachment?.proof?.type === 'JwtProof2020' &&
      typeof parsedAttachment?.proof?.jwt === 'string'
        ? parsedAttachment?.proof?.jwt
        : parsedAttachment
      const threadId = computeEntryHash(canonicalCredential)
      const shareMessage = {
        type: 'https://didcomm.org/basicmessage/2.0/message',
        from: did,
        created_time: new Date().getTime(),
        to: recepient,
        id: messageId,
        thid: threadId,
        body: { content: message },
        attachments: [{
          media_type: 'credential+ld+json',
          data: { json: JSON.parse(attachment!) }
        }]
      }
      const packedMessage = await issuerAgent.packDIDCommMessage({ 
        message: shareMessage, 
        packing: 'authcrypt' 
      })

      const res = await issuerAgent.sendDIDCommMessage({ 
        packedMessage: packedMessage!, 
        messageId: shareMessage.id, 
        recipientDidUrl: recepient! 
      })

      await issuerAgent.dataStoreSaveMessage({ message: {
        type: 'https://didcomm.org/basicmessage/2.0/message',
        from: did,
        to: recepient,
        id: threadId,
        threadId: threadId,
        data: { content: message }
      } })

      notification.success({
        message: 'Message sent'
      })

      navigate(`/chats/${threadId}`)


    } catch (e) {
      console.error(e)
    }
    setIsSending(false)
  }

  return (
    <ResponsiveContainer>
    <Space direction='vertical' style={{ width: '100%' }}>
    <Tabs
      defaultActiveKey='2'
      items={[
        {
          key: '1',
          label: 'Edit',
          children: (
            <Space direction='vertical' style={{width: '100%'}}>
              <Editor
                theme={token.theme.id === 4 ? 'vs-dark' : 'light'}
                height="50vh"
                options={{
                  lineNumbers: 'off',
                  wordWrap: 'on',
                  fontSize: 14,
                  minimap: { enabled: false },
                }}
                defaultLanguage="markdown"
                defaultValue={message}
                value={message}
                onChange={(e) => {
                  setMessage(e || '')
                }}
              />
            </Space>
          )
        },
        {
          key: '2',
          label: 'Preview',
          children: <MarkDown content={message}/>
        },
        ]}
    />
      <Space direction='vertical'>
        <Typography.Text strong>Share with:</Typography.Text>
        {!recepient && <DIDDiscoveryBar 
          handleSelect={setRecepient}
        />}
        {recepient && <Button 
          type='text' 
          style={{height: 60}}
          onClick={() => setRecepient(undefined)}>
            <IdentifierProfile hidePopover did={recepient}/>
        </Button>}

        <ActionButton 
          title='Send as:' 
          disabled={message==='' || !recepient || isSending} 
          onAction={handleSend}
          showDefaultAgentName={false}
          ifentifierFilter={(identifier) => identifier.keys.find(
            (key) => key.type === 'X25519' || key.type === 'Ed25519') !== undefined
          }
          />

      </Space>
    </Space>
    </ResponsiveContainer>
  )
}
