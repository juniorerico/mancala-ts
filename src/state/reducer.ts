import { GameState, initialState, ControlBoard, Index } from "./state";
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
              //holeIndex: { row: -1, col: -1 },
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
    case ActionType.Game_MakeMove:
      let row = state.currentPlayer;
      let col = action.payload.move;

      let indexes: Index[] = [];

      return {
        ...state,
        holes: state.holes.map((arr, i) => {
          return arr.map((hole, j) => {
            if (i === state.currentPlayer && j === action.payload.move) {
              return {
                ...hole,
                stones: 0,
              };
            }
            return {
              ...hole,
            };
          });
        }),
        stones: state.stones.map((stone, i) => {
          if (stone.holeIndex.row === state.currentPlayer && stone.holeIndex.col === action.payload.move) {
            if (row === 0) {
              if (col > 0) col--;
              else row = 1;
            } else {
              if (col < 5) col++;
              else row = 0;
            }
            return {
              ...stone,
              holeIndex: { row, col },
              animationDelay: Constants.ANIMATION_DELAY * (i + 1),
            };
          }
          return stone;
        }),
      };
    case ActionType.Game_NextPlayer:
      return {
        ...state,
        currentPlayer: state.currentPlayer === 0 ? 1 : 0,
      };
    case ActionType.Game_Reset:
      ControlBoard.resetBoard();
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
        stores: state.stores.map((store) => {
          return {
            ...store,
            score: 0,
          };
        }),
      };
    case ActionType.Game_Start:
      ControlBoard.currentPlayer = ControlBoard.players[action.payload.currentPlayer];
      return {
        ...state,
        currentPlayer: action.payload.currentPlayer,
        gameState: States.WAITING_FOR_PLAY,
        botLevel: action.payload.botLevel ? action.payload.botLevel : state.botLevel,
        showNewGameDialog: false,
      };
    default:
      return state;
  }
}
