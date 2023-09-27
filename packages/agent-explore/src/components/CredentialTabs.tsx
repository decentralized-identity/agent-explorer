import React from 'react'
import { Input, Tabs } from 'antd'
import { UniqueVerifiableCredential } from '@veramo/core'
import CredentialInfo from './CredentialInfo'
import { VerifiableCredentialComponent } from '@veramo-community/agent-explorer-plugin'

interface CredentialTabsProps {
  uniqueCredential: UniqueVerifiableCredential
}

const CredentialTabs: React.FC<CredentialTabsProps> = ({ uniqueCredential }) => {
  const { verifiableCredential } = uniqueCredential
  return (
    <Tabs
      items={[
        {
          key: '0',
          label: 'Credential',
          children: (
            <VerifiableCredentialComponent credential={uniqueCredential} />
          ),
        },
        {
          key: '1',
          label: 'Info',
          children: <CredentialInfo credential={verifiableCredential} />,
        },
        {
          key: '2',
          label: 'Data',
          children: <Input.TextArea 
            value={JSON.stringify(verifiableCredential, null, 2)} 
            style={{
              height: '50vh',
              fontFamily: 'monospace',
            }}
            />,
        },
      ]}
    />
  )
}

export default CredentialTabs
