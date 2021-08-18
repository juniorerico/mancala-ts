import React, { useEffect, useRef, useState, useCallback } from "react";
import { useWindowResize } from "beautiful-react-hooks";
import Hole from "./Hole";
import styled from "styled-components";
import Stone from "./Stone";
import Store from "./Store";
import { Constants, StoneColors, STONES_PER_HOLE } from "../common/Constants";

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

interface Size {
  width: number;
  height: number;
}

interface Position {
  top: number;
  left: number;
}

interface BoardProps {
  className?: string;
}

interface HoleInfo {
  row: number;
  col: number;
  stones: number;
}

interface StoneInfo {
  hole: HTMLDivElement;
  position: Position;
  row: number;
  col: number;
  animationDelay: number;
  color: string;
  isInStore: boolean;
}

const Board = ({ className }: BoardProps) => {
  const [isRotated, setIsRotated] = useState(false);
  const [stones, setStones] = useState<StoneInfo[]>(new Array(Constants.BOARD_COLS * Constants.STONES_PER_HOLE));
  const [holes, setHoles] = useState<HoleInfo[][]>([new Array(Constants.BOARD_COLS), new Array(Constants.BOARD_COLS)]);
  const [imageSize, setImageSize] = useState<Size>({ height: 0, width: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [leftStoreStones, setLeftStoreStones] = useState(0);
  const [rightStoreStones, setRightStoreStones] = useState(0);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);

  // reference to the board image
  let imageRef = useRef<HTMLImageElement>(null);
  let holesRef = useRef<HTMLDivElement[][]>([new Array(Constants.BOARD_COLS), new Array(Constants.BOARD_COLS)]);
  let leftStoreRef = useRef<HTMLImageElement>(null);
  let rightStoreRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    resetHoles();
  }, []);

  useEffect(() => {
    repositionStones();
  }, [isRotated]);

  useEffect(() => {
    if (!isLoading) {
      setInitialState();
    }
  }, [isLoading]);

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
      holesRef.current[indexes.row][indexes.col] = element;
    }
  }, []);

  /**
   * Logic to handle when the user clicks a hole
   */
  const onClickHole = useCallback(
    (e) => {
      let currentHole = e.target as HTMLDivElement;
      let holeIdx = getHoleIndexes(currentHole);

      // check if user clicked on the oponent holes
      if (holeIdx.row == 0) {
        console.log(holeIdx);
        console.log("Can't play with the opponent holes");
        return;
      }

      // check if the animation is still running
      if (isAnimationRunning) {
        console.log("You must wait the animation finishes.");
        return;
      }

      let newStones = [...stones];
      let newHoles = [...holes];
      let stonesInHole = newStones.filter((stone) => stone.hole === currentHole);

      // check if there is no stones in the hole
      if (stonesInHole.length == 0) {
        console.log("Can't play with empty holes");
        return;
      }

      newHoles[holeIdx.row][holeIdx.col].stones = 0;

      let animationDelay = Constants.ANIMATION_DELAY;

      stonesInHole.forEach((stone, i) => {
        holeIdx = getHoleIndexes(currentHole);
        let row = holeIdx.row;
        let col = holeIdx.col;

        if (row == 0) {
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
        currentHole = holesRef.current[row][col];

        newHoles[row][col].stones++;
        stone.hole = currentHole;
        stone.animationDelay = animationDelay * (i + 1);
        if (leftStoreRef.current)
          //stone.position = getRandomPositionInStore(leftStoreRef.current.getBoundingClientRect());
          stone.position = getRandomPositionInHole(currentHole.getBoundingClientRect());
      });

      setStones(newStones);
    },
    [stones]
  );

  /**
   * Reset the holes to initial state
   */
  function resetHoles() {
    let newHoles: HoleInfo[][] = [new Array(Constants.BOARD_COLS), new Array(Constants.BOARD_COLS)];

    for (let i = 0; i < holes.length; i++) {
      for (let j = 0; j < holes[i].length; j++) {
        newHoles[i][j] = { row: i, col: j, stones: Constants.STONES_PER_HOLE };
      }
    }

    setHoles(newHoles);
    setLeftStoreStones(0);
    setRightStoreStones(0);
  }

  /**
   * Get a random position inside a hole that fits a stone
   *
   * @param holeRect HTMLElement.getBoundingClientRect()
   * @returns
   */
  function getRandomPositionInHole(holeRect: DOMRect): Position {
    // get a smaller radius because of the piece size;
    let radius = holeRect.width / 3.5;

    // estimated stone size (would be good to have the stone reference to get this info)
    let stoneSize = window.innerWidth * Constants.STONE_SIZE;

    // Limited just for 3 quadrands of the circle (-1.5)
    let angle = Math.random() * -1.5 * Math.PI;
    let hyp = Math.sqrt(Math.random()) * radius;
    let adj = Math.cos(angle) * hyp;
    let opp = Math.sin(angle) * hyp;

    let xCenter = holeRect.width / 2 + holeRect.left - stoneSize / 2;
    let yCenter = holeRect.width / 2 + holeRect.top - stoneSize / 2;

    return { left: xCenter + adj, top: yCenter + opp };
  }

  /**
   * Get a random position inside a store that fits a stone
   *
   * @param storeRect HTMLElement.getBoundingClientRect()
   * @returns
   */
  function getRandomPositionInStore(storeRect: DOMRect): Position {
    let topMin = storeRect.top + storeRect.height * 0.2;
    let topMax = storeRect.top + storeRect.height - storeRect.height * 0.2;

    let leftMin = storeRect.left;
    let leftMax = storeRect.left + storeRect.width;

    return { left: Math.random() * (leftMax - leftMin) + leftMin, top: Math.random() * (topMax - topMin) + topMin };
  }

  /**
   * Get the row and col from a HTML element dataset
   * @param hole
   * @returns
   */
  function getHoleIndexes(hole: HTMLDivElement) {
    let row = parseInt(hole.dataset.row as string);
    let col = parseInt(hole.dataset.col as string);

    return { row, col };
  }

  /**
   * Set the board initial state
   */
  function setInitialState() {
    resetHoles();
    repositionStones();
  }

  function repositionStones() {
    let newStones: StoneInfo[] = [];

    holesRef.current.forEach((row_array, row) => {
      row_array.forEach((holeElement, col) => {
        for (let i = 0; i < holes[row][col].stones; i++) {
          let color = Object.values(StoneColors)[i % STONES_PER_HOLE];
          let rect = holeElement.getBoundingClientRect();
          let randomPos = getRandomPositionInHole(rect);
          let position = { top: randomPos.top, left: randomPos.left };

          if (isRotated) {
            //position = { left: randomPos.top, top: randomPos.left };
          }

          newStones.push({
            hole: holeElement,
            position,
            color,
            row,
            col,
            animationDelay: Constants.ANIMATION_DELAY,
            isInStore: false,
          });
        }
      });
    });

    setStones(newStones);
  }

  /**
   * Render the holes
   *
   * @returns
   */
  function renderHoles(): React.ReactNode {
    return (
      <HolesSection className={"holes-section"}>
        {holes.map((row_val, row) => (
          <PlayerHoles className={row == 0 ? "player-0" : "player-1"} key={`player-hole-${row}`}>
            {row_val.map((hole, col) => {
              return (
                <Hole
                  ref={addHoleRef}
                  row={row}
                  col={col}
                  key={`hole-${row}-${col}`}
                  counterOnTop={row == 1}
                  stones={hole.stones}
                  isClickable={row == 1}
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
    return stones.map((stone, i) => {
      return (
        <Stone
          key={`stone-${i}`}
          className={"stone " + stone.row + "-" + stone.col}
          color={stone.color}
          animationDelay={stone.animationDelay}
          position={stone.position}
          isClickable={stone.hole.dataset.row == "1"}
          onClick={() => stone.hole.click()}
        />
      );
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
          <Store isTop={true} stones={leftStoreStones} ref={leftStoreRef} className={"player0-store-section"} />
          {renderHoles()}
          <Store isTop={false} stones={rightStoreStones} ref={rightStoreRef} className={"player1-store-section"} />
        </PlayableArea>
      </Container>
      <div className={"stones-wrapper"}>{renderStones()}</div>
    </>
  );
};

export default Board;
