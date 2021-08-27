import React, { useEffect, useRef, useState, useCallback, useContext } from "react";
import styled from "styled-components";
import { useWindowResize } from "beautiful-react-hooks";
import Hole from "./Hole";
import Stone from "./Stone";
import Store from "./Store";
import { bestMove } from "../lib/minimax";
import { Constants, States } from "../common/Constants";
import { GameState, Index, initialState, ControlBoard, Size } from "../state/state";
import { ActionType } from "../state/actions";
import { GameContext } from "../state/context";

// Styled components

// Board container
const Container = styled.div`
  position: relative;

  &.rotated {
    top: 0px;
    transform: rotate(90deg) translateY(-100%);
    transform-origin: top left;
  }
`;

// Board img
const BoardImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 97.5vw;
  height: auto;

  @media (orientation: portrait) {
    width: calc(var(--vh, 1vh) * 97.5);
  }
`;

const PlayableArea = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const HolesSection = styled.div`
  height: 80%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 66%;
`;

const PlayerHoles = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
`;

interface BoardProps {
  className?: string;
  onError?: (message: string) => void;
}

const Board = ({ className, onError }: BoardProps) => {
  console.log("render board...");
  const { state, dispatch } = useContext(GameContext);
  const [isRotated, setIsRotated] = useState(false);
  const [imageSize, setImageSize] = useState<Size>({ height: 0, width: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);

  // reference to the board image
  let imageRef = useRef<HTMLImageElement>(null);
  let stateRef = useRef<GameState>(initialState);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (ControlBoard.isGameOver()) {
      dispatch({ type: ActionType.Game_Reset });
    }
  }, [state.currentPlayer]);

  useEffect(() => {
    if (state.gameState == States.WAITING_FOR_PLAY && !ControlBoard.isGameOver()) {
      if (ControlBoard.currentPlayer === ControlBoard.players[0]) {
        console.log("bot level: " + state.botLevel);
        bestMove(ControlBoard, state.botLevel).then((move) => {
          console.log(`${ControlBoard.currentPlayer.name} played move: ` + move);
          setTimeout(() => {
            makeMove(0, move);
          }, 1000);
        });
      } else {
        /* bestMove(ControlBoard, 1).then((move) => {
          console.log(`${ControlBoard.currentPlayer.name} played move: ` + move);
          makeMove(1, move);
        }); */
      }
    }
  }, [state.currentPlayer, state.botLevel, state.gameState]);

  /**
   * Handle window resize
   */
  useWindowResize(() => {
    resize();
  });

  /**
   * update parameters of the board
   */
  const resize = () => {
    if (imageRef.current) {
      let imageRatio = imageRef.current.naturalWidth / imageRef.current.naturalHeight;

      if (window.innerWidth >= window.innerHeight) {
        setImageSize({
          width: window.innerWidth * Constants.IMAGE_SCALE,
          height: (window.innerWidth * Constants.IMAGE_SCALE) / imageRatio,
        });
      } else {
        setImageSize({
          width: window.innerHeight * Constants.IMAGE_SCALE,
          height: (window.innerHeight * Constants.IMAGE_SCALE) / imageRatio,
        });
      }
    }

    // check if the screen is vertical or horizontal
    if (window.innerWidth >= window.innerHeight) {
      setIsRotated(false);
    } else {
      setIsRotated(true);
    }
  };

  /**
   * Run when the board image is loaded
   */
  const onLoadImage = useCallback(() => {
    resize();
    setIsLoading(false);
  }, []);

  /**
   * Save the hole reference
   */
  const addHoleRef = useCallback((element: HTMLDivElement) => {
    if (element && element.dataset && element.dataset.row && element.dataset.col) {
      let indexes = getHoleIndexes(element);
      dispatch({ type: ActionType.Hole_SetRef, payload: { row: indexes.row, col: indexes.col, ref: element } });
    }
  }, []);

  /**
   * Save the store reference
   */
  const addStoreZeroRef = useCallback((element: HTMLDivElement) => {
    if (element) {
      dispatch({ type: ActionType.Store_SetRef, payload: { index: 0, ref: element } });
    } else {
      console.log("no ref for store 0");
    }
  }, []);

  /**
   * Save the store reference
   */
  const addStoreOneRef = useCallback((element: HTMLDivElement) => {
    if (element) {
      dispatch({ type: ActionType.Store_SetRef, payload: { index: 1, ref: element } });
    } else {
      console.log("no ref for store 1");
    }
  }, []);

  /**
   * Logic to handle when the user clicks a hole
   */
  const onClickHole = useCallback(
    (e) => {
      let currentHole = e.target as HTMLDivElement;
      let holeIdx = getHoleIndexes(currentHole);

      if (ControlBoard.isGameOver()) {
        displayError("The game is already over!");
        return;
      }

      if (state.currentPlayer == 0) {
        displayError("It is not your turn yet.");
        return;
      }

      if (isAnimationRunning) {
        displayError("Wait until the animation is finished.");
        return;
      }

      if (holeIdx.row === 0) {
        displayError("Can't play with opponent pieces.");
        return;
      }

      if (!ControlBoard.isMoveValid(ControlBoard.players[stateRef.current.currentPlayer], holeIdx.col)) {
        displayError("Move is not valid!");
        return;
      }

      makeMove(holeIdx.row, holeIdx.col);
    },
    [state.currentPlayer, isAnimationRunning]
  );

  function displayError(message: string) {
    if (onError) onError(message);
  }

  /**
   *
   * @param playerIndex
   * @param holeIndex
   */
  function makeMove(playerIndex: number, holeIndex: number) {
    distributeStones({ row: playerIndex, col: holeIndex }).then((index) => {
      countScores(index).then(() => {
        dispatch({ type: ActionType.Game_NextPlayer });
        ControlBoard.makeMove(holeIndex);
        setIsAnimationRunning(false);
      });
    });
  }

  /**
   * Distribute the stones to other holes. This will start the animation.
   *
   * @param currentHole
   * @returns
   */
  function distributeStones(holeIndex: Index): Promise<Index> {
    setIsAnimationRunning(true);

    return new Promise((resolve) => {
      let stonesInHole = stateRef.current.stones.filter(
        (stone) => stone.holeIndex.row == holeIndex.row && stone.holeIndex.col == holeIndex.col
      );

      dispatch({ type: ActionType.Hole_CollectStones, payload: holeIndex });

      let row = holeIndex.row;
      let col = holeIndex.col;
      stonesInHole.forEach((stone, i) => {
        if (row === 0) {
          if (col > 0) {
            col--;
          } else {
            row = 1;
          }
        } else {
          if (col < 5) {
            col++;
          } else {
            row = 0;
          }
        }

        dispatch({
          type: ActionType.Hole_PutStone,
          payload: {
            stoneId: stone.id,
            holeIndex: { row, col },
            animationDelay: Constants.ANIMATION_DELAY * (i + 1),
          },
        });
      });

      // wait the animation to finish
      setTimeout(() => {
        resolve({ row, col });
      }, Constants.ANIMATION_DELAY * stonesInHole.length + Constants.ANIMATION_DURATION);
    });
  }

  function countScores(holeIndex: Index): Promise<void> {
    return new Promise((resolve) => {
      let row = holeIndex.row;
      let col = holeIndex.col;
      let currentHole = stateRef.current.holes[row][col];
      let animationDelay = 0;
      let currentPlayerIndex = ControlBoard.players.findIndex((p) => p === ControlBoard.currentPlayer);

      // count the scoresw
      while ((currentHole.stones === 2 || currentHole.stones === 3) && currentHole.row !== currentPlayerIndex) {
        // increase the user's score

        let stonesInHole = stateRef.current.stones.filter(
          (stone) => !stone.isInStore && stone.holeIndex.row === row && stone.holeIndex.col === col
        );

        stonesInHole.forEach((stone, i) => {
          dispatch({
            type: ActionType.Stone_Collect,
            payload: { stoneId: stone.id, animationDelay: Constants.ANIMATION_DELAY * (i + 1) },
          });
          animationDelay += Constants.ANIMATION_DELAY * (i + 1);
        });

        dispatch({ type: ActionType.Hole_CollectStones, payload: { row, col } });

        // move clockwise to check if other holes also score
        if (row === 0) {
          if (col < 5) {
            col++;
          } else {
            row = 1;
          }
        } else {
          if (col > 0) {
            col--;
          } else {
            row = 0;
          }
        }

        currentHole = stateRef.current.holes[row][col];
      }

      // wait the animation to finish
      setTimeout(() => {
        resolve();
      }, animationDelay);
    });
  }

  /**
   * Get the row and col from a HTML element dataset
   * @param hole
   * @returns
   */
  function getHoleIndexes(hole: HTMLDivElement): Index {
    let row = parseInt(hole.dataset.row as string);
    let col = parseInt(hole.dataset.col as string);

    return { row, col };
  }

  /**
   * Render the holes
   *
   * @returns
   */
  function renderHoles(): React.ReactNode {
    return (
      <HolesSection className={"holes-section"}>
        {state.holes.map((row_val, row) => (
          <PlayerHoles className={row === 0 ? "player-0" : "player-1"} key={`player-hole-${row}`}>
            {row_val.map((hole, col) => {
              return (
                <Hole
                  ref={addHoleRef}
                  row={row}
                  col={col}
                  key={`hole-${row}-${col}`}
                  counterOnTop={row === 1}
                  stones={hole.stones}
                  isClickable={row === 1}
                  onClick={onClickHole}
                />
              );
            })}
          </PlayerHoles>
        ))}
      </HolesSection>
    );
  }

  /**
   * Render the stones
   *
   * @returns
   */
  function renderStones(): React.ReactNode {
    return state.stones.map((stone, i) => {
      if (!isLoading && state.holes[stone.holeIndex.row][stone.holeIndex.col].ref !== null) {
        return (
          <Stone
            index={i}
            key={i}
            color={stone.color}
            animationDelay={stone.animationDelay}
            holeIndex={stone.holeIndex}
            isClickable={stone.holeIndex.row === 1}
            isInStore={stone.isInStore}
            store={stone.store}
            onClick={() => {
              if (!stone.isInStore) {
                state.holes[stone.holeIndex.row][stone.holeIndex.col].ref?.click();
              }
            }}
          />
        );
      }
    });
  }

  return (
    <>
      <Container
        className={isRotated ? "rotated " : "" + className}
        style={{
          width: imageSize.width,
          height: imageSize.height,
          visibility: isLoading ? "hidden" : "visible",
        }}
      >
        <BoardImg
          style={{ width: imageSize.width, height: imageSize.height }}
          className="board-img"
          src="assets/board.png"
          onLoad={onLoadImage}
          ref={imageRef}
        />

        <PlayableArea className={"playable-area"}>
          <Store
            isTop={true}
            stones={state.stores[0].score}
            ref={addStoreZeroRef}
            className={"player0-store-section"}
          />
          {renderHoles()}
          <Store
            isTop={false}
            stones={state.stores[1].score}
            ref={addStoreOneRef}
            className={"player1-store-section"}
          />
        </PlayableArea>
      </Container>
      <div className={"stones-wrapper"}>{renderStones()}</div>
    </>
  );
};

export default React.memo(Board);
