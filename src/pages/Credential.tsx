import React from 'react'
import { Typography, Layout, Tabs } from 'antd'
import Page from '../layout/Page'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import JsonBlock from '../components/standard/Json'
import CredentialInfo from '../components/standard/CredentialInfo'
import { VerifiableCredential } from '@veramo-community/react-components'

import '@veramo-community/react-components/dist/cjs/index.css'

const { Title } = Typography

const Credential = () => {
  const { id } = useParams<{ id: string }>()
  const { agent } = useVeramo()

  const { data: credential, isLoading: credentialLoading } = useQuery(
    ['credential', { id }],
    () => agent?.dataStoreGetVerifiableCredential({ hash: id }),
  )

  return (
    <Page
      name="credential"
      header={
        <Layout>
          <Title style={{ fontWeight: 'bold' }}>Verifiable Credential</Title>
        </Layout>
      }
    >
      {!credentialLoading && <Tabs>
        <Tabs.TabPane tab="Pretty" key="0">
          <VerifiableCredential credential={credential} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Info" key="1">
          <CredentialInfo credential={credential} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Data" key="2">
          <JsonBlock
            title="Raw JSON"
            data={credential}
            isLoading={credentialLoading}
          />
        </Tabs.TabPane>
      </Tabs>}
    </Page>
  )
}

export default Credential
