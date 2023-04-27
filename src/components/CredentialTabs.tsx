import React from 'react'
import { Button, Row, Tabs } from 'antd'
import { VerifiableCredential as Vcred } from '@veramo/core'
import { VerifiableCredential } from '@veramo-community/react-components'
import CredentialInfo from './CredentialInfo'
import JsonBlock from './Json'
import { getIssuerDID } from '../utils/did'
import IdentifierProfile from './IdentifierProfile'
import { EllipsisOutlined } from '@ant-design/icons'
import { formatRelative } from 'date-fns'
import { ProCard } from '@ant-design/pro-components'
import CredentialActionsDropdown from './CredentialActionsDropdown'

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
          children: (
            <ProCard
              title={<IdentifierProfile did={getIssuerDID(credential)} />}
              extra={
                <Row align={'middle'}>
                  <div>
                    {formatRelative(
                      new Date(credential.issuanceDate),
                      new Date(),
                    )}
                  </div>{' '}
                  <CredentialActionsDropdown credential={credential}>
                    <Button type="text">
                      <EllipsisOutlined />
                    </Button>
                  </CredentialActionsDropdown>
                </Row>
              }
            >
              <VerifiableCredential credential={credential} />
            </ProCard>
          ),
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
