import { GameAction, GameState, GameStrategy } from "../lib/codyfight-game-client/src";
import { dijkstra } from "../utils/dijkstra";

export function getKillOpponentStrategyActions(game: GameState): GameStrategy {
  let strategyActions: GameAction[] = []
  const actions =game.players.bearer.position !== null && game.players.opponent.position !== null ? dijkstra(
    game, 
    game.players.bearer.position, 
    game.players.opponent.position
  ) : []

  if (game.players.bearer.position !== null && game.players.opponent.position !== null) {
    actions?.pop()
    actions?.shift()
  }
  if (actions !== null) {
    strategyActions = actions
  }

  // TODO: kill opponent
  strategyActions.push({
    type: 'skill',
    skill: game.players.bearer.skills.find(skill => skill.name === 'Blade Strike')!,
    position: game.players.opponent.position
  })

  return {
    name: 'Kill Opponent',
    description: 'Kill Opponent',
    actions: strategyActions
  }

}