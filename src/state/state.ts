import { Constants, States, StoneColors } from "../common/Constants";

export interface Index {
  row: number;
  col: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  top: number;
  left: number;
}

export interface HoleInfo {
  ref: HTMLDivElement | null;
  row: number;
  col: number;
  stones: number;
}

export interface Store {
  ref: HTMLDivElement | null;
  score: number;
}

export interface StoneInfo {
  id: number;
  holeIndex: Index;
  animationDelay: number;
  color: string;
  isInStore: boolean;
  store: -1 | 0 | 1;
}

export interface GameState {
  botLevel: number;
  holes: HoleInfo[][];
  stones: StoneInfo[];
  stores: Store[];
  currentPlayer: 0 | 1;
  gameState: States;
}

export const initialState: GameState = {
  botLevel: 1,
  gameState: States.LOADING,
  holes: [[], []].map((_, i) =>
    Array.from(new Array(Constants.BOARD_COLS)).map((_, j) => {
      return { row: i, col: j, stones: Constants.STONES_PER_HOLE, ref: null };
    })
  ),
  stones: Array.from(new Array(Constants.BOARD_ROWS * Constants.BOARD_COLS * Constants.STONES_PER_HOLE)).map((_, i) => {
    return {
      id: i,
      color: Object.values(StoneColors)[i % Constants.STONES_PER_HOLE],
      holeIndex: {
        row: Math.floor(i / (Constants.BOARD_COLS * Constants.STONES_PER_HOLE)),
        col:
          i < Constants.BOARD_COLS * Constants.STONES_PER_HOLE
            ? Math.floor(i / Constants.STONES_PER_HOLE)
            : Math.floor(i / Constants.STONES_PER_HOLE) - Constants.BOARD_COLS,
      },
      animationDelay: 0,
      isInStore: false,
      store: -1,
    };
  }),
  stores: Array.from(new Array(2)).map((_) => {
    return {
      ref: null,
      score: 0,
    };
  }),
  currentPlayer: 1,
};
