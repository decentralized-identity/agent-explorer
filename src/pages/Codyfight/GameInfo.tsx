import React from 'react'
import { GAME_STATUS_TERMINATED, GameState } from './lib/codyfight-game-client/src'
import { Progress, Tag, Typography } from 'antd'

export const GameInfo: React.FC<{
  game: GameState,
}> = ({ game }) => {
  return (
    <Typography.Paragraph>
    {game.state.status === GAME_STATUS_TERMINATED && <Tag color="error">Terminated</Tag>}
    {game.state.status === GAME_STATUS_TERMINATED && <Tag color="info">{game.verdict.context}, {game.verdict.statement}{game.verdict.winner ? ', winner: ' + game.verdict.winner : ''}</Tag>}
    {game.state.status !== GAME_STATUS_TERMINATED && <Tag color="success" icon={<Progress
      type="circle"
      percent={game ? game.state.turn_time_left / game.state.max_turn_time * 100 : 0}
      strokeWidth={10}
      size={10}
    />}>{game.verdict.context} {game.verdict.statement}{game.verdict.winner ? ' winner: ' + game.verdict.winner : ''}</Tag>}
    <Tag color="info">round: {game.state.round + 1} / {game.state.total_rounds}</Tag>
    {game.players?.opponent?.name && <Tag color="info">opponent: {game.players.opponent.name}</Tag>}
    
  </Typography.Paragraph>
  )
}