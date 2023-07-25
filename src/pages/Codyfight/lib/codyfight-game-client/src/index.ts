
export const DELAY_TIMER = 60 * 1000;
export const GAME_STATUS_INIT = 0;
export const GAME_STATUS_PLAYING = 1;
export const GAME_STATUS_TERMINATED = 2;
export const TILE_BLANK = 1;
export const TILE_EXIT_GATE = 2;
export const TILE_PIT = 12;
export const TILE_WALL = 0;
export const TILE_SLIDER_UP = 7;
export const TILE_SLIDER_DOWN = 8;
export const TILE_SLIDER_LEFT = 9;
export const TILE_SLIDER_RIGHT = 10;


export interface SkillState {
  id: number;
  name: string;
  type: number;
  description: string;
  level: number;
  status: number;
  cost: number;
  cooldown: number;
  possible_targets: Position[];
}

export interface PlayerState {
  name: string;
  owner: string;
  stats: {
    is_alive: boolean;
    is_demolished: boolean;
    armor: number;
    armor_cap: number;
    hitpoints: number;
    hitpoints_cap: number;
    energy: number;
    energy_cap: number;
    movement_range: number;
    movement_range_cap: number;
    durability: number;
    durability_cap: number;
    is_stunned: boolean;
    stun_duration: number;
  };
  codyfighter: {
    type: number;
    name: string;
  };
  turn: number;
  position: Position;
  possible_moves: {
    x: number;
    y: number;
    direction: string;
  }[];
  is_player_turn: boolean;
  skills: SkillState[];
  score: {
    points: number;
    ryo_count: number;
    exit_count: number;
    kill_count: number;
    death_count: number;
  };
}

export interface MapCellState {
  id: number;
  type: number;
  name: string;
  position: Position;
  config: {
    is_charged?: boolean;
  } | []; // Why is this an array?
}

export interface Position {
  x: number;
  y: number;
}

export interface SpecialAgentState {
  id: number;
  type: number;
  name: string;
  position: Position;
  stats: {
    armor: number;
    hitpoints: number;
    energy: number;
    movement_range: number;
    stun_duration: number;
  };
}

export interface GameState {
  state: {
    id: number;
    status: number;
    mode: number;
    round: number;
    total_turns: number;
    total_rounds: number;
    max_turn_time: number;
    turn_time_left: number;
  },
  players: {
    bearer: PlayerState,
    opponent: PlayerState,
  },
  special_agents: SpecialAgentState[],
  map: Array<Array<MapCellState>>,
  verdict: {
    winner: string | null;
    statement: string | null;
    context: string;
  },
}

export interface GameAction {
  type: 'move' | 'skill'
  skill?: SkillState
  position: Position
}

export interface GameStrategy {
  name: string
  description: string
  actions: GameAction[]
}