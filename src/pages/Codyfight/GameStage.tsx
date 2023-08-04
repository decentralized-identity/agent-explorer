import React from 'react'
import { GameState, GameStrategy } from './lib/codyfight-game-client/src'
import { StrategyMap } from './StrategyMap'
import { useResize } from './utils/use-resize'
import { Stage } from '@pixi/react'
import { GameMap } from './GameMap'

export const GameStage: React.FC<{
  game: GameState,
  selectedStrategyIndex?: number
  strategies: GameStrategy[]
}> = ({ game, selectedStrategyIndex, strategies }) => {
  const size = useResize()
  const xCount = game.map.length;
  const yCount = game.map[0].length;
  const tileSize = Math.min((size.width - 30) / xCount, 64)
  
  return (
    <Stage 
      width={xCount * tileSize} 
      height={yCount * tileSize} 
      >
      <GameMap game={game} tileSize={tileSize}/>
      {selectedStrategyIndex !== undefined && strategies[selectedStrategyIndex] 
        && <StrategyMap tileSize={tileSize} game={game} actions={strategies[selectedStrategyIndex].actions} />}
    </Stage>
  )
}