import { GameAction, GameState, GameStrategy } from "../lib/codyfight-game-client/src";
import { dijkstra } from "../utils/dijkstra";

export function getCaptureMrRyoStrategyActions(game: GameState): GameStrategy {
  let strategyActions: GameAction[] = []

  const mrRyoPosition = game.special_agents.find(agent => agent.type === 1)?.position

  if (mrRyoPosition !== undefined && game.players.bearer.position !== null) {
    const actions = dijkstra(
      game, 
      game.players.bearer.position, 
      mrRyoPosition
    )
    
    if (actions !== null) {
      actions?.pop()
      actions?.shift()
      strategyActions = actions
    }

  }

  return {
    name: 'Capture Mr. Ryo',
    description: 'Capture Mr. Ryo',
    actions: strategyActions
  }

}