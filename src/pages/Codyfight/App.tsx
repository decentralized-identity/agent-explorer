import { Stage } from '@pixi/react';
import { GameMap } from './GameMap';
import { StrategyMap } from './StrategyMap';
import { TILE_SIZE } from './consts';
import { getKillOpponentStrategyActions } from './strategies/kill-opponent';
import { GameState, GameStrategy } from './lib/codyfight-game-client/src';
import { getValidMovesStrategyActions } from './strategies/valid-moves';
import { useEffect, useState } from 'react';
import { Button, Card } from 'antd';
import { GameAPI } from './lib/codyfight-game-client/src/GameApi';
import { set } from 'date-fns';



export const App: React.FC<{
  gameState: GameState
  mode: number
  ckey: string
}> = ({ gameState, mode, ckey }) => {
  const api = new GameAPI()

  const [game, setGame] = useState<GameState>(gameState)
  const xCount = game['map'].length
  const yCount = game['map'][0].length


  const [selectedStrategy, setSelectedStrategy] = useState<number | undefined>(0)
  const [strategies, setStrategies] = useState<GameStrategy[]>([])
  useEffect(() => {
    const interval = setInterval(async () => {
      try {

        const game = await api.check(ckey)
        const strategies: GameStrategy[] = [
          ...getValidMovesStrategyActions(game),
          getKillOpponentStrategyActions(game),
        ]
        setGame(game)
        setSelectedStrategy(undefined)
        setStrategies(strategies)
      } catch (e: any) {
        // console.error(e?.message)
        console.error(e?.response?.data?.message)
      }
    }, 1000)
    return () => clearInterval(interval)
  })

  const handleExecuteStrategy = async () => {
    if (selectedStrategy === undefined) return console.error('No strategy selected')
    const action = strategies[selectedStrategy].actions[0]    
    console.log('action', action)
    const api = new GameAPI()
    
    switch (action.type) {
      case 'move':
        const newGameState = await api.move(ckey, action.position.x, action.position.y)
        setGame(newGameState)
        break;
      case 'skill':
        if (!action.skill) return console.error('No skill')
        const game = await api.cast(ckey, action.skill.id, action.position.x, action.position.y)
        setGame(game)
        break;
    }

  }

  console.log('game', game)

  return (
    <div>
      <Card title='State'>{JSON.stringify(game.state)}</Card>
      <Card title='Verdict'>{JSON.stringify(game.verdict)}</Card>
      <Card title='Strategies'>
        <ul>
          {strategies.map((strategy, i) => <li key={i} onClick={() => setSelectedStrategy(i)}>{i === selectedStrategy ? 'X' : 'O'} {strategy.name}</li>)}
        </ul>
        <Button onClick={handleExecuteStrategy}>Execute strategy</Button>

      </Card>


    <Stage 
      width={xCount * TILE_SIZE} 
      height={yCount * TILE_SIZE} 
      >
      {game && <GameMap game={game} />}
      {selectedStrategy && strategies?.length > 0 && strategies[selectedStrategy] !== null && <StrategyMap game={game} actions={strategies[selectedStrategy].actions} />}
    </Stage>
    </div>
  );
};

export default App;