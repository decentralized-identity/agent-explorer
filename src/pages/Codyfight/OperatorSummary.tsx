import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import '@veramo-community/react-components/dist/cjs/index.css'
import { GAME_STATUS_PLAYING, GAME_STATUS_TERMINATED } from './lib/codyfight-game-client/src'
import { IDIDManager, IDataStore, IDataStoreORM, VerifiableCredential } from '@veramo/core-types'
import { GameAPI } from './lib/codyfight-game-client/src/GameApi'
import { Col, Progress, Row, Tag, Typography } from 'antd'

const api = new GameAPI()

export const OperatorSummary: React.FC<{
  credential: VerifiableCredential
}> = ({ credential }) => {

  const { agent } = useVeramo<IDIDManager & IDataStore & IDataStoreORM>()
  
  const { data: game, refetch } = useQuery(
    ['gameState', { ckey: credential?.credentialSubject?.ckey, agentId: agent?.context.name }],
    () => credential?.credentialSubject?.ckey ? api.check(credential?.credentialSubject?.ckey) : undefined,
  )
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (game?.state.status === GAME_STATUS_PLAYING) {
          console.log('refetch')
          refetch()
        } 
      } catch (e) {
        console.error(e)
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [credential, game, refetch])


  if (!agent || !credential || !game) return null
  return (
    <>
    <Row style={{marginBottom: 4}}>
      <Col>
      
        <Typography.Text>
          {game?.state.status === GAME_STATUS_TERMINATED && <Tag color="error">Terminated</Tag>}
          {game?.state.status === GAME_STATUS_TERMINATED && <Tag color="info">{game?.verdict.context}, {game?.verdict.statement}{game?.verdict.winner ? ', winner: ' + game?.verdict.winner : ''}</Tag>}
          {game?.state.status !== GAME_STATUS_TERMINATED && <Tag color="success" icon={<Progress
            type="circle"
            percent={game ? game?.state.turn_time_left / game?.state.max_turn_time * 100 : 0}
            strokeWidth={10}
            size={10}
          />}>{game?.verdict.context} {game?.verdict.statement}{game?.verdict.winner ? ' winner: ' + game?.verdict.winner : ''}</Tag>}
          <Tag color="info">round: {game.state.round + 1} / {game.state.total_rounds}</Tag>
          {game?.players?.opponent?.name && <Tag color="info">opponent: {game.players.opponent.name}</Tag>}
          
        </Typography.Text>

      </Col>
    </Row>
    </>
  )
}

