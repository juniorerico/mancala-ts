import React, { useEffect, useState } from "react";
import Hole from "./Hole";
import styled from "styled-components";

// Styled components

// Board container
const Container = styled.div`
  position: relative;

  &.rotated {
    top: 0px;
    transform: rotate(90deg) translateY(-100%);
    transform-origin: top left;
  }

  &.rotated > .board-img {
    width: 97.5vh;
    width: calc(var(--vh, 1vh) * 97.5);
  }
`;

// Board img
const BoardImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 97.5vw;
  height: auto;
`;

const PlayableArea = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

// Orizontal section of the board (board has 3 sections)
// | Player 1 store | holes | Player 2 store |
const Section = styled.div`
  height: 80%;
  z-index: 1;
`;

const PlayerZeroStoreSection = styled(Section)`
  width: 17%;
  display: flex;
  justify-content: center;
`;

const PlayerOneStoreSection = styled(Section)`
  width: 17%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const HolesSection = styled(Section)`
  display: flex;
  flex-direction: column;
  width: 66%;
`;

const PlayerStore = styled.div`
  height: 85%;
  width: 55%;
  border-bottom-right-radius: 300px;
  border-bottom-left-radius: 300px;
  border-top-right-radius: 300px;
  border-top-left-radius: 300px;
  background-color: #5e43255e;
  box-shadow: inset 0px 9px 3px #5e4325;
`;

const PlayerHole = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
`;

const PlayerZeroHoles = styled(PlayerHole)``;

const PlayerOneHoles = styled(PlayerHole)`
  align-items: flex-end;
`;

interface Size {
  width: number;
  height: number;
}

interface BoardProps {
  className?: string;
}

const Board = ({ className }: BoardProps) => {
  const [containerSize, setContainerSize] = useState<Size>({ width: 0, height: 0 });
  const [isRotated, setIsRotated] = useState(false);

  // reference to the board image
  let imageRef: HTMLImageElement;

  // update parameters of the board
  function update() {
    // create the --vh variable in css for calculating the right height fo mobile phone
    // This should move to another place, for sure.
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    // update the size of the container to match the image size
    setContainerSize({ width: imageRef.width, height: imageRef.height });

    // check if the screen is vertical or horizontal
    if (window.innerWidth >= window.innerHeight) {
      setIsRotated(false);
    } else {
      setIsRotated(true);
    }
  }

  // OnMount (This will run only once)
  useEffect(() => {
    // update everything
    update();

    // update always when the screen size is changed
    window.addEventListener("resize", update, false);
  }, []);

  return (
    <Container className={isRotated ? "rotated " : "" + className} style={{ width: containerSize.width, height: containerSize.height }}>
      <BoardImg
        className="board-img"
        src="assets/board.png"
        onLoad={() => {
          update();
        }}
        ref={(ref) => {
          if (ref != null) {
            imageRef = ref;
          }
        }}
      />

      <PlayableArea className={"playable-area"}>
        <PlayerZeroStoreSection className={"player0-store-section"}>
          <PlayerStore />
        </PlayerZeroStoreSection>
        <HolesSection className={"holes-section"}>
          <PlayerZeroHoles className={"player0-holes"}>
            <Hole stones={4} />
            <Hole />
            <Hole />
            <Hole />
            <Hole />
            <Hole />
          </PlayerZeroHoles>
          <PlayerOneHoles className={"player1-holes"}>
            <Hole />
            <Hole />
            <Hole />
            <Hole />
            <Hole />
            <Hole />
          </PlayerOneHoles>
        </HolesSection>
        <PlayerOneStoreSection className={"player1-store-section"}>
          <PlayerStore />
        </PlayerOneStoreSection>
      </PlayableArea>
    </Container>
  );
};

export default Board;
