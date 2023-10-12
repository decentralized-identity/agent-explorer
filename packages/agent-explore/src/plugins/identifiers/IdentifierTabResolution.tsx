import React from 'react'
import { Card } from 'antd'
import { IIdentifierProfilePlugin } from '@veramo-community/agent-explorer-plugin'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDManager, IResolver } from '@veramo/core-types'
import TextArea from 'antd/es/input/TextArea'
import { useQuery } from 'react-query'

export const IdentifierTabResolution: React.FC<{ did: string }> = ({
  did,
}) => {
  const { agent } = useVeramo<
    IDIDManager & IResolver & IIdentifierProfilePlugin
  >()
  const { data: resolutionResult, isLoading } = useQuery(
    ['identifier', did],
    () => agent?.resolveDid({ didUrl: did }),
  )

  return (
    <Card loading={isLoading} size="small">
      <TextArea
        autoSize
        readOnly
        wrap='true'
        style={{ width: '100%', height: '100%', fontFamily: 'monospace' }}
        value={JSON.stringify(resolutionResult, null, 2)}
      />
    </Card>
  )
}


