import React from 'react'
import { formatRelative } from 'date-fns'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer, ProList } from '@ant-design/pro-components'
import { VerifiableCredential } from '@veramo-community/react-components'
import { IDataStore, IDataStoreORM, UniqueVerifiableCredential } from '@veramo/core'
import { AppstoreOutlined, EllipsisOutlined, UnorderedListOutlined } from '@ant-design/icons'
import IdentifierProfile from '../../components/IdentifierProfile'
import { getIssuerDID } from '../../utils/did'
import CredentialActionsDropdown from '../../components/CredentialActionsDropdown'
import { Drawer, List, Radio } from 'antd'
import { CredentialSummary } from '../../components/CredentialSummary'
import CredentialTabs from '../../components/CredentialTabs'

const Credentials = () => {
  const navigate = useNavigate()
  const { hash } = useParams<{ hash: string }>()
  const { agent } = useVeramo<IDataStoreORM & IDataStore>()
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [listType, setListType] = React.useState<'table' | 'card'>('table')

  const { data: credentials, isLoading } = useQuery(
    ['credentials', {page, pageSize, agentId: agent?.context.name }],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        order: [{ column: 'issuanceDate', direction: 'DESC' }],
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
  )

  const { data: credentialsCount } = useQuery(
    ['credentialsCount', { agentId: agent?.context.name }],
    () =>
      agent?.dataStoreORMGetVerifiableCredentialsCount(),
  )

  const { data: credential, isLoading: isLoadingCredential } = useQuery(
    ['credential', { hash,  agentId: agent?.context.name }],
    () =>agent?.dataStoreGetVerifiableCredential({ hash: hash as string }),
    {
      enabled: !!hash,
    }
  )
  

  return (
    <PageContainer
    title="Credentials"
      extra={[
        <Radio.Group value={listType} onChange={ (e) => setListType(e.target.value) }>
          <Radio.Button value="table"><UnorderedListOutlined /></Radio.Button>
          <Radio.Button value="card"><AppstoreOutlined /></Radio.Button>
        </Radio.Group>
      ]}
    >
      {listType === 'table' && <List
        itemLayout="vertical"
        size="large"
        pagination={{
          position: 'both',
          pageSize: pageSize,
          current: page,
          total: credentialsCount,
          showSizeChanger: true,
          onChange(page, pageSize) {
            setPage(page)
            setPageSize(pageSize)
          },
        }}
        dataSource={credentials}
        renderItem={(item) => (
          <CredentialSummary
            key={item.hash}
            credential={item}
            onClick = {() => {
              navigate('/credentials/' + item.hash)
            }}
          />
        )}
      />}

      {listType === 'card' && <ProList
        ghost
        loading={isLoading}
        pagination={{
          //@ts-ignore
          position: 'both',
          pageSize: pageSize,
          current: page,
          total: credentialsCount,
          onChange(page, pageSize) {
            setPage(page)
            setPageSize(pageSize)
          },
          showSizeChanger: true,
        }}
        grid={{ column: 1, lg: 2, xxl: 2, xl: 2 }}
        onItem={(record: any) => {
          return {
            onClick: () => {
              navigate('/credentials/' + record.hash)
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
                <VerifiableCredential credential={item.verifiableCredential} />
              </div>
            ),
            hash: item.hash,
          }
        })}
      />}
        <Drawer
          title="Credential"
          placement={'right'}
          width={800}
          onClose={() => navigate('/credentials')}
          open={!!hash}
        >
          {!isLoadingCredential && credential && <CredentialTabs credential={credential} />}
        </Drawer>
    </PageContainer>
  )
}

export default Credentials
