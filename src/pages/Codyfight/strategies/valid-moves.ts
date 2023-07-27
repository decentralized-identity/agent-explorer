import { GameState, GameStrategy } from "../lib/codyfight-game-client/src";

export function getValidMovesStrategyActions(game: GameState): GameStrategy {
  let strategies: GameStrategy[] = [];

  game.players.bearer.possible_moves.forEach((move) => {
    strategies.push({
      name: 'Move: ' + move.direction,
      description: 'Move',
      actions: [{
        type: 'move',
        position: move
      }]
    });
  });

  game.players.bearer.skills.forEach((skill) => {
    skill.possible_targets.forEach((position) => {
      strategies.push({
        name: 'Skill: ' + skill.name,
        description: 'Cast skill',
        actions: [{
          type: 'skill',
          skill: skill,
          position: position
        }]
      });
    });
  });
  return {
    name: 'Random',
    description: 'Random',
    actions: [strategies[Math.floor(Math.random() * strategies.length)].actions[0]]
  };

}