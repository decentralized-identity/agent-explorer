import React from 'react'
import { Row, Avatar, Col, Typography, theme, Skeleton, Space, Popover, Tag } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { getIssuerDID, shortId } from '../utils/did.js'
import { CredentialActionsDropdown } from './CredentialActionsDropdown.js'
import { UniqueVerifiableCredential } from '@veramo/core'
import { EllipsisOutlined } from '@ant-design/icons'
import { formatRelative } from 'date-fns'
import { IdentifierPopover } from './IdentifierPopover.js'

interface CredentialSummaryProps {
  credential: UniqueVerifiableCredential
  onClick?: () => void
}

export const CredentialSummary: React.FC<CredentialSummaryProps> = ({
  credential,
  onClick
}) => {
  const { agent } = useVeramo()
  const { token } = theme.useToken()
  
  const did = getIssuerDID(credential.verifiableCredential)

  const { data, isLoading } = useQuery(
    ['identifierProfile', did, agent?.context.id],
    () => (did ? agent?.getIdentifierProfile({ did }) : undefined),
  )

  return (
    <Row align="top" 
    wrap={false} 
      style={{
        width: '100%',
        borderBottom: '1px solid ' + token.colorBorderSecondary,
        backgroundColor: token.colorBgBase,
        padding: token.paddingSM,
        position: 'relative'
      }}
      justify={'space-between'}
    >
      <Col 
        style={{cursor: 'pointer'}}
        onClick={onClick}>
        <div style={{ justifyItems: 'flex-start', display: 'flex' }}>
          {!isLoading && (

            <Space direction='horizontal' wrap={true}>
              <div>
                {!isLoading && <Avatar src={data?.picture} size={'small'} />}
                {isLoading && <Skeleton.Avatar active />}
              </div>
              <IdentifierPopover did={did}>
                <Typography.Text ellipsis>
                  {data?.name} 
                </Typography.Text>
              </IdentifierPopover>

              {credential.verifiableCredential.type 
                && Array.isArray(credential.verifiableCredential.type)
                && credential.verifiableCredential.type.map((type: string, index: number) => {
                if (type === 'VerifiableCredential') return null
                return <Tag key={index}>{type}</Tag>
              })}
              <Typography.Text type='secondary'>{formatRelative(
                new Date(credential.verifiableCredential.issuanceDate),
                new Date()
                )}</Typography.Text>
              </Space>
          )}
          {isLoading && <Skeleton.Input style={{ width: 100 }} active />}
        </div>
        
      </Col>
      <Col xs={1}>
        <CredentialActionsDropdown uniqueCredential={credential}>
          <EllipsisOutlined />
        </CredentialActionsDropdown>
      </Col>

    </Row>

  )
}
