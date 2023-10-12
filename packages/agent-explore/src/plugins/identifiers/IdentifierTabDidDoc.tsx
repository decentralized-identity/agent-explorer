import React from 'react'
import { Space } from 'antd'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDManager, IResolver } from '@veramo/core'
import { IIdentifierProfilePlugin } from '@veramo-community/agent-explorer-plugin'
import { id } from 'ethers'

import IdentifierKeys from './IdentifierKeys'
import IdentifierServices from './IdentifierServices'
import IdentifierQuickSetup from './IdentifierQuickSetup'


export const IdentifierTabDidDoc: React.FC<{ did: string }> = ({
  did,
}) => {

  const { agent } = useVeramo<
    IDIDManager & IResolver & IIdentifierProfilePlugin
  >()
  const { data: managedDID } = useQuery(['managedDid', id], () =>
    agent?.didManagerGet({ did: did }),
  )

  const isManaged = !!managedDID?.provider

  const hasDIDCommSetup =
    !!managedDID?.services?.find((s) => s.type === 'DIDCommMessaging') &&
    !!managedDID?.keys?.find(
      (key) => key.type === 'X25519' || key.type === 'Ed25519',
    )

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {isManaged && !hasDIDCommSetup && (
        <IdentifierQuickSetup
          title="DIDComm mediator setup"
          identifier={did}
          cacheKey={`identifier-quicksetup-${did}`}
        />
      )}
      <IdentifierKeys
        title="Keys"
        identifier={did}
        cacheKey={`identifier-keys-${did}`}
        isManaged={isManaged}
      />
      <IdentifierServices
        title="Services"
        identifier={did}
        cacheKey={`identifier-services-${did}`}
        isManaged={isManaged}
      />
    </Space>

  )
}


