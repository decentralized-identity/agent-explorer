import React from 'react'
import { Tabs } from 'antd'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import JsonBlock from '../components/standard/Json'
import CredentialInfo from '../components/standard/CredentialInfo'
import { VerifiableCredential } from '@veramo-community/react-components'

import '@veramo-community/react-components/dist/cjs/index.css'
import { PageContainer } from '@ant-design/pro-components'

const Credential = () => {
  const { id } = useParams<{ id: string }>()
  const { agent } = useVeramo()

  const { data: credential, isLoading: credentialLoading } = useQuery(
    ['credential', { id }],
    () => agent?.dataStoreGetVerifiableCredential({ hash: id }),
  )

  return (
    <PageContainer title="Verifiable Credential">
      {!credentialLoading && (
        <Tabs
          items={[
            {
              key: '0',
              label: 'Pretty',
              children: <VerifiableCredential credential={credential} />,
            },
            {
              key: '1',
              label: 'Info',
              children: <CredentialInfo credential={credential} />,
            },
            {
              key: '2',
              label: 'Data',
              children: (
                <JsonBlock
                  title="Raw JSON"
                  data={credential}
                  isLoading={credentialLoading}
                />
              ),
            },
          ]}
        />
      )}
    </PageContainer>
  )
}

export default Credential
