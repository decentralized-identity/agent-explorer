import { createMachine, actions, AnyEventObject } from 'xstate';
import { GameAPI } from './GameApi';
import { GAME_STATUS_TERMINATED, GameState, Position, SkillState } from '.';

const { assign } = actions;

const api = new GameAPI();

type GameContext = {
  ckey?: string;
  game?: GameState;
  error?: string;
};

interface GameStateEvent extends AnyEventObject {
  data?: GameState
};

interface ErrorEvent extends AnyEventObject {
  data?: any;
};

interface ConfigureEvent extends AnyEventObject {
  ckey?: string;
};

interface CastEvent extends AnyEventObject {
  position?: Position;
  skill?: SkillState;
  callback?: (data: GameState) => Promise<void>;
};

interface MoveEvent extends AnyEventObject {
  position?: Position;
  callback?: (data: GameState) => Promise<void>;
};


interface InitEvent extends AnyEventObject {
  mode?: 0 | 1 | 2 | 3;
  opponent?: string;
};

export const stateMachine = createMachine<GameContext>({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoCuA7AxgPa4BmAllNgE6QDERpF1YA2gAwC6ioADobGQAuZYtxAAPRAGYALG0wyATAHY2bABwBWKQDZNy5VIA0IAJ6JFlzGsXbFARhkBOTYvX31AX08nUGTGQQADZgtGS4QuxcSCB8AsKiMZIIynKYjuq2Hs5S7ibmCJrqMpiaMvaa2TpSThqK3r7oWIEh9AAWYPgA1lFicUIiuGLJMsrq1jI61TJyUvYqivnSY5jKinM66nNsSk72DSB+zRHCKEFkAF7hULQQxMcAboRdWEcBJ2Rnl9cI4U-4KASuCivRi-SBw0Q8ykykwOkUbB0bEUkykUk0TiWCCR8h0Bh0ThReJqbH2PkOTXeAy+V1wNzAVCohComB4QUBJGZaEwb3C1POtKgv1w-0BgxBnD6-AGiVAyR09h0mHUa3sGjVbGU8xkWJ05WVhk0GJcBPUXnJb3wHW61wAyoJAaE7rhHs9XpSrZ0unaHYIwMLRUCJdFeNKIUlEE40Zg0fopDsUWUpIszBZ7FJlepidUCVq9MoDpbrd66fbHbQGUyWWyOVyeR7iz7HQHCACg5xQaH4oNIYUtXCnHJnFn9GodamEOjYUplEjkzIVfZBzJC5SIJ1AtcAHJgcSCMt+2id2JhnsRhDzSrWI1sWpmjKKHRY+Owjx4wcZPR6Vf+df4Td0jue4HqELD2CGJ7drKEhQo+4zlOoGipNoS5OE+E65PIaGEqkMKPqSbBSD+WB-gBUBAfuvqgYoEHgmecpQvG9jWCqThZlqtgLuhBQzIoqweOoUZajU1T1BalI1qY1wAOKUgA7igAx0gAYsyADyPB8C6uCCBWjLMqy7KCJyVDcm8kkyfJinCCp6mafcOktm24odpKYKntByRRiUoxrLmZRbGxz5uPxSgeIoTjKHsOw6MRhkoFJdKyf4ClKVAqlUBpWlgDptz3AA6tZ1wZVlDmCMedGeVCuzKreiIqC4g4pgU9hLgoY4KoiMjaAqcUWUllIAEZgCgNBULAAAq1C4HpVbxcZdbmeyiVQMlWDDaNDKTdNTlisQwZSlBQznlGfEJroUxRakMjGBOmhsJopSbLYCKYWsD19ctln+BtY3bVQM1oIQDysG5XYysdDEXsorjKkUsgaJs7gwrq8xwjDrW+WioxEeJ-j9atQ0jX9U0A-QKCwOVYOQRDvZLrDJIonIUzZOoqN8XilSOAY2OGJ9CXfetxNbaTM3OmAADCjZ0gAkiQosAKK4OuEAVR5kMwdDhGrOUCL6PCEWOFiRRwpU6wKgiqSPrFeNYATa2YEDDzXHlLrvE8Lz1vjX0Df4Ts-H8rZ7cCrm0erdNrOMcE47oThobdLWEbC+sqIhMJp2SjTewLvtYP7dKzQZNYLaZXt2z7hN+8DAcikH7YcGrR0R-GmCRYRyJ1AY8xYnsfEzIRuTpqMX78ytDsApTLvi+7bpl-FY8ehTNlCoHzn7aHh20+eS6jDGZrFI4sw3eOBS9wosyD7Is6aDbWflznldYBPy+F9WRkmWZEkV+PS814GLkN2ppVDWyR6byDqniUkKFXBYjVDCUos5U5Jwzt4ckuBCDrngDEI4m9wxQ0xu1TImNbwzi0FiAAtCFTIUVzZEIXFsOKeAGDkEoDQCAuD6Ka0VH3OoxCmpjE0FiJmqwzSRSimhDwhJb4Un8C0MAHCqopHWAOTUTUbrahPogZwWE46WEVDjWYcU+SnAFNcBRIDIxXk2GqMYyZci1HsKjeQaJVDxwimxREcVPQ2lLFRcxvZ9B8XWJFLQRRLpBQnJYWEU4IquAqIScKcVSIQG3LuSijp-HbzcFhGESF0x6EREI9E6QCQRWtreRCDDbbz0Fpk-BnUFBRlaveVwewilOGsLIbQV99a6E0KPQWmBUrLxKvZbSgg6lcL0PBJpAkKiG2CkqSosdsZvlGAM3OmBfoi2mpM0BeIzpIkHDUXI2jlBYgXI9LMcxWI7GoWJO+NTNn5ygHsqEqhXxvjNHMbqiJBETk2K+VwshEK1FnDCDZj9MDPzMe5Ju29BxKhcGoJEMNgUwIBSqdIwKNCjAcA4fpqCgA */
  id: 'game',
  context: {},
  initial: 'unconfigured',
  states: {
    unconfigured: {
      on: {
        configure: {
          target: 'checkingState',
          actions: 'assignCkey',
        }
      }
    },
    idle: {
      on: {
        init: {
          target: 'initializing',
        },
        check: {
          target: 'checkingState',
        },
      },
    },
    initializing: {
      invoke: {
        src: 'init',
        onDone: {
          target: 'playingGame',
          actions: 'assignGame',
        },
        onError: {
          target: 'idle',
          actions: 'assignError',
        }
      },
    },
    checkingState: {
      invoke: {
        src: 'check',
        onDone: {
          target: 'decidingNextState',
          actions: 'assignGame',
        },
        onError: {
          target: 'idle',
          actions: 'assignError',
        }
      },
    },
    decidingNextState: {
      always: [
        { target: '#game.idle', cond: 'isTerminated' },
        { target: '#game.playingGame.waitingForOpponent', cond: 'isOpponentsTurn' },
        { target: '#game.playingGame.bearersTurn', cond: 'isBearersTurn' },
      ],
    },
    playingGame: {
      initial: 'waitingForOpponent',
      
      states: {
        waitingForOpponent: {
          on: {
            'doneWaitingForOpponent': {
              target: '#game.decidingNextState',
              actions: 'assignGame',
            }
          },
          invoke: {
            src: 'waitForOpponent',
            onError: { 
              target: '#game.idle',
              actions: 'assignError',
            },
          },
        },
        bearersTurn: {
          invoke: {
            src: 'checkIfTurnEnded',
            onError: { target: '#game.idle' },
          },
          on: {
            move: 'moving',
            cast: 'casting',
            doneCheckingIfTurnEnded: {
              target: "#game.decidingNextState",
              actions: 'assignGame',
            }

          },
        },
        moving: {
          invoke: {
            src: 'move',
            onDone: {
              target: '#game.decidingNextState',
              actions: 'assignGame',
            },
            onError: {
              target: '#game.decidingNextState',
              actions: 'assignError',
            }
          },
        },
        casting: {
          invoke: {
            src: 'cast',
            onDone: {
              target: '#game.decidingNextState',
              actions: 'assignGame',
            },
            onError: {
              target: '#game.decidingNextState',
              actions: 'assignError',
            }
          },
        },        
      },
    },
  },
}, {
  guards: {
    isTerminated: (context) => context.game?.state.status === GAME_STATUS_TERMINATED,
    isBearersTurn: (context) => context.game?.state.status !== GAME_STATUS_TERMINATED &&  !!context.game?.players.bearer.is_player_turn,
    isOpponentsTurn: (context) => context.game?.state.status !== GAME_STATUS_TERMINATED && !context.game?.players.bearer.is_player_turn,
  },
  actions: {
    assignGame: assign<GameContext, GameStateEvent>((context, event) => ({
      ...context,
      game: event.data,
      error: undefined,
    })),
    assignError: assign<GameContext, ErrorEvent>((context, event) => ({
      ...context,
      error: event.data.message,
    })),
    assignCkey: assign<GameContext, ConfigureEvent>((_, event) => ({
      ckey: event.ckey,
    })),
  },
});

export const services = {
  waitForOpponent: ({ ckey }: GameContext) => (callback: any) => {
    if (ckey !== undefined) {
      const interval = setInterval(async () => {
        const game = await api.check(ckey);
        if (game.players.bearer.is_player_turn) {
          callback({ type: 'doneWaitingForOpponent', data: game });
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  },
  checkIfTurnEnded: ({ ckey, game }: GameContext) => (callback: any) => {
    if (ckey !== undefined && game !== undefined) {
      const interval = setTimeout(async () => {
          callback({ type: 'doneCheckingIfTurnEnded', data: await api.check(ckey) });
      }, game.state.turn_time_left * 1000);
      return () => clearTimeout(interval);
    }
  },
  init: (context: GameContext, event: InitEvent) => {
    if (!context.ckey) return Promise.reject('Ckey is missing')
    if (event.mode === undefined) return Promise.reject('Ckey is missing')
    return api.init(context.ckey, event.mode, event.opponent) 
  },
  check: (context: GameContext) => {
    if (!context.ckey) return Promise.reject('Ckey is missing')
    return api.check(context.ckey) 
  },
  move: async (context: GameContext, event: MoveEvent) => {
    if (!context.ckey) return Promise.reject('Ckey is missing')
    if (event.position === undefined) return Promise.reject('Position is missing')
    const newState = await api.move(context.ckey, event.position.x, event.position.y);
    if (event.callback !== undefined) {
      await event.callback(newState);
    }
    return newState;

  },
  cast: async (context: GameContext, event: CastEvent) => {
    if (!context.ckey) return Promise.reject('Ckey is missing')
    if (event.position === undefined) return Promise.reject('Position is missing')
    if (event.skill === undefined) return Promise.reject('Skill is missing')
    const newState = await api.cast(context.ckey, event.skill.id, event.position.x, event.position.y);
    if (event.callback !== undefined) {
      await event.callback(newState);
    }
    return newState;
  },

};
