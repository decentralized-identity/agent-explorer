import { GameAction, GameState, MapCellState, Position } from "../lib/codyfight-game-client/src";

const isObstacle = (cell: MapCellState, game: GameState, end: Position) => {
  if (cell.type === 1 || cell.type === 3 || cell.type === 12 ) {
    return true;
  }
  const position = cell.position

  if (position.x === end.x && position.y === end.y) {
    return false;
  }

  if (game.special_agents.find(agent => agent.position.x === position.x && agent.position.y === position.y) !== undefined) {
    return true;
  }

  if (position.x === game.players.opponent.position?.x && position.y === game.players.opponent.position?.y) {
    return true;
  }
  return false;
};

const isTeleport = (cell: MapCellState) => {
  return cell.type === 11;
};

const teleportTo = (cell: MapCellState, game: GameState) => {
  let newPosition: Position | undefined = undefined;

  game.map.forEach((row, x) => {
    row.forEach((tile, y) => {
      if (isTeleport(tile) && tile.position.x !== cell.position.x && tile.position.y !== cell.position.y) {
        newPosition = tile.position;
      }
    });
  });

  return newPosition;
}

export const dijkstra = (game: GameState, start: Position, end: Position) => {
  const grid = game.map
  const rows = grid.length;
  const cols = grid[0].length;

  const distances: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const predecessors: Position[][] = Array.from({ length: rows }, () => Array(cols).fill(null));

  distances[start.x][start.y] = 0;

  const queue: Position[] = [start];

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Up, Down, Left, Right

  while (queue.length > 0) {
    const current = queue.shift()!;
    const distance = distances[current.x][current.y];

    directions.forEach(([dx, dy]) => {
      const x = current.x + dx;
      const y = current.y + dy;

      if (
        x < 0 || // checks if cell is inside the grid
        x >= rows || // checks if cell is inside the grid
        y < 0 || // checks if cell is inside the grid
        y >= cols || // checks if cell is inside the grid
        distances[x][y] !== Infinity || // checks if the next Position is already visited
        isObstacle(grid[x][y], game, end) // checks if the next Position is an obstacle
      ) {
        return;
      }

      distances[x][y] = distance + 1;
      predecessors[x][y] = current;
      queue.push({ x, y });
    });

    // handle teleport
    if (isTeleport(grid[current.x][current.y])) {
      const pos = teleportTo(grid[current.x][current.y], game);
      if (pos) {
        const { x, y } = pos;
        if (distances[x][y] === Infinity) {
          distances[x][y] = distance + 1;
          predecessors[x][y] = current;
          queue.push({ x, y });
        }
      }
    }
  }

  if (distances[end.x][end.y] === Infinity) {
    return null; // return null if there is no path
  }

  // construct the shortest path
  const actions: GameAction[] = [];
  for (let Position: Position | null = end; Position; Position = predecessors[Position.x][Position.y]) {
    actions.push({type:'move', position: Position});
  }
  actions.reverse(); // reverse to get the path from start to end

  return actions;
};
