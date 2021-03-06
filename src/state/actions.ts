import { States } from "../common/Constants";
import { Index } from "./state";

export enum ActionType {
  Hole_PutStone,
  Hole_CollectStones,
  Hole_SetRef,
  Store_SetRef,
  Stone_Collect,
  Game_NextPlayer,
  Game_MakeMove,
  Game_Start,
  Game_Reset,
}

export interface Hole_PutStones {
  type: ActionType.Hole_PutStone;
  payload: { stoneId: number; holeIndex: Index; animationDelay: number };
}

export interface Hole_CollectStones {
  type: ActionType.Hole_CollectStones;
  payload: { row: number; col: number };
}

export interface Hole_SetRef {
  type: ActionType.Hole_SetRef;
  payload: { row: number; col: number; ref: HTMLDivElement };
}

export interface Store_SetRef {
  type: ActionType.Store_SetRef;
  payload: { index: 0 | 1; ref: HTMLDivElement };
}

export interface Stone_Collect {
  type: ActionType.Stone_Collect;
  payload: { stoneId: number; animationDelay: number };
}

export interface Game_MakeMove {
  type: ActionType.Game_MakeMove;
  payload: { move: number };
}

export interface Game_NextPlayer {
  type: ActionType.Game_NextPlayer;
}
export interface Game_Reset {
  type: ActionType.Game_Reset;
}

export interface Game_Start {
  type: ActionType.Game_Start;
  payload: { currentPlayer: 0 | 1; botLevel: number };
}

export type GameActions =
  | Hole_PutStones
  | Hole_CollectStones
  | Hole_SetRef
  | Store_SetRef
  | Stone_Collect
  | Game_MakeMove
  | Game_NextPlayer
  | Game_Reset
  | Game_Start;
