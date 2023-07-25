import React, { useState } from 'react'
import { formatRelative } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer, ProList } from '@ant-design/pro-components'
import { VerifiableCredential as VerifiableCredentialCard } from '@veramo-community/react-components'
import { ICredentialIssuer, IDataStore, IDataStoreORM, UniqueVerifiableCredential, VerifiableCredential } from '@veramo/core'
import { EllipsisOutlined } from '@ant-design/icons'
import IdentifierProfile from '../../components/IdentifierProfile'
import { getIssuerDID } from '../../utils/did'
import CredentialActionsDropdown from '../../components/CredentialActionsDropdown'
import { Button, notification } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import NewGameModalForm, {
  NewGameModalValues,
} from './InitGameModalForm'
import { GameAPI } from './lib/codyfight-game-client/src/GameApi'

const Codyfight = () => {
  const navigate = useNavigate()
  const { agent } = useVeramo<IDataStoreORM & ICredentialIssuer & IDataStoreORM & IDataStore>()

  const [isNewGameModalVisible, setIsNewGameModalVisible] = useState(false)

  const { data: credentials, isLoading, refetch } = useQuery(
    ['credentials', { agentId: agent?.context.name }],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        where: [{
          column: 'type', value: ['VerifiableCredential,Codyfight,InitGame']
        }],
        order: [{ column: 'issuanceDate', direction: 'DESC' }],
      }),
  )

  const handleNewIdentifierOk = async (values: NewGameModalValues) => {
    setIsNewGameModalVisible(false)
    try {

      const api = new GameAPI()
      const game = await api.init(values.ckey, values.mode)

      const credential = await agent?.createVerifiableCredential({
        credential: {
          type: ['VerifiableCredential', 'Codyfight', 'InitGame'],
          issuer: { id: values.identifier },
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            ckey: values.ckey,
            mode: values.mode,
            game,
          },
        },
        proofFormat: 'jwt',
      })
  
      if (credential) {
        const result = await agent?.dataStoreSaveVerifiableCredential({
          verifiableCredential: credential,
        })
          
        refetch()
        notification.success({
          message: 'Game created',
        })
        navigate('/codyfight/game/' + result)
  
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
            onClick: () => {
              navigate('/codyfight/game/' + record.hash)
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
            content: (
              <div style={{ width: '100%' }}>
                <VerifiableCredentialCard credential={item.verifiableCredential} />
              </div>
            ),
            hash: item.hash,
          }
        })}
      />
      {agent?.availableMethods().includes('createVerifiableCredential') && (
        <NewGameModalForm
          visible={isNewGameModalVisible}
          onNewGame={handleNewIdentifierOk}
          onCancel={() => {
            setIsNewGameModalVisible(false)
          }}
        />
      )}
    </PageContainer>
  )
}

export default Codyfight
