import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'

import '@veramo-community/react-components/dist/cjs/index.css'
import { PageContainer } from '@ant-design/pro-components'
import CredentialTabs from '../../components/CredentialTabs'
import { IDataStore } from '@veramo/core'
import { computeEntryHash } from '@veramo/utils'
import CredentialActionsDropdown from '../../components/CredentialActionsDropdown'
import { EllipsisOutlined } from '@ant-design/icons'

const Credential = () => {
  const { id } = useParams<{ id: string }>()
  const { agent } = useVeramo<IDataStore>()

  const { data: credential, isLoading: credentialLoading } = useQuery(
    ['credential', { id }],
    () => agent?.dataStoreGetVerifiableCredential({ hash: id! }),
  )

  return (
    <PageContainer title="Verifiable Credential"
      extra={[
        id && credential && <CredentialActionsDropdown uniqueCredential={{
          hash: id,
          verifiableCredential: credential,
        }}>
            <EllipsisOutlined />
          </CredentialActionsDropdown>
      ]}
    >
      {!credentialLoading && credential && <CredentialTabs uniqueCredential={{
        hash: computeEntryHash(credential),
        verifiableCredential: credential,
      }} />}
    </PageContainer>
  )
}

export default Credential
