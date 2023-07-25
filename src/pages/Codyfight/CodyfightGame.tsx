import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'

import '@veramo-community/react-components/dist/cjs/index.css'
import { PageContainer } from '@ant-design/pro-components'
import { App } from './App'
import { GameState } from './lib/codyfight-game-client/src'

const Credential = () => {
  const { id } = useParams<{ id: string }>()
  const { agent } = useVeramo()

  const { data: credential, isLoading: credentialLoading } = useQuery(
    ['credential', { id }],
    () => agent?.dataStoreGetVerifiableCredential({ hash: id }),
  )

  return (
    <PageContainer title="Codyfight Game">
      {!credentialLoading && credential && <App 
        gameState={credential.credentialSubject.game as GameState}
        mode={credential.credentialSubject.mode}
        ckey={credential.credentialSubject.ckey}
      />}
    </PageContainer>
  )
}

export default Credential
