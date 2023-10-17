import React from 'react'
import { Row, Avatar, Col, Typography, theme, Skeleton } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { IIdentifierProfilePlugin } from '../agent-plugins/IdentifierProfilePlugin.js'
import { shortId } from '../utils/did.js'
import { IdentifierPopover } from './IdentifierPopover.js'

interface IdentifierProfileProps {
  did: string
  showShortId?: boolean
  hidePopover?: boolean
}

export const IdentifierProfile: React.FC<IdentifierProfileProps> = ({
  did,
  showShortId = true,
  hidePopover = false,
}) => {
  const { agent } = useVeramo<IIdentifierProfilePlugin>()
  const { token } = theme.useToken()

  const { data, isLoading } = useQuery(
    ['identifierProfile', { did, agentId: agent?.context.id }],
    () => (did ? agent?.getIdentifierProfile({ did }) : undefined),
  )

  const content = (<Row align="middle" wrap={false}>
    <Col style={{ marginRight: token.padding }}>
      {!isLoading && <Avatar src={data?.picture} />}
      {isLoading && <Skeleton.Avatar active />}
    </Col>
    <Col>
      <div style={{ justifyItems: 'flex-start', display: 'flex' }}>
        {!isLoading && (
          <Typography.Text ellipsis>{data?.name}</Typography.Text>
        )}
        {isLoading && <Skeleton.Input style={{ width: 100 }} active />}
      </div>
      {showShortId && data?.name && data?.name !== shortId(did) && (
        <div>
          <Typography.Text
            ellipsis
            style={{ color: token.colorTextSecondary }}
          >
            {shortId(did)}
          </Typography.Text>
        </div>
      )}
    </Col>
  </Row>)

  if (hidePopover)

  return (
    <IdentifierPopover did={did}>
      {content}
    </IdentifierPopover>
  )
}
