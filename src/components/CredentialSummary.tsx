import React from 'react'
import { Row, Avatar, Col, Typography, theme, Skeleton, Space, Popover, Tag } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { getIssuerDID, shortId } from '../utils/did'
import { UniqueVerifiableCredential } from '@veramo/core'
import CredentialActionsDropdown from './CredentialActionsDropdown'
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
      onClick={onClick}
      wrap={false} 
      style={{
        cursor: 'pointer',
        width: '100%',
        borderBottom: '1px solid ' + token.colorBorderSecondary,
        padding: token.paddingSM,
        position: 'relative'
      }}
    >
      <div style={{position: 'absolute', top: token.paddingXXS, right: 0 }}>

      <CredentialActionsDropdown credential={credential.verifiableCredential}>
        <EllipsisOutlined />
      </CredentialActionsDropdown>
      </div>
      <Col style={{ marginRight: token.padding }}>
        {!isLoading && <Avatar src={data?.picture} size={'small'} />}
        {isLoading && <Skeleton.Avatar active />}
      </Col>
      <Col>
        <div style={{ justifyItems: 'flex-start', display: 'flex' }}>
          {!isLoading && (

            <Space direction='horizontal' wrap={true}>
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
    </Row>

  )
}
