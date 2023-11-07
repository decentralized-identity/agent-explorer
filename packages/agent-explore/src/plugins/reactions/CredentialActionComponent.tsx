/* eslint-disable */
import React from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDataStore, IDataStoreORM } from '@veramo/core'
import { Typography, Button, theme } from 'antd'
import { ActionButton } from '@veramo-community/agent-explorer-plugin'
import { ReactionButton } from './ReactionButton'
interface Props {
  hash: string
}

export const CredentialActionComponent: React.FC<Props> = ({
  hash,
}) => {
  const { agent } = useVeramo<IDataStoreORM & IDataStore>()
  const [showDrawer, setShowDrawer] = React.useState(false)
  const { token } = theme.useToken()
  const queryClient  = useQueryClient()

  const { data: credentials, refetch } = useQuery(
    [
      'credentialReactionCredentials',
      {hash,  agentId: agent?.context.name },
    ],
    () =>
      agent?.dataStoreORMGetVerifiableCredentialsByClaims({
        where: [
          {
            column: 'type',
            value: ['hash'],
          },
          {
            column: 'value',
            value: [hash],
          },
          {
            column: 'credentialType',
            value: ['VerifiableCredential,Reaction'],
          },
        ],
      }),
  )
  
  const createReaction = async (did: string, emoji: string) => {
    const verifiableCredential = await agent?.createVerifiableCredential({
      credential: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'Reaction'],
        issuer: did,
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          hash,
          emoji,
        },
      },
      proofFormat: 'jwt',
    })

    await agent?.dataStoreSaveVerifiableCredential({
      verifiableCredential
    })

    queryClient.invalidateQueries([
      'credentialReactionCredentials',
      {hash,  agentId: agent?.context.name },
    ])

  }

  const countReactions = React.useMemo(() => {
    const countReactions: Record<string, number> = {}
    if (credentials) {
      for (const credential of credentials) {
        const { emoji } = credential.verifiableCredential.credentialSubject
        if (emoji) {
          if (countReactions[emoji]) {
            countReactions[emoji] += 1
          } else {
            countReactions[emoji] = 1
          }
        }
      }
    }
    return countReactions
  }, [credentials])

  return (
    <>
      {Object.keys(countReactions).map((emoji) => (
        <ReactionButton key={emoji} emoji={emoji} count={countReactions[emoji]} onAction={createReaction}/>
      ))}
      <ReactionButton onAction={createReaction}/>
    </>
  
  )
}
