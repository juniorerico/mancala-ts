import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  top: 96px;

  &.rotated {
    top: 0px;
    transform: rotate(90deg) translateY(-100%);
    transform-origin: top left;
  }
`;

const BoardImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 97.5vw;
  height: auto;
`;

const Wrapper = styled.div`
  height: 80%;
  top: 9%;
  z-index: 1;
`;

const PlayerOneStoreWrapper = styled(Wrapper)`
  width: 12.5%;
`;

const PlayerTwoStoreWrapper = styled(Wrapper)`
  width: 12.5%;
`;

const HolesWrapper = styled(Wrapper)`
  width: 66%;
  top: 9%;
`;

interface Size {
  width: number;
  height: number;
}

interface Position {
  left: number | string;
  top: number | string;
}

interface BoardProps {
  scale?: number;
  className?: string;
}

const Board = ({ scale = 0.975, className }: BoardProps) => {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [isRotated, setIsRotated] = useState(false);

  let imageRef: HTMLImageElement;

  function update() {
    console.log(imageRef.height);
    setSize({ width: imageRef.width, height: imageRef.height });

    if (window.innerWidth >= window.innerHeight) {
      setIsRotated(false);
    } else {
      setIsRotated(true);
    }
  }

  useEffect(() => {
    update();
    window.addEventListener("resize", update, false);
  }, []);

  return (
    <Container className={isRotated ? "rotated " : "" + className} style={{ width: size.width, height: size.height }}>
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
      <PlayerOneStoreWrapper style={{ backgroundColor: "red" }}></PlayerOneStoreWrapper>
      <HolesWrapper style={{ backgroundColor: "green" }}></HolesWrapper>
      <PlayerTwoStoreWrapper style={{ backgroundColor: "blue" }}></PlayerTwoStoreWrapper>
    </Container>
  );
};

export default Board;
