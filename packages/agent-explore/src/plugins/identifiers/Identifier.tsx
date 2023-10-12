import React from 'react'
import {
  Button,
  App,
} from 'antd'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDManager, IResolver } from '@veramo/core'
import { PageContainer } from '@ant-design/pro-components'
import { shortId, IIdentifierProfilePlugin, IdentifierTabs } from '@veramo-community/agent-explorer-plugin'
import { CopyOutlined } from '@ant-design/icons'

const Identifier = () => {
  const { notification } = App.useApp()
  const { id } = useParams<{ id: string }>()
  if (!id) throw Error('id is missing')

  const { agent } = useVeramo<
    IDIDManager & IResolver & IIdentifierProfilePlugin
  >()

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
      <IdentifierTabs did={id} />
    </PageContainer>
  )
}

export default Identifier
