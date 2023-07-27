import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'

import '@veramo-community/react-components/dist/cjs/index.css'
import { GAME_STATUS_PLAYING, GAME_STATUS_TERMINATED, GameStrategy } from './lib/codyfight-game-client/src'
import { IDIDManager, IDataStore, IDataStoreORM } from '@veramo/core-types'
import { GameAPI } from './lib/codyfight-game-client/src/GameApi'
import { Button, Col, Progress, Row, Segmented, Switch, Tag, Typography, notification } from 'antd'
import { Stage } from '@pixi/react'
import { GameMap } from './GameMap'
import { getKillOpponentStrategyActions } from './strategies/kill-opponent';
import { getValidMovesStrategyActions } from './strategies/valid-moves';
import { StrategyMap } from './StrategyMap'
import { CloudDownloadOutlined, CloudUploadOutlined } from '@ant-design/icons'
import { useResize } from './utils'

const api = new GameAPI()


const Credential = () => {
  const size = useResize()
  const { id } = useParams<{ id: string }>()
  const { agent } = useVeramo<IDIDManager & IDataStore & IDataStoreORM>()
  const queryClient = useQueryClient();
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState<number | undefined>(undefined)
  const [strategies, setStrategies] = useState<GameStrategy[]>([])
  const [spectate, setSpectate] = useState<boolean>(false)


  const { data: credential, isLoading: credentialLoading } = useQuery(
    ['credential', { id, agentId: agent?.context.name }],
    () => id ? agent?.dataStoreGetVerifiableCredential({ hash: id }) : undefined,
  )
  
  const { data: game, isLoading: gameLoading, refetch, isRefetching } = useQuery(
    ['gameState', { ckey: credential?.credentialSubject?.ckey, agentId: agent?.context.name }],
    () => credential?.credentialSubject?.ckey ? api.check(credential?.credentialSubject?.ckey) : undefined,
  )

  const isGameStateLoading = credentialLoading || gameLoading || isRefetching
  // console.log({agent, id, isError, error, credential, credentialLoading, isGameError, gameError, gameLoading, game})

  useEffect(() => {
    if (game?.state.status === GAME_STATUS_PLAYING && game?.players?.bearer.is_player_turn) {
      const strategies: GameStrategy[] = [
        getKillOpponentStrategyActions(game),
        ...getValidMovesStrategyActions(game),
      ]
      setStrategies(strategies)
    } else {
      setStrategies([])
    }
  }, [game])
  
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

  const handleExecuteStrategy = async (strategy: GameStrategy) => {
    const action = strategy.actions[0]    
    const api = new GameAPI()
    try {

      switch (action.type) {
        case 'move':
          const newGameState1 = await api.move(credential?.credentialSubject?.ckey, action.position.x, action.position.y)
          queryClient.setQueryData(['gameState', { ckey: credential?.credentialSubject?.ckey, agentId: agent?.context.name }], newGameState1);
          break;
          case 'skill':
            if (!action.skill) return console.error('No skill')
            const newGameState2 = await api.cast(credential?.credentialSubject?.ckey, action.skill.id, action.position.x, action.position.y)
            queryClient.setQueryData(['gameState', { ckey: credential?.credentialSubject?.ckey, agentId: agent?.context.name }], newGameState2);
          break;
      }
    } catch (e: any) {
      notification.error({
        message: 'Error executing strategy',
        description: e.message,
      })
    }

  }

  const handleNewGame = async () => {
    try {
      const api = new GameAPI()
      await api.init(credential?.credentialSubject?.ckey, 0)
      refetch()
    } catch (e: any) {
      notification.error({
        message: 'Error creating game',
        description: e?.response?.data?.message || e.message,
      })
    }
  }

  
  if (!agent || !credential || !game) return null

  const xCount = game.map.length;
  const yCount = game.map[0].length;

  const tileSize = Math.min((size.width - 30) / xCount, 64)
  return (
    <>
    <Row style={{marginBottom: 4}}>
      <Col span={22}>
      
        <Typography.Paragraph>
          {game?.state.status === GAME_STATUS_TERMINATED && <Button onClick={handleNewGame} type='primary' size='small' style={{marginRight: 4}}>Start</Button>}
          {game?.state.status !== GAME_STATUS_TERMINATED && <Button onClick={()=>refetch()} disabled={isGameStateLoading} size='small' style={{marginRight: 4}} icon={<CloudDownloadOutlined />}></Button>}
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
          
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Segmented
          onChange={(value) => setSelectedStrategyIndex(value as number)}
          value={selectedStrategyIndex}
          options={
            strategies.map((strategy, i) => ({
              label: strategy.name,
              value: i,
            }))
          }
          />
          {game?.state.status !== GAME_STATUS_TERMINATED && selectedStrategyIndex !== undefined  && <Button type='primary' onClick={() => handleExecuteStrategy(strategies[selectedStrategyIndex])} disabled={ isGameStateLoading || !game?.players.bearer.is_player_turn} size='small' icon={<CloudUploadOutlined />}></Button>}
        </Typography.Paragraph>



      </Col>
      <Col span={2}>
        <Switch checked={spectate} onChange={(value) => setSpectate(value)} />
      </Col>
    </Row>
    <Row style={{height: 'calc(100vh - 200px)'}}>
      <Col sm={24} lg={spectate ? 12 : 24}>
            {game && xCount && yCount && <Stage 
              width={xCount * tileSize} 
              height={yCount * tileSize} 
              >
              <GameMap game={game} tileSize={tileSize}/>
              {selectedStrategyIndex !== undefined && strategies[selectedStrategyIndex] && <StrategyMap tileSize={tileSize} game={game} actions={strategies[selectedStrategyIndex].actions} />}
            </Stage>}
      </Col>
      {spectate && <Col sm={24} lg={spectate ? 12 : 24} style={{height: '100%'}}>
        {game && <iframe title='Codyfight widget' src={`https://widget.codyfight.com/?spectate=${game?.players.bearer.name}`} width="100%" height="100%" />}
      </Col>}
    </Row>
    </>
  )
}

export default Credential
