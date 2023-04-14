import React from 'react'
import { Tabs } from 'antd'
import { VerifiableCredential as Vcred } from '@veramo/core'
import { VerifiableCredential } from '@veramo-community/react-components'
import CredentialInfo from './CredentialInfo'
import JsonBlock from './Json'

interface CredentialTabsProps {
  credential: Vcred
}

const CredentialTabs: React.FC<CredentialTabsProps> = ({ credential }) => {
  return (
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
          children: <JsonBlock title="Raw JSON" data={credential} />,
        },
      ]}
    />
  )
}

export default CredentialTabs
