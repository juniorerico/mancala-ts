import React from "react";
import styled from "styled-components";
import Board from "./Board";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(assets/background.png);
  overflow: hidden;
`;

function Game() {
  return (
    <Container>
      <Board className="board" />
    </Container>
  );
}

export default Game;
