/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { Table, Button, Row, Space, App, Drawer } from 'antd'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer, ProList } from '@ant-design/pro-components'
import { IDIDManager } from '@veramo/core-types'
import {
  NewIdentifierForm,
  NewIdentifierFormValues,
} from './NewIdentifierForm'
import { shortId } from '../../utils/did'
import { createMediateRequestMessage } from '@veramo/did-comm'
import { DeleteOutlined, CopyOutlined, PlusOutlined } from '@ant-design/icons'
import { IDataStore, IIdentifier } from '@veramo/core'
import IdentifierProfile from '../../components/IdentifierProfile'

export const ManagedIdentifiers = () => {
  const { notification } = App.useApp()
  const { agent } = useVeramo<IDIDManager & IDataStore>()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { data: providers } = useQuery(
    ['providers', { agentId: agent?.context.id }],
    () => agent?.didManagerGetProviders(),
  )
  const { data: identifiers, isLoading, refetch} = 
    useQuery(['identifiers', { agentId: agent?.context.id }], () =>
      agent?.didManagerFind(),
    )

    const handleNewIdentifierOk = async (values: NewIdentifierFormValues) => {
      setDrawerOpen(false)
      const { alias, provider } = values
      let options = undefined
      if (provider === 'did:peer') {
        options = {
          num_algo: 2,
          service: {
            id: '1',
            type: 'DIDCommMessaging',
            serviceEndpoint: values.mediator,
            description: 'a DIDComm endpoint',
          },
        }
      }
      console.log({
        alias,
        provider,
        options,
      })
      const identifier = await agent?.didManagerCreate({
        alias,
        provider,
        options,
      })
      if (!identifier) return
  
      if (provider === 'did:peer' && values.mediator) {
        const message = createMediateRequestMessage(
          identifier.did,
          values.mediator,
        )
  
        const stored = await agent?.dataStoreSaveMessage({ message })
        console.log('stored?: ', stored)
  
        const packedMessage = await agent?.packDIDCommMessage({
          packing: 'authcrypt',
          message,
        })
  
        // requests mediation, and then message handler adds service to DID
        const result = await agent?.sendDIDCommMessage({
          packedMessage,
          messageId: message.id,
          recipientDidUrl: values.mediator,
        })
        console.log('result: ', result)
      }

      if (values.name || values.email || values.bio || values.github || values.twitter || values.picture) {
        const credentialSubject: any = {
          id: identifier.did,
        }
        if (values.name) credentialSubject['name'] = values.name
        if (values.email) credentialSubject['email'] = values.email
        if (values.bio) credentialSubject['bio'] = values.bio
        if (values.github) credentialSubject['github'] = values.github
        if (values.twitter) credentialSubject['twitter'] = values.twitter
        if (values.picture) credentialSubject['picture'] = values.picture
        const credential = await agent?.createVerifiableCredential({
          credential: {
            issuer: { id: identifier.did },
            issuanceDate: new Date().toISOString(),
            type: ['VerifiableCredential', 'Profile'],
            credentialSubject,
          },
          proofFormat: 'jwt',
        })
        if (credential) {
          await agent?.dataStoreSaveVerifiableCredential({
            verifiableCredential: credential,
          })
        }

      }
  
      
      refetch()
    }

  return (
      <PageContainer
        extra={[
          <Button
            key={'add'}
            icon={<PlusOutlined />}
            type="primary"
            title="Create new identifier"
            onClick={() => setDrawerOpen(true)}
          >New</Button>,
        ]}
      >
      {identifiers !== undefined && <ProList<{ title: string, id: string }>
        rowKey="id"
        ghost
        pagination={{
          pageSize: 15,
          showTitle: false,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        loading={isLoading}
        dataSource={identifiers && identifiers.map((identifier) => ({ 
          id: identifier.did,
          title: identifier.alias || shortId(identifier.did),
          actions: [
            <Button
              icon={<DeleteOutlined />}
              type='text'

              onClick={() => {
                if (window.confirm(`Delete ${identifier.did}?`)) {

                  notification.success({
                    message: `${identifier.did} deleted`,
                  })
                } 
              }}
            />,
          ]
        }))}
        metas={{
          id:{},
          title: {
            render: (text, record) =>  <Link to={'/identifiers/' + encodeURIComponent(record.id)}>
            <IdentifierProfile did={record.id} />
          </Link>,
          },
          actions: {},
        }}
      />}
      <Drawer
          title="Create new identifier"
          placement={'right'}
          width={500}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
        >
          {providers && <NewIdentifierForm
            providers={providers}
            onNewIdentifier={handleNewIdentifierOk}
        />}
        </Drawer>
    </PageContainer>
  )
}

export default ManagedIdentifiers
