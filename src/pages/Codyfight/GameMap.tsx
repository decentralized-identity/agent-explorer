import { Container, Sprite } from '@pixi/react';
import { GameState, MapCellState } from './lib/codyfight-game-client/src';


export const GameMap: React.FC<{
  game: GameState,
  tileSize: number
}> = ({ game, tileSize }) => {
  return (
  <Container position={[0, 0]} anchor={0} alpha={0.5}>
    {game.map.map((row, x) => row.map((cell, y) => <MapTile tileSize={tileSize} key={`${x}-${y}`} cell={cell} />))}
    {game.players.bearer.position !== null && <Sprite 
      anchor={0} 
      x={game.players.bearer.position.x * tileSize} 
      y={game.players.bearer.position.y * tileSize} 
      width={tileSize} 
      height={tileSize} 
      image={`/assets/codyfighter/${game.players.bearer.codyfighter.type}.png`} 
    />}
    {game.players.opponent.position !== null && <Sprite 
      anchor={0} 
      x={game.players.opponent.position.x * tileSize} 
      y={game.players.opponent.position.y * tileSize} 
      width={tileSize} 
      height={tileSize} 
      image={`/assets/codyfighter/${game.players.opponent.codyfighter.type}.png`} 
    />}
    {game.special_agents.map((agent, i) => <Sprite 
      key={i} 
      anchor={0} 
      x={agent.position.x * tileSize} 
      y={agent.position.y * tileSize} 
      width={tileSize} 
      height={tileSize} 
      image={`/assets/special-agent/${agent.type}.png`} 
    />)}
  </Container>
  )
}


export const MapTile: React.FC<{
  cell: MapCellState
  tileSize: number
}> = ({ cell, tileSize }) => {
  return (
    <Sprite 
      anchor={0} 
      x={cell.position.x * tileSize} 
      y={cell.position.y * tileSize} 
      width={tileSize} 
      height={tileSize}
      image={assetUrl(cell)}
      />
  )
}

function assetUrl (cell: MapCellState) {
  switch (cell.type) {
    case 0:
      return '/assets/tiles/blank.png'
    case 1:
      return '/assets/tiles/wall.png'
    case 2:
      return '/assets/tiles/exit.png'
    case 3:
      return '/assets/tiles/wall.png'
    case 4:
      return '/assets/tiles/armor-regenerator.png'
    case 6:
      return '/assets/tiles/hp-generator.png'
    case 7:
      return '/assets/tiles/slider-up.png' 
    case 8:
      return '/assets/tiles/slider-down.png' 
    case 9:
      return '/assets/tiles/slider-left.png' 
    case 10:
      return '/assets/tiles/slider-right.png' 
    case 11:
      return '/assets/tiles/teleport.png'
    case 12:
      return '/assets/tiles/pit.png'
    case 17:
      return '/assets/tiles/lesser-obstacle.png'
    default:
      console.log('Unknown cell type', cell.type, cell)
      return '/assets/tiles/unknown.png'
  }
}