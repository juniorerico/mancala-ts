import React from "react";
import { GameState, initialState } from "./state";
import { GameActions } from "./actions";

export const GameContext = React.createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameActions>;
}>({
  state: initialState,
  dispatch: () => undefined,
});
