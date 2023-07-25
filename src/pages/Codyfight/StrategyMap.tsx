import { Container, Sprite } from '@pixi/react';
import { GameAction, GameState } from './lib/codyfight-game-client/src';
import { TILE_SIZE } from './consts';


export const StrategyMap: React.FC<{
  game: GameState
  actions: GameAction[]
}> = ({ game, actions }) => {

  return (
  <Container position={[0, 0]} anchor={0} alpha={0.4}>
    {actions.map((action, i) => <Sprite 
      key={i}
      anchor={0} 
      x={action.position.x * TILE_SIZE} 
      y={action.position.y * TILE_SIZE} 
      width={TILE_SIZE} 
      height={TILE_SIZE}
      image={
        action.type === 'move' 
        ? `/assets/codyfighter/${game.players.bearer.codyfighter.type}.png` 
        : '/assets/skills/' + action.skill?.type + '.svg' 
      }
      />)}
  </Container>
  )
}
