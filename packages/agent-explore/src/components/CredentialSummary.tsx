import React from 'react'
import { Row, Avatar, Col, Typography, theme, Skeleton, Space, Popover, Tag } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { getIssuerDID, shortId, CredentialActionsDropdown } from '@veramo-community/agent-explorer-plugin'
import { UniqueVerifiableCredential } from '@veramo/core'
import { EllipsisOutlined } from '@ant-design/icons'
import { formatRelative } from 'date-fns'

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
              <Popover content={shortId(did)}>
                <Typography.Text ellipsis>
                  {data?.name} 
                </Typography.Text>
              </Popover>

              <Tag>{credential.verifiableCredential.type && credential.verifiableCredential.type[1]}</Tag>
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
