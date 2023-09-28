import React from 'react'
import {
  Button,
  Card,
  Space,
  Tabs,
  Input,
  App,
  QRCode,
} from 'antd'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDManager, IResolver } from '@veramo/core'
import IdentifierReceivedCredentials from './IdentifierReceivedCredentials'
import IdentifierIssuedCredentials from './IdentifierIssuedCredentials'
import { PageContainer } from '@ant-design/pro-components'
import { shortId, IIdentifierProfilePlugin } from '@veramo-community/agent-explorer-plugin'
import { CopyOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { TabPane } = Tabs

const Identifier = () => {
  const { notification } = App.useApp()
  const { id } = useParams<{ id: string }>()
  if (!id) throw Error('id is missing')

  const { agent } = useVeramo<
    IDIDManager & IResolver & IIdentifierProfilePlugin
  >()
  const { data: resolutionResult, isLoading } = useQuery(
    ['identifier', id],
    () => agent?.resolveDid({ didUrl: id }),
  )
  const { data: profile } = useQuery(['profile', id, agent?.context.id], () =>
    agent?.getIdentifierProfile({ did: id }),
  )


  const title =
    profile?.name && profile?.name !== shortId(id) ? profile.name : shortId(id)
  const subTitle =
    profile?.name && profile?.name !== shortId(id) ? shortId(id) : undefined

  return (
    <PageContainer
      title={title}
      subTitle={subTitle}
      avatar={{ src: profile?.picture }}
      extra={[
        <Button
          key={'copy'}
          icon={<CopyOutlined />}
          type="text"
          title="Copy DID to clipboard"
          onClick={() => {
            navigator.clipboard.writeText(id)
            notification.success({
              message: 'Copied identifier to clipboard',
            })
          }}
        />,
      ]}
    >
      <Tabs>
        <TabPane tab="Credentials" key="0">
          <Space direction="vertical" >
            <IdentifierIssuedCredentials identifier={id} />
            <IdentifierReceivedCredentials identifier={id} />
          </Space>
        </TabPane>

        <TabPane tab="Resolution Result" key="2">
          <Card loading={isLoading} size="small">
            <TextArea
              autoSize
              readOnly
              style={{ width: '100%', height: '100%' }}
              value={JSON.stringify(resolutionResult, null, 2)}
            />
          </Card>
        </TabPane>
        <TabPane tab="QR Code">
          <QRCode value={id} size={320} />
        </TabPane>
      </Tabs>
    </PageContainer>
  )
}

export default Identifier
