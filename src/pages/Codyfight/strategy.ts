import { GameAction, GameState, MapCellState, Position } from "./lib/codyfight-game-client/src";

const isObstacle = (cell: MapCellState) => {
  return cell.type === 1 || cell.type === 3 || cell.type === 12;
};

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
        isObstacle(grid[x][y]) // checks if the next Position is an obstacle
      ) {
        return;
      }

      distances[x][y] = distance + 1;
      predecessors[x][y] = current;
      queue.push({ x, y });
    });

    // handle teleport
    // if (grid[current.x][current.y].teleportTo !== undefined) {
    //   const { x, y } = grid[current.x][current.y].teleportTo;
    //   if (distances[x][y] === Infinity) {
    //     distances[x][y] = distance + 1;
    //     predecessors[x][y] = current;
    //     queue.push({ x, y });
    //   }
    // }
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
