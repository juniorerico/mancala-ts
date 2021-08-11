import React, { useState } from "react";
import styled from "styled-components";
import Board from "./Board";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url(assets/background.png);
  overflow: hidden;
`;

function Game() {
  return (
    <Container>
      <Board className="board" scale={0.975} />
    </Container>
  );
}

export default Game;
