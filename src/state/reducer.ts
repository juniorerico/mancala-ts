import { GameState, initialState } from "./state";
import { ActionType, GameActions } from "./actions";
import { Constants, States } from "../common/Constants";

export function gameReducer(state: GameState, action: GameActions): GameState {
  switch (action.type) {
    case ActionType.Hole_PutStone:
      return {
        ...state,
        holes: state.holes.map((arr, i) => {
          if (i !== action.payload.holeIndex.row) return arr;
          return arr.map((hole, j) => {
            if (j !== action.payload.holeIndex.col) return hole;
            return {
              ...hole,
              stones: hole.stones + 1,
            };
          });
        }),
        stones: state.stones.map((stone, _) => {
          if (stone.id === action.payload.stoneId) {
            return {
              ...stone,
              holeIndex: { row: action.payload.holeIndex.row, col: action.payload.holeIndex.col },
              animationDelay: action.payload.animationDelay,
            };
          }
          return stone;
        }),
      };
    case ActionType.Hole_CollectStones:
      return {
        ...state,
        holes: state.holes.map((arr, i) => {
          if (i !== action.payload.row) return arr;
          return arr.map((hole, j) => {
            if (j !== action.payload.col) return hole;
            return {
              ...hole,
              stones: 0,
            };
          });
        }),
      };
    case ActionType.Hole_SetRef:
      return {
        ...state,
        holes: state.holes.map((arr, i) => {
          if (i !== action.payload.row) return arr;
          return arr.map((hole, j) => {
            if (j !== action.payload.col) return hole;
            return {
              ...hole,
              ref: action.payload.ref,
            };
          });
        }),
      };
    case ActionType.Store_SetRef:
      return {
        ...state,
        stores: state.stores.map((store, i) => {
          if (i === action.payload.index) return { ...store, ref: action.payload.ref };
          return store;
        }),
      };
    case ActionType.Stone_Collect:
      return {
        ...state,
        stones: state.stones.map((stone, _) => {
          if (stone.id === action.payload.stoneId) {
            return {
              ...stone,
              holeIndex: { row: -1, col: -1 },
              animationDelay: action.payload.animationDelay,
              isInStore: true,
              store: state.currentPlayer,
            };
          }
          return stone;
        }),
        stores: state.stores.map((store, i) => {
          if (i === state.currentPlayer) return { ...store, score: store.score + 1 };
          return store;
        }),
      };
    case ActionType.Game_NextPlayer:
      return {
        ...state,
        currentPlayer: state.currentPlayer === 0 ? 1 : 0,
      };
    case ActionType.Game_Reset:
      return {
        ...initialState,
        holes: state.holes.map((arr, i) => {
          return arr.map((hole, j) => {
            return {
              ...hole,
              stones: Constants.STONES_PER_HOLE,
            };
          });
        }),
      };
    case ActionType.Game_Start:
      return {
        ...state,
        currentPlayer: action.payload.currentPlayer,
        gameState: States.WAITING_FOR_PLAY,
        botLevel: action.payload.botLevel ? action.payload.botLevel : state.botLevel,
      };
    default:
      return state;
  }
}
