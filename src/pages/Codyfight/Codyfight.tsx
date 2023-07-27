import React, { useState } from 'react'
import { formatRelative } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer, ProList } from '@ant-design/pro-components'
import { ICredentialIssuer, IDataStore, IDataStoreORM, UniqueVerifiableCredential } from '@veramo/core'
import { EllipsisOutlined } from '@ant-design/icons'
import IdentifierProfile from '../../components/IdentifierProfile'
import { getIssuerDID } from '../../utils/did'
import CredentialActionsDropdown from '../../components/CredentialActionsDropdown'
import { Button, notification } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import NewOperatorModalForm, {
  NewOperatorModalValues,
} from './NewOperatorModalForm'
import { GameAPI } from './lib/codyfight-game-client/src/GameApi'
import { createOperatorCredential, createProfileCredential } from './credentials'
import { OperatorSummary } from './OperatorSummary'


const Codyfight = () => {
  const navigate = useNavigate()
  const { agent } = useVeramo<IDataStoreORM & ICredentialIssuer & IDataStoreORM & IDataStore>()
  const [isNewGameModalVisible, setIsNewGameModalVisible] = useState(false)

  
  const { data: credentials, isLoading, refetch } = useQuery(
    ['credentials', { agentId: agent?.context.name }],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        where: [{
          column: 'type', value: ['VerifiableCredential,Codyfight,Operator']
        }],
        order: [{ column: 'issuanceDate', direction: 'DESC' }],
      }),
  )

  const handleNewOperatorOk = async (values: NewOperatorModalValues) => {
    setIsNewGameModalVisible(false)
    try {
      if (!agent) { return false }
      const api = new GameAPI()
      const game = await api.check(values.ckey)



      const identifier = await agent?.didManagerCreate({
        alias: game.players.bearer.name,
        provider: 'did:peer',
        options: {
          num_algo: 2,
          service: {
            id: '1234',
            type: 'DIDCommMessaging',
            serviceEndpoint: values.mediator,
            description: 'a DIDComm endpoint',
          },
        },
      })
      
      const profile = {
        id: identifier.did,
        name: game.players.bearer.name,
        picture: `https://codyfight.b-cdn.net/game/codyfighter/${game.players.bearer.codyfighter.type}.png` ,
      }

      const credential = await createOperatorCredential(agent, {ckey: values.ckey, id: identifier.did})
      const profileCredential = await createProfileCredential(agent, profile)
  
      if (credential && profileCredential) {
        await agent?.dataStoreSaveVerifiableCredential({
          verifiableCredential: credential,
        })
        await agent?.dataStoreSaveVerifiableCredential({
          verifiableCredential: profileCredential,
        })
          
        refetch()
        notification.success({
          message: 'Operator created',
        })
  
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message || e.message
      notification.error({
        message: 'Error creating game',
        description: msg ,
      })
    }




  }


  return (
    <PageContainer
    extra={[
      <Button
        key={'copy'}
        icon={<RobotOutlined />}
        type="text"
        title="New Game"
        onClick={() => setIsNewGameModalVisible(true)}
      />,
    ]}
    >
      <ProList
        ghost
        loading={isLoading}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
        }}
        grid={{ column: 1, lg: 2, xxl: 2, xl: 2 }}
        onItem={(record: any) => {
          return {
            onClick: (a) => {
              navigate('/codyfight/operator/' + record.hash)
            },
          }
        }}
        metas={{
          title: {},
          content: {},
          actions: {
            cardActionProps: 'extra',
          },
        }}
        dataSource={credentials?.map((item: UniqueVerifiableCredential) => {
          return {
            title: (
              <IdentifierProfile
                did={getIssuerDID(item.verifiableCredential)}
              />
            ),
            actions: [
              <div>
                {formatRelative(
                  new Date(item.verifiableCredential.issuanceDate),
                  new Date(),
                )}
              </div>,
              <CredentialActionsDropdown credential={item.verifiableCredential}>
                <EllipsisOutlined />
              </CredentialActionsDropdown>,
            ],
            content: (<OperatorSummary credential={item.verifiableCredential} />
            ),
            hash: item.hash,
            verifiableCredential: item.verifiableCredential,
          }
        })}
      />
      {agent?.availableMethods().includes('createVerifiableCredential') && (
        <NewOperatorModalForm
          visible={isNewGameModalVisible}
          onOk={handleNewOperatorOk}
          onCancel={() => {
            setIsNewGameModalVisible(false)
          }}
        />
      )}
    </PageContainer>
  )
}

export default Codyfight
