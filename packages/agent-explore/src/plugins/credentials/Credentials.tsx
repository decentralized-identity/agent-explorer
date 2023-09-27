import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer } from '@ant-design/pro-components'
import { IDataStore, IDataStoreORM } from '@veramo/core'
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { CredentialSummary, VerifiableCredentialComponent } from '@veramo-community/agent-explorer-plugin'
import { Drawer, List, Radio } from 'antd'
import CredentialTabs from '../../components/CredentialTabs'

const Credentials = () => {
  const navigate = useNavigate()
  const { hash } = useParams<{ hash: string }>()
  const { agent } = useVeramo<IDataStoreORM & IDataStore>()
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [listType, setListType] = React.useState<'table' | 'card'>('table')

  const { data: credentials } = useQuery(
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
        <Radio.Group 
          key='1' 
          value={listType} 
          onChange={ (e) => setListType(e.target.value) }
        >
          <Radio.Button value="table"><UnorderedListOutlined /></Radio.Button>
          <Radio.Button value="card"><AppstoreOutlined /></Radio.Button>
        </Radio.Group>
      ]}
    >
      <List
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
          listType === 'table' ? <CredentialSummary
            key={item.hash}
            credential={item}
            onClick = {() => {
              navigate('/credentials/' + item.hash)
            }}
          /> 
          : <div style={{ width: '100%', marginBottom: 20 }}>
          <VerifiableCredentialComponent credential={item} />
        </div>
        )}
      />

      
        <Drawer
          title="Credential"
          placement={'right'}
          width={800}
          onClose={() => navigate('/credentials')}
          open={!!hash}
        >
          {!isLoadingCredential && hash && credential && <CredentialTabs uniqueCredential={{hash, verifiableCredential: credential}} />}
        </Drawer>
    </PageContainer>
  )
}

export default Credentials
