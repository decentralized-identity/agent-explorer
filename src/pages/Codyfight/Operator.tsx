import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { useMachine } from '@xstate/react';
import { GAME_STATUS_TERMINATED, GameState, GameStrategy } from './lib/codyfight-game-client/src'
import { ICredentialIssuer, IDIDManager, IDataStore, IDataStoreORM } from '@veramo/core-types'
import { Alert, Button, Col, Row, Segmented, Switch, Typography } from 'antd'
import { CloudUploadOutlined } from '@ant-design/icons'
import NewGameModalForm, { NewGameModalValues } from './NewGameModalForm'
import { getAllStrategies } from './strategies'
import { stateMachine, services } from './lib/codyfight-game-client/src/state-machine'
import { GameInfo } from './GameInfo';
import { GameStage } from './GameStage';
import { getIssuerDID } from '../../utils/did';

const Operator = () => {
  const { id } = useParams<{ id: string }>()
  const { agent } = useVeramo<IDIDManager & IDataStore & IDataStoreORM & ICredentialIssuer>()
  const [isNewGameModalVisible, setIsNewGameModalVisible] = useState(false)
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState<number | undefined>(undefined)
  const [strategies, setStrategies] = useState<GameStrategy[]>([])
  const [spectate, setSpectate] = useState<boolean>(false)
  const [state, send] = useMachine(stateMachine, { services });
  const { game, error } = state.context

  const { data: credential } = useQuery(
    ['credential', { id, agentId: agent?.context.name }],
    () => id ? agent?.dataStoreGetVerifiableCredential({ hash: id }) : undefined,
  )

  useEffect(() => {
    if (credential?.credentialSubject?.ckey) {
      send('configure', { ckey: credential?.credentialSubject?.ckey})
    }
  }, [credential, send])

  useEffect(() => {
    if (game && state.matches({ playingGame: 'bearersTurn' })) {
      const strategies = getAllStrategies(game)
      setStrategies(strategies)
    } else {
      setStrategies([])
    }
  }, [game, state])

  const handleExecuteStrategy = async (strategy: GameStrategy) => {
    const action = strategy.actions[0]    

    const callback = async (newGameState: GameState) => {
      console.log('callback', newGameState)
      if (credential) {
        const actionCredential = await agent?.createVerifiableCredential({
          credential: {
            issuer: getIssuerDID(credential),
            issuanceDate: new Date().toISOString(),
            type: ['Codyfight', 'GameAction'],
            credentialSubject: {
              id: `${newGameState.state.id}`,
              action,
              strategy,
              previousState: game,
              game: newGameState,
            },
          },
          proofFormat: 'jwt',
        })
        if (!actionCredential) throw new Error('Could not create credential')
        await agent?.dataStoreSaveVerifiableCredential({
          verifiableCredential: actionCredential,
        })
        console.log('actionCredential saved', actionCredential)
      }
    }

    switch (action.type) {
      case 'move':
        send('move', {position: action.position, callback})
        break;
      case 'skill':
        send('cast', {position: action.position, skill: action.skill, callback})
        break;
    }
  }

  const handleNewGame = async (values: NewGameModalValues) => {
    setIsNewGameModalVisible(false)
    send('init', { opponent: values.opponent, mode: values.mode })
  }
  
  if (!agent || !credential) return null

  return (
    <>
    <Row style={{marginBottom: 4}}>
      <Col span={22}>
        {!!error && <Alert message={error} type="error" />}
      
        {state.matches('idle') && <Button 
          onClick={() => setIsNewGameModalVisible(true)} 
          type='primary' 
          size='small' 
          style={{marginRight: 4}}
          >Start</Button>}

        {!!game && <GameInfo game={game} />}
        
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
          {game?.state.status !== GAME_STATUS_TERMINATED && selectedStrategyIndex !== undefined  
            && <Button 
                  type='primary' 
                  onClick={() => handleExecuteStrategy(strategies[selectedStrategyIndex])} 
                  disabled={ !state.matches({playingGame: 'bearersTurn'})}  
                  icon={<CloudUploadOutlined />}> Go</Button>}
        </Typography.Paragraph>
      </Col>
      <Col span={2}>
        <Switch checked={spectate} onChange={(value) => setSpectate(value)} />
      </Col>
    </Row>
    <Row style={{height: 'calc(100vh - 200px)'}}>
      <Col sm={24} lg={spectate ? 12 : 24}>
        {!!game && <GameStage 
          game={game}
          selectedStrategyIndex={selectedStrategyIndex}
          strategies={strategies} />}
      </Col>
      {spectate && <Col sm={24} lg={spectate ? 12 : 24} style={{height: '100%'}}>
        {game && <iframe 
          title='Codyfight widget'
          src={`https://widget.codyfight.com/?spectate=${game?.players.bearer.name}`} 
          width="100%" 
          height="100%" 
        />}
      </Col>}
    </Row>

    {agent?.availableMethods().includes('createVerifiableCredential') && (
        <NewGameModalForm
          visible={isNewGameModalVisible}
          onNewGame={handleNewGame}
          onCancel={() => {
            setIsNewGameModalVisible(false)
          }}
        />
      )}
    </>
  )
}

export default Operator
