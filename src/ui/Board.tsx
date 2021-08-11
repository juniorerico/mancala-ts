import React, { useEffect, useState } from "react";
import styled from "styled-components";

// Styled components

// Board container
const Container = styled.div`
  &.rotated {
    top: 0px;
    transform: rotate(90deg) translateY(-100%);
    transform-origin: top left;
  }

  &.rotated > .board-img {
    width: 97.5vh;
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
  top: 9%;
  z-index: 1;
`;

const PlayerOneStoreSection = styled(Section)`
  width: 12.5%;
`;

const PlayerTwoStoreSection = styled(Section)`
  width: 12.5%;
`;

const HolesSection = styled(Section)`
  width: 66%;
  top: 9%;
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
    console.log("image");
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
        style={{}}
        onLoad={() => {
          update();
        }}
        ref={(ref) => {
          if (ref != null) {
            imageRef = ref;
          }
        }}
      />

      <PlayableArea>
        <PlayerOneStoreSection style={{ backgroundColor: "red" }}></PlayerOneStoreSection>
        <HolesSection style={{ backgroundColor: "green" }}></HolesSection>
        <PlayerTwoStoreSection style={{ backgroundColor: "blue" }}></PlayerTwoStoreSection>
      </PlayableArea>
    </Container>
  );
};

export default Board;
