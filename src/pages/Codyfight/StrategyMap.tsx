import { Container, Sprite, useTick } from '@pixi/react';
import { GameAction, GameState } from './lib/codyfight-game-client/src';
import React from 'react';


let idx = 0;

export const StrategyMap: React.FC<{
  game: GameState
  actions: GameAction[]
  tileSize: number
}> = ({ game, actions, tileSize }) => {
  const [x, setX] = React.useState(0);

  useTick(delta => {
    idx += 0.05 * delta;

    setX(Math.min(Math.abs(Math.sin(idx)) + 0.3, 1));
  });

  return (
  <Container position={[0, 0]} anchor={0} alpha={1}>
    {actions.map((action, i) => <Sprite 
      key={i}
      alpha={ i === 0 ? 1 : 0.5}
      // scale={0.4}
      anchor={0.5} 
      x={action.position.x * tileSize + tileSize / 2} 
      y={action.position.y * tileSize + tileSize / 2} 
      width={tileSize * x} 
      height={tileSize * x}
      image={
        action.type === 'move' 
        ? `/assets/codyfighter/${game.players.bearer.codyfighter.type}.png` 
        : '/assets/skills/' + action.skill?.type + '.svg' 
      }
      />)}
  </Container>
  )
}
