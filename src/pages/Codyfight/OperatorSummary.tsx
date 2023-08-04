import React, { useEffect } from 'react'
import { useMachine } from '@xstate/react';
import { useVeramo } from '@veramo-community/veramo-react'
import '@veramo-community/react-components/dist/cjs/index.css'
import { IDIDManager, IDataStore, IDataStoreORM, VerifiableCredential } from '@veramo/core-types'
import { Alert, Col, Row } from 'antd'
import { stateMachine, services } from './lib/codyfight-game-client/src/state-machine'
import { GameInfo } from './GameInfo';

export const OperatorSummary: React.FC<{
  credential: VerifiableCredential
}> = ({ credential }) => {

  const { agent } = useVeramo<IDIDManager & IDataStore & IDataStoreORM>()
  const [ state, send ] = useMachine(stateMachine, { services });
  const { game, error } = state.context
  
  useEffect(() => {
    if (credential?.credentialSubject?.ckey) {
      send('configure', { ckey: credential?.credentialSubject?.ckey})
    }
  }, [credential, send])

  console.log({game, error})
  if (!agent || !credential) return null
  return (
    <>
    <Row style={{marginBottom: 4}}>
      <Col>
        {!!error && <Alert message={error} type="error" />}
        {!!game && <GameInfo game={game} />}

      </Col>
    </Row>
    </>
  )
}

