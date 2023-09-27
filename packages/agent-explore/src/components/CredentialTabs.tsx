import React from 'react'
import { Button, Row, Tabs, Card } from 'antd'
import { UniqueVerifiableCredential } from '@veramo/core'
import { VerifiableCredential } from '@veramo-community/react-components'
import CredentialInfo from './CredentialInfo'
import JsonBlock from './Json'
import { getIssuerDID, CredentialActionsDropdown, IdentifierProfile } from '@veramo-community/agent-explorer-plugin'
import { EllipsisOutlined } from '@ant-design/icons'
import { formatRelative } from 'date-fns'

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
          label: 'Pretty',
          children: (
            <Card
              title={<IdentifierProfile did={getIssuerDID(verifiableCredential)} />}
              extra={
                <Row align={'middle'}>
                  <div>
                    {formatRelative(
                      new Date(verifiableCredential.issuanceDate),
                      new Date(),
                    )}
                  </div>{' '}
                  <CredentialActionsDropdown uniqueCredential={uniqueCredential}>
                    <Button type="text">
                      <EllipsisOutlined />
                    </Button>
                  </CredentialActionsDropdown>
                </Row>
              }
            >
              <VerifiableCredential credential={verifiableCredential} />
            </Card>
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
          children: <JsonBlock title="Raw JSON" data={verifiableCredential} />,
        },
      ]}
    />
  )
}

export default CredentialTabs
