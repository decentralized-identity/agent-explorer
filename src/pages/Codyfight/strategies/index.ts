import { GameState, GameStrategy } from "../lib/codyfight-game-client/src"
import { getCaptureMrRyoStrategyActions } from "./capture-mrryo"
import { getKillOpponentStrategyActions } from "./kill-opponent"
import { getValidMovesStrategyActions } from "./valid-moves"

export const getAllStrategies = (game: GameState): GameStrategy[] => {
  return [
    getKillOpponentStrategyActions(game),
    getCaptureMrRyoStrategyActions(game),
    getValidMovesStrategyActions(game),
  ]
}